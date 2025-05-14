// JavaScript simples para interatividade básica
        document.addEventListener('DOMContentLoaded', function() {
            // Botão de ação flutuante
            const floatingBtn = document.querySelector('.floating-action-btn');
            floatingBtn.addEventListener('click', function() {
                alert('Funcionalidade em desenvolvimento!');
            });
            
            // Seletor de período
            const filterSelect = document.querySelector('.filter-select');
            filterSelect.addEventListener('change', function() {
                console.log('Período selecionado:', this.value);
                // Aqui você implementaria a lógica para filtrar os dados pelo período selecionado
            });
            
            // Efeito hover nas barras do gráfico
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.addEventListener('mouseenter', function() {
                    this.style.opacity = '0.8';
                });
                bar.addEventListener('mouseleave', function() {
                    this.style.opacity = '1';
                });
            });
        });