// server.js - Arquivo principal da API TalentMatch
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Inicialização do Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Configurações de ambiente
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/talentmatch';
const JWT_SECRET = process.env.JWT_SECRET || 'talentmatch_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Conexão com o MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => {
  console.error('Erro na conexão com o MongoDB:', err.message);
  process.exit(1);
});

// Definição dos Modelos (Schemas)

// Modelo de Usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe um nome']
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe um email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, informe um email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor, informe uma senha'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criptografar senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar senhas
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Modelo de Candidato
const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome do candidato']
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe o email do candidato'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, informe um email válido'
    ]
  },
  phone: {
    type: String
  },
  skills: {
    type: [String],
    required: [true, 'Por favor, informe ao menos uma habilidade']
  },
  experience: {
    type: Number,
    default: 0
  },
  education: {
    type: String
  },
  status: {
    type: String,
    enum: ['disponível', 'em processo', 'contratado', 'indisponível'],
    default: 'disponível'
  },
  resume: {
    type: String // URL para o currículo
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Modelo de Vaga
const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, informe o título da vaga']
  },
  description: {
    type: String,
    required: [true, 'Por favor, informe a descrição da vaga']
  },
  company: {
    type: String,
    required: [true, 'Por favor, informe a empresa']
  },
  location: {
    type: String,
    required: [true, 'Por favor, informe a localização']
  },
  type: {
    type: String,
    enum: ['CLT', 'PJ', 'Estágio', 'Freelancer'],
    required: [true, 'Por favor, informe o tipo de contratação']
  },
  salary: {
    type: Number
  },
  requirements: {
    type: [String],
    required: [true, 'Por favor, informe os requisitos da vaga']
  },
  status: {
    type: String,
    enum: ['aberta', 'em processo', 'fechada'],
    default: 'aberta'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Modelo de Aplicação
const ApplicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['aplicado', 'em análise', 'entrevista', 'aprovado', 'reprovado'],
    default: 'aplicado'
  },
  notes: {
    type: String
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Criar os modelos
const User = mongoose.model('User', UserSchema);
const Candidate = mongoose.model('Candidate', CandidateSchema);
const Job = mongoose.model('Job', JobSchema);
const Application = mongoose.model('Application', ApplicationSchema);

// Middleware de Autenticação
const auth = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no cabeçalho
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado'
      });
    }

    // Verificar o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adicionar o usuário à requisição
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Acesso não autorizado'
    });
  }
};

// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  // Erros de duplicação (código 11000 do MongoDB)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Registro duplicado encontrado'
    });
  }

  // Erros de validação
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor'
  });
};

// Função auxiliar para gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Função auxiliar para enviar resposta com token
const sendTokenResponse = (user, statusCode, res) => {
  // Criar token
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    httpOnly: true
  };

  // Usar HTTPS em produção
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

// ========================
// ROTAS DA API
// ========================

// Rotas de Autenticação

// Registrar usuário
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já registrado'
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
});

// Login de usuário
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar email e senha
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, informe email e senha'
      });
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se a senha está correta
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
});

// Obter usuário logado
app.get('/api/auth/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// Logout
app.get('/api/auth/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Rotas de Candidatos

// Obter todos os candidatos
app.get('/api/candidates', auth, async (req, res, next) => {
  try {
    const candidates = await Candidate.find({ createdBy: req.user.id });
    
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (err) {
    next(err);
  }
});

// Obter candidato por ID
app.get('/api/candidates/:id', auth, async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato não encontrado'
      });
    }

    // Verificar propriedade
    if (candidate.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Usuário não autorizado a acessar este candidato'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    next(err);
  }
});

// Criar candidato
app.post('/api/candidates', auth, async (req, res, next) => {
  try {
    // Adicionar usuário ao corpo da requisição
    req.body.createdBy = req.user.id;
    
    const candidate = await Candidate.create(req.body);
    
    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    next(err);
  }
});

// Atualizar candidato
app.put('/api/candidates/:id', auth, async (req, res, next) => {
  try {
    let candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato não encontrado'
      });
    }

    // Verificar propriedade
    if (candidate.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Usuário não autorizado a atualizar este candidato'
      });
    }

    candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    next(err);
  }
});

// Excluir candidato
app.delete('/api/candidates/:id', auth, async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato não encontrado'
      });
    }

    // Verificar propriedade
    if (candidate.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Usuário não autorizado a excluir este candidato'
      });
    }

    await Candidate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// Rotas de Vagas

// Obter todas as vagas
app.get('/api/jobs', auth, async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
});

// Obter vaga por ID
app.get('/api/jobs/:id', auth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada'
      });
    }

    // Verificar propriedade
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Usuário não autorizado a acessar esta vaga'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    next(err);
  }
});

// Criar vaga
app.post('/api/jobs', auth, async (req, res, next) => {
  try {
    // Adicionar usuário ao corpo da requisição
    req.body.createdBy = req.user.id;
    
    const job = await Job.create(req.body);
    
    res.status(201).json({
      success: true,
      data: job
    });
  } catch (err) {
    next(err);
  }
});

// Atualizar vaga
app.put('/api/jobs/:id', auth, async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada'
      });
    }

    // Verificar propriedade
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Usuário não autorizado a atualizar esta vaga'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    next(err);
  }
});

// Excluir vaga
app.delete('/api/jobs/:id', auth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada'
      });
    }

    // Verificar propriedade
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Usuário não autorizado a excluir esta vaga'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// Aplicar candidato a uma vaga
app.post('/api/applications', auth, async (req, res, next) => {
  try {
    const { candidateId, jobId } = req.body;
    
    // Verificar se a vaga existe
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada'
      });
    }
    
    // Verificar se o candidato existe
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato não encontrado'
      });
    }
    
    // Criar aplicação
    const application = await Application.create({
      candidate: candidateId,
      job: jobId,
      status: 'aplicado'
    });
    
    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    next(err);
  }
});

// Obter todas as aplicações
app.get('/api/applications', auth, async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('candidate')
      .populate('job');
      
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
});

// Obter candidatos de uma vaga
app.get('/api/jobs/:id/candidates', auth, async (req, res, next) => {
  try {
    const applications = await Application.find({ job: req.params.id })
      .populate('candidate')
      .populate('job');
      
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
});

// Obter estatísticas para o dashboard
app.get('/api/dashboard', auth, async (req, res, next) => {
  try {
    // Contagem de vagas
    const jobCount = await Job.countDocuments({ createdBy: req.user.id });
    
    // Contagem de candidatos
    const candidateCount = await Candidate.countDocuments({ createdBy: req.user.id });
    
    // Contagem de aplicações
    const applicationCount = await Application.countDocuments();
    
    // Vagas por status
    const jobsByStatus = await Job.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Candidatos por status
    const candidatesByStatus = await Candidate.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Vagas recentes
    const recentJobs = await Job.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Candidatos recentes
    const recentCandidates = await Candidate.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          jobs: jobCount,
          candidates: candidateCount,
          applications: applicationCount
        },
        jobsByStatus,
        candidatesByStatus,
        recentJobs,
        recentCandidates
      }
    });
  } catch (err) {
    next(err);
  }
});

// Rota para a página de login (para servir o HTML)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../Login/index.html'));
});

// Rota para a página de dashboard (para servir o HTML)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../Dashboard/index.html'));
});

// Atualizar o script de login para utilizar a API
app.get('/api/script-login', (req, res) => {
  const loginScript = `
  // Função para redirecionar ao dashboard
  function redirectToDashboard() {
      console.log("Redirecionando para o dashboard...");
      window.location.href = "../Dashboard/index.html";
  }

  // Função para mostrar mensagem de erro
  function showError(message = "Por favor, insira um email e senha válidos.") {
      const errorMessage = document.getElementById('error-message');
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
      
      // Esconder a mensagem após 3 segundos
      setTimeout(function() {
          errorMessage.style.display = 'none';
      }, 3000);
  }

  // Função principal que será executada quando a página carregar
  function setupLoginForm() {
      console.log("Script de login carregado");
      
      // Selecionar o botão de login
      const loginBtn = document.getElementById('login-btn');
      
      if (!loginBtn) {
          console.error("Botão de login não encontrado!");
          return;
      }
      
      console.log("Botão de login encontrado, adicionando evento");
      
      // Adicionar evento de clique usando onclick
      loginBtn.onclick = function(e) {
          console.log("Botão de login clicado");
          
          // Prevenir comportamento padrão
          if (e) e.preventDefault();
          
          // Obter valores dos campos
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          console.log("Email preenchido:", !!email);
          console.log("Senha preenchida:", !!password);
          
          // Verificação simples
          if (email && password) {
              // Fazer requisição para a API
              fetch('/api/auth/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email, password })
              })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      // Armazenar token no localStorage
                      localStorage.setItem('token', data.token);
                      redirectToDashboard();
                  } else {
                      showError(data.message || "Credenciais inválidas");
                  }
              })
              .catch(error => {
                  console.error('Erro:', error);
                  showError("Erro ao conectar com o servidor");
              });
          } else {
              showError();
          }
          
          // Retornar false para garantir que o formulário não seja enviado
          return false;
      };
      
      // Adicionar também um evento ao formulário, caso o botão esteja dentro de um
      const form = document.querySelector('form');
      if (form) {
          console.log("Formulário encontrado, adicionando evento");
          form.onsubmit = function(e) {
              console.log("Formulário submetido");
              e.preventDefault();
              loginBtn.onclick();
              return false;
          };
      }
  }

  // Registrar o evento DOMContentLoaded
  document.addEventListener('DOMContentLoaded', setupLoginForm);

  // Caso o documento já esteja carregado, executar a função imediatamente
  if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(setupLoginForm, 1);
  }
  `;
  
  res.setHeader('Content-Type', 'application/javascript');
  res.send(loginScript);
});

// Middleware de erro no final
app.use(errorHandler);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportar a aplicação
module.exports = app;