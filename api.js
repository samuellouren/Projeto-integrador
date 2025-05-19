import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import cors from 'cors';

const app = express();
const db = new Database('users.db');
const SECRET = 'seusegredoseguro';  // Ideal: usar variável ambiente

app.use(cors());
app.use(express.json());

// Criação da tabela de usuários
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// Cadastro de usuário
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = db.prepare('SELECT 1 FROM users WHERE email = ?').get(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, normalizedEmail, hashedPassword);

    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// Login de usuário
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido.', token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// Listar todos usuários (sem senha)
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email FROM users').all();
    res.json(users);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
