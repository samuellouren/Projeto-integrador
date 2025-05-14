
        document.querySelectorAll('.bottom-nav a').forEach(tab => {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                const targetTab = this.getAttribute('data-tab');

                document.querySelectorAll('.bottom-nav a').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');

                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab)?.classList.add('active');
            });
        });

        document.querySelectorAll('.bookmark').forEach(bookmark => {
            bookmark.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        });

        document.querySelectorAll('.filter-tag .remove').forEach(removeBtn => {
            removeBtn.addEventListener('click', function () {
                this.parentElement.remove();
            });
        });

        document.querySelector('.floating-action-btn').addEventListener('click', function () {
            alert('Adicionar novo candidato');
        });
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
                    targetUrl = '../Dashboard/novo-dasbord.html';
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
                    targetUrl = '../page-config/config.html';
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
    