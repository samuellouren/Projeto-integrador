/**
 * Controlador de Navegação para TalentMatch Mobile
 * Combina navegação por tabs e redirecionamento com estado ativo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Captura todos os links da navegação inferior
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    // Adiciona event listener para cada link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe ativa de todos os links
            navLinks.forEach(el => {
                el.classList.remove('active');
            });
            
            // Adiciona a classe ativa ao link clicado
            this.classList.add('active');
            
            // Obtém o atributo data-tab que identifica a seção
            const targetTab = this.getAttribute('data-tab');
            
            // Verifica se estamos na mesma página ou precisamos redirecionar
            const currentPage = getCurrentPage();
            
            if (currentPage === targetTab) {
                // Estamos na mesma página, apenas alterna o conteúdo visível
                toggleTabContent(targetTab);
            } else {
                // Precisamos redirecionar para outra página
                navigateToPage(targetTab);
            }
        });
    });
    
    // Adiciona funcionalidade ao botão de ação flutuante
    const floatingActionBtn = document.querySelector('.floating-action-btn');
    if (floatingActionBtn) {
        floatingActionBtn.addEventListener('click', function() {
            // Determina qual ação tomar baseado na página atual
            const currentPage = getCurrentPage();
            handleFloatingAction(currentPage);
        });
    }
    
    // Define a tab ativa com base na página atual ao carregar
    highlightActiveTab();
});

/**
 * Alterna a visibilidade do conteúdo baseado na tab selecionada
 */
function toggleTabContent(tabId) {
    // Oculta todos os conteúdos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Mostra o conteúdo correspondente
    const contentElement = document.getElementById(tabId);
    if (contentElement) {
        contentElement.style.display = 'block';
    }
}

/**
 * Navega para a página correspondente à tab selecionada
 */
function navigateToPage(targetTab) {
    let targetUrl = '';
    
    switch(targetTab) {
        case 'dashboard':
            targetUrl = '../Dashboard/index.html';
            break;
        case 'candidates':
            targetUrl = '../candidatos/candidatos.html';
            break;
        case 'jobs':
            targetUrl = '../vagas/vagas.html';
            break;
        case 'analytics':
            targetUrl = '../analises/analise.html';
            break;
        case 'settings':
            targetUrl = '../configuracoes/config.html';
            break;
        default:
            // Se nenhum caso corresponder, permanece na página atual
            return;
    }
    
    // Redireciona para a página desejada
    window.location.href = targetUrl;
}

/**
 * Executa a ação correspondente ao botão flutuante baseado na página atual
 */
function handleFloatingAction(currentPage) {
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
}

/**
 * Determina a página atual com base na URL
 */
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

/**
 * Destaca a tab ativa com base na página atual
 */
function highlightActiveTab() {
    const currentPage = getCurrentPage();
    
    // Remove a classe ativa de todos os links
    document.querySelectorAll('.bottom-nav a').forEach(link => {
        link.classList.remove('active');
        
        // Adiciona a classe ativa ao link correspondente à página atual
        if (link.getAttribute('data-tab') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Se estivermos em uma página com tabs, mostra o conteúdo apropriado
    const tabContent = document.getElementById(currentPage);
    if (tabContent) {
        toggleTabContent(currentPage);
    }
}