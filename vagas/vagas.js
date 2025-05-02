document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre abas
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Apenas para links que não são links diretos para outras páginas
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
                
                const tabId = this.getAttribute('data-tab');
                
                // Remove a classe active de todos os links e conteúdos
                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                
                // Adiciona a classe active ao link clicado e ao conteúdo correspondente
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            }
        });
    });
    
    // Funcionalidade de pesquisa
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const jobCards = document.querySelectorAll('.job-card');
            
            jobCards.forEach(card => {
                const jobTitle = card.querySelector('.job-title').textContent.toLowerCase();
                const jobDepartment = card.querySelector('.job-department').textContent.toLowerCase();
                
                if (jobTitle.includes(searchTerm) || jobDepartment.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Manipulação de filtros
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            filterJobs();
        });
    });
    
    function filterJobs() {
        const departmentFilter = document.querySelectorAll('.filter-select')[0].value;
        const statusFilter = document.querySelectorAll('.filter-select')[1].value;
        const jobCards = document.querySelectorAll('.job-card');
        
        jobCards.forEach(card => {
            const jobDepartment = card.querySelector('.job-department').textContent;
            const jobStatus = card.querySelector('.status').textContent;
            
            const departmentMatch = departmentFilter === 'Todos os departamentos' || jobDepartment === departmentFilter;
            const statusMatch = statusFilter === 'Todos os status' || jobStatus === statusFilter;
            
            if (departmentMatch && statusMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Manipulação do botão flutuante
    const floatingBtn = document.querySelector('.floating-action-btn');
    
    if (floatingBtn) {
        floatingBtn.addEventListener('click', function() {
            alert('Funcionalidade de adicionar nova vaga será implementada aqui');
        });
    }
    
    // Manipulação dos botões de ação nas vagas
    const actionButtons = document.querySelectorAll('.job-card .action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            const jobTitle = this.closest('.job-card').querySelector('.job-title').textContent;
            
            switch(action) {
                case '👥':
                    alert(`Ver candidatos para a vaga: ${jobTitle}`);
                    break;
                case '📝':
                    alert(`Editar vaga: ${jobTitle}`);
                    break;
                case '⏸️':
                    alert(`Pausar vaga: ${jobTitle}`);
                    break;
                case '▶️':
                    alert(`Ativar vaga: ${jobTitle}`);
                    break;
                default:
                    alert(`Ação não implementada para: ${jobTitle}`);
            }
        });
    });
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
                    targetUrl = '../Dashboard/index.html';
                    break;
                case 'candidates':
                    targetUrl = '../candidatos/candidatos.html';
                    break;
                case 'jobs':
                    targetUrl = '../vagas/vagas.html';
                    break;
                case 'analytics':
                    targetUrl = '../analise/analise.html';
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
    } else if (path.includes('analise')) {
        return 'analytics';
    } else if (path.includes('config')) {
        return 'settings';
    }
    
    return 'unknown';
}