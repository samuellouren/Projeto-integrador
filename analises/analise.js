// Script para funcionalidades da página de Análises

document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da UI
    const periodSelector = document.querySelector('.page-header .filter-select');
    const metricCards = document.querySelectorAll('.metric-card');
    const chartContainers = document.querySelectorAll('.chart-container');
    
    // Animação dos gráficos de barra ao carregar a página
    animateBarCharts();
    
    // Adicionar eventos aos filtros de período
    if (periodSelector) {
        periodSelector.addEventListener('change', function() {
            updateAnalytics(this.value);
        });
    }
    
    // Função para animar os gráficos de barra
    function animateBarCharts() {
        const bars = document.querySelectorAll('.bar');
        
        bars.forEach(bar => {
            const targetHeight = bar.style.height;
            bar.style.height = '0%';
            
            setTimeout(() => {
                bar.style.height = targetHeight;
            }, 100);
        });
        
        // Animar as linhas dos gráficos
        const lineSegments = document.querySelectorAll('.line-segment');
        lineSegments.forEach(segment => {
            const originalTransform = segment.style.transform;
            segment.style.transform = 'rotate(0deg)';
            
            setTimeout(() => {
                segment.style.transform = originalTransform;
            }, 300);
        });
        
        // Animar barras de progresso
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 300);
        });
    }
    
    // Função para atualizar as métricas com base no período selecionado
    function updateAnalytics(period) {
        // Simulação de carregamento
        metricCards.forEach(card => {
            card.style.opacity = '0.5';
        });
        
        chartContainers.forEach(container => {
            container.style.opacity = '0.5';
        });
        
        // Simulação de tempo de carregamento dos dados
        setTimeout(() => {
            // Dados simulados para diferentes períodos
            let data;
            
            switch(period) {
                case 'Últimos 90 dias':
                    data = {
                        conversionRate: '22.5%',
                        timeToHire: '21 dias',
                        costPerHire: 'R$ 3.780',
                        qualifiedRate: '68%',
                        // Aqui você poderia incluir os dados para os gráficos também
                    };
                    break;
                case 'Este ano':
                    data = {
                        conversionRate: '23.2%',
                        timeToHire: '19 dias',
                        costPerHire: 'R$ 3.650',
                        qualifiedRate: '70%',
                    };
                    break;
                case 'Todo período':
                    data = {
                        conversionRate: '21.6%',
                        timeToHire: '22 dias',
                        costPerHire: 'R$ 3.950',
                        qualifiedRate: '65%',
                    };
                    break;
                default: // Últimos 30 dias (padrão)
                    data = {
                        conversionRate: '24.8%',
                        timeToHire: '18 dias',
                        costPerHire: 'R$ 3.450',
                        qualifiedRate: '72%',
                    };
            }
            
            // Atualizar valores nas métricas
            updateMetricValues(data);
            
            // Restaurar opacidade
            metricCards.forEach(card => {
                card.style.opacity = '1';
            });
            
            chartContainers.forEach(container => {
                container.style.opacity = '1';
            });
            
            // Reanimação dos gráficos
            animateBarCharts();
            
            // Atualizar o período mostrado nos cabeçalhos dos gráficos
            updatePeriodLabels(period);
            
        }, 800); // Tempo simulado de carregamento
    }
    
    // Função para atualizar os valores das métricas
    function updateMetricValues(data) {
        // Encontrar e atualizar os elementos com os valores corretos
        const metricsMapping = [
            { selector: '.metric-title:contains("Taxa de Conversão")', value: data.conversionRate },
            { selector: '.metric-title:contains("Tempo até Contratação")', value: data.timeToHire },
            { selector: '.metric-title:contains("Custo por Contratação")', value: data.costPerHire },
            { selector: '.metric-title:contains("Candidaturas Qualificadas")', value: data.qualifiedRate }
        ];
        
        // Esta é uma implementação simplificada; em uma aplicação real,
        // você usaria querySelector ou uma biblioteca como jQuery
        metricsMapping.forEach(metric => {
            const metricCards = document.querySelectorAll('.metric-card');
            metricCards.forEach(card => {
                const title = card.querySelector('.metric-title');
                if (title && title.textContent.includes(metric.selector.split(':contains("')[1].split('")')[0])) {
                    const valueElement = card.querySelector('.metric-value');
                    if (valueElement) {
                        valueElement.textContent = metric.value;
                    }
                }
            });
        });
    }
    
    // Função para atualizar os rótulos de período
    function updatePeriodLabels(period) {
        const periodLabels = document.querySelectorAll('.chart-period');
        periodLabels.forEach(label => {
            label.textContent = period;
        });
        
        // Atualizar também o período no cabeçalho de status das vagas
        const jobStatsPeriod = document.querySelector('.job-stats-period');
        if (jobStatsPeriod) {
            // Adaptar o texto do período para este elemento específico
            switch(period) {
                case 'Últimos 90 dias':
                    jobStatsPeriod.textContent = 'Fev-Abr, 2025';
                    break;
                case 'Este ano':
                    jobStatsPeriod.textContent = 'Jan-Abr, 2025';
                    break;
                case 'Todo período':
                    jobStatsPeriod.textContent = 'Histórico Completo';
                    break;
                default: // Últimos 30 dias
                    jobStatsPeriod.textContent = 'Abril, 2025';
            }
        }
    }
    
    // Adiciona funcionalidade ao botão flutuante
    const floatingBtn = document.querySelector('.floating-action-btn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', function() {
            alert('Esta funcionalidade permite criar um novo relatório personalizado. Implementação pendente.');
        });
    }
    
    // Importar o controlador de navegação global
    loadNavigationController();
});

// Função para carregar o controlador de navegação
function loadNavigationController() {
    // Captura todos os links da navegação inferior
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    // Adiciona event listener para cada link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('Este link ainda não está configurado.');
                return;
            }
            
            // Navegação normal para links com URLs configurados
            // O href já está definido no HTML, então o navegador irá seguir o link
        });
    });
}