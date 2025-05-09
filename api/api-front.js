// script-integracao.js - Script para conectar o frontend ao backend

// Função para verificar se o usuário está autenticado
function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirecionar para a página de login se não houver token
    if (!window.location.pathname.includes('Login')) {
      window.location.href = '../Login/index.html';
    }
    return false;
  }
  
  return true;
}

// Função para fazer requisições à API com autenticação
async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`/api${endpoint}`, options);
    
    // Verifica se a resposta tem conteúdo antes de tentar converter para JSON
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      // Se não for JSON, obtém o texto da resposta
      const text = await response.text();
      responseData = text ? { message: text } : {};
    }
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Erro na requisição');
    }
    
    return responseData;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Função para obter o usuário atual
async function getCurrentUser() {
  if (!checkAuth()) return null;
  
  try {
    const response = await apiRequest('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    localStorage.removeItem('token');
    window.location.href = '../Login/index.html';
    return null;
  }
}

// Função para logout
function logout() {
  localStorage.removeItem('token');
  window.location.href = '../Login/index.html';
}

// Funções para manipulação de candidatos
const candidateAPI = {
  // Obter todos os candidatos
  getAll: async () => {
    return await apiRequest('/candidates');
  },
  
  // Obter candidato por ID
  getById: async (id) => {
    return await apiRequest(`/candidates/${id}`);
  },
  
  // Criar novo candidato
  create: async (candidateData) => {
    return await apiRequest('/candidates', 'POST', candidateData);
  },
  
  // Atualizar candidato
  update: async (id, candidateData) => {
    return await apiRequest(`/candidates/${id}`, 'PUT', candidateData);
  },
  
  // Excluir candidato
  delete: async (id) => {
    return await apiRequest(`/candidates/${id}`, 'DELETE');
  }
};

// Funções para manipulação de vagas
const jobAPI = {
  // Obter todas as vagas
  getAll: async () => {
    return await apiRequest('/jobs');
  },
  
  // Obter vaga por ID
  getById: async (id) => {
    return await apiRequest(`/jobs/${id}`);
  },
  
  // Criar nova vaga
  create: async (jobData) => {
    return await apiRequest('/jobs', 'POST', jobData);
  },
  
  // Atualizar vaga
  update: async (id, jobData) => {
    return await apiRequest(`/jobs/${id}`, 'PUT', jobData);
  },
  
  // Excluir vaga
  delete: async (id) => {
    return await apiRequest(`/jobs/${id}`, 'DELETE');
  },
  
  // Obter candidatos de uma vaga
  getCandidates: async (id) => {
    return await apiRequest(`/jobs/${id}/candidates`);
  }
};

// Funções para manipulação de aplicações
const applicationAPI = {
  // Obter todas as aplicações
  getAll: async () => {
    return await apiRequest('/applications');
  },
  
  // Criar nova aplicação
  create: async (candidateId, jobId) => {
    return await apiRequest('/applications', 'POST', { candidateId, jobId });
  }
};

// Função para obter dados do dashboard
async function getDashboardData() {
  return await apiRequest('/dashboard');
}

// Verifica a autenticação ao carregar a página (exceto na página de login)
document.addEventListener('DOMContentLoaded', function() {
  if (!window.location.pathname.includes('Login')) {
    checkAuth();
    
    // Adicionar evento de logout aos botões com classe 'logout-btn'
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    });
  }
});

// Exportar as funções para uso global
window.checkAuth = checkAuth;
window.apiRequest = apiRequest;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.candidateAPI = candidateAPI;
window.jobAPI = jobAPI;
window.applicationAPI = applicationAPI;
window.getDashboardData = getDashboardData;