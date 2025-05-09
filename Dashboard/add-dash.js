document.addEventListener('DOMContentLoaded', function() {
    // Captura elementos do DOM
    const addDashboardBtn = document.getElementById('addDashboardBtn');
    const newDashboardModal = document.getElementById('newDashboardModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const createDashboardBtn = document.getElementById('createDashboardBtn');
    const colorOptions = document.querySelectorAll('.color-option');
    const layoutOptions = document.querySelectorAll('.layout-option');
    
    // Abre o modal ao clicar no botão de adicionar
    addDashboardBtn.addEventListener('click', function() {
        newDashboardModal.style.display = 'flex';
    });
    
    // Fecha o modal
    function closeModal() {
        newDashboardModal.style.display = 'none';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Clique fora do modal também fecha
    newDashboardModal.addEventListener('click', function(e) {
        if (e.target === newDashboardModal) {
            closeModal();
        }
    });
    
    // Tratamento de seleção de cores
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove seleção anterior
            colorOptions.forEach(op => op.classList.remove('selected'));
            // Adiciona seleção atual
            this.classList.add('selected');
        });
    });
    
    // Tratamento de seleção de layout
    layoutOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove seleção anterior
            layoutOptions.forEach(op => op.classList.remove('selected'));
            // Adiciona seleção atual
            this.classList.add('selected');
        });
    });
    
    // Criação do dashboard
    createDashboardBtn.addEventListener('click', function() {
        const dashboardName = document.getElementById('dashboardName').value;
        const dashboardType = document.getElementById('dashboardType').value;
        
        // Validação simples
        if (!dashboardName || !dashboardType) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Coleta dados do formulário
        const selectedColor = document.querySelector('.color-option.selected').getAttribute('data-color');
        const selectedLayout = document.querySelector('.layout-option.selected').getAttribute('data-layout');
        
        // Coleta métricas selecionadas
        const selectedMetrics = [];
        document.querySelectorAll('input[id^="metric"]:checked').forEach(checkbox => {
            selectedMetrics.push(checkbox.id.replace('metric', ''));
        });
        
        // Coleta filtros selecionados
        const selectedFilters = [];
        document.querySelectorAll('input[id^="filter"]:checked').forEach(checkbox => {
            selectedFilters.push(checkbox.id.replace('filter', ''));
        });
        
        // Aqui você enviaria os dados para o servidor ou processaria localmente
        console.log('Novo Dashboard:', {
            name: dashboardName,
            type: dashboardType,
            color: selectedColor,
            layout: selectedLayout,
            metrics: selectedMetrics,
            filters: selectedFilters
        });
        
        // Simula criação bem-sucedida
        alert('Dashboard criado com sucesso!');
        closeModal();
        
        // Em uma aplicação real, você redirecionaria para o novo dashboard
        // ou atualizaria a interface para mostrar o novo dashboard
    });

    // Manter compatibilidade com a navegação existente
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(el => {
                el.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const targetTab = this.getAttribute('data-tab');
            const currentPage = getCurrentPage();
            
            if (currentPage === targetTab) {
                toggleTabContent(targetTab);
            } else {
                navigateToPage(targetTab);
            }
        });
    });

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

    function navigateToPage(targetTab) {
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
                return;
        }
        
        window.location.href = targetUrl;
    }

    function toggleTabContent(tabId) {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        const contentElement = document.getElementById(tabId);
        if (contentElement) {
            contentElement.style.display = 'block';
        }
    }
});