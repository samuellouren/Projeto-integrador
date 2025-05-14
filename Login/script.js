// Função para redirecionar ao dashboard
function redirectToDashboard() {
    console.log("Redirecionando para o dashboard...");
    window.location.href = "../Dashboard/novo-dasbord.html";
}

// Função para mostrar mensagem de erro
function showError() {
    const errorMessage = document.getElementById('error-message');
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
    
    // Adicionar evento de clique usando onclick (método alternativo)
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
            redirectToDashboard();
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
// Controlador de navegação para TalentMatch Mobile
document.addEventListener('DOMContentLoaded', function() {
    // Captura todos os links da navegação inferior
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    // Adiciona event listener para cada link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Previne o comportamento padrão do link
            e.preventDefault();
            
            // Obtém o atributo data-tab que identifica a seção
            const targetTab = this.getAttribute('data-tab');
            
            // Define o redirecionamento baseado no targetTab
            let targetUrl = '';
            
            switch(targetTab) {
                case 'dashboard':
                    targetUrl = '/Dashboard/novo-dasbord.html';
                    break;
                case 'candidates':
                    targetUrl = '/candidatos/candidatos.html';
                    break;
                case 'jobs':
                    targetUrl = '/vagas/vagas.html';
                    break;
                case 'analytics':
                    targetUrl = '/analises/analises.html';
                    break;
                case 'settings':
                    targetUrl = '/page-config/config.html';
                    break;
                default:
                    // Se nenhum caso corresponder, permanece na página atual
                    return;
            }
            
            // Redireciona para a página desejada
            window.location.href = targetUrl;
        });
    });
    
    // Adiciona funcionalidade ao botão de ação flutuante
    const floatingActionBtn = document.querySelector('.floating-action-btn');
    if (floatingActionBtn) {
        floatingActionBtn.addEventListener('click', function() {
            // Determina qual ação tomar baseado na página atual
            const currentPage = getCurrentPage();
            
            switch(currentPage) {
                case 'dashboard':
                    alert('Adicionar novo dashboard');
                    break;
                case 'candidates':
                    alert('Adicionar novo candidato');
                    break;
                case 'jobs':
                    alert('Adicionar nova vaga');
                    break;
                case 'analytics':
                    alert('Criar novo relatório');
                    break;
                case 'settings':
                    alert('Adicionar nova configuração');
                    break;
                default:
                    alert('Adicionar novo item');
            }
        });
    }
});

// Função auxiliar para determinar a página atual com base na URL
function getCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes('Dashboard') || path === '/' || path === '') {
        return 'dashboard';
    } else if (path.includes('candidatos')) {
        return 'candidates';
    } else if (path.includes('vagas')) {
        return 'jobs';
    } else if (path.includes('analises')) {
        return 'analytics';
    } else if (path.includes('configuracoes')) {
        return 'settings';
    }
    
    return 'unknown';
}