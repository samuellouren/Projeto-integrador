// Navegação por tabs na barra inferior
document.querySelectorAll('.bottom-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove a classe ativa de todos os links
        document.querySelectorAll('.bottom-nav a').forEach(el => {
            el.classList.remove('active');
        });
        
        // Adiciona a classe ativa ao link clicado
        this.classList.add('active');
        
        // Oculta todos os conteúdos
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Mostra o conteúdo correspondente
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).style.display = 'block';
    });
});

// Comportamento do botão de ação flutuante (FAB)
document.querySelector('.floating-action-btn').addEventListener('click', function() {
    alert('Criar nova vaga ou candidato');
});