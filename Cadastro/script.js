// Create stars
        function createStars() {
            const stars = document.getElementById('stars');
            const starCount = 200;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                // Random size (1-3px)
                const size = Math.random() * 2 + 1;
                
                // Random duration (3-8s)
                const duration = Math.random() * 5 + 3;
                
                // Random delay
                const delay = Math.random() * 8;
                
                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.setProperty('--duration', `${duration}s`);
                star.style.animationDelay = `${delay}s`;
                
                stars.appendChild(star);
            }
        }
        
        // Initialize stars on page load
        window.addEventListener('load', createStars);
        
        // Cadastro functionality
        document.getElementById('cadastrar-btn').addEventListener('click', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            if (nome && email && telefone && password && confirmPassword && terms) {
                if (password === confirmPassword) {
                    // Simulação de um cadastro bem-sucedido
                    // Em um cenário real, você enviaria esses dados para um backend
                    alert('Cadastro realizado com sucesso!');
                    // Redirecionar para a página de login ou dashboard
                    // window.location.href = "login.html";
                } else {
                    document.getElementById('error-message').textContent = 'As senhas não coincidem.';
                    document.getElementById('error-message').style.display = 'block';
                }
            } else {
                document.getElementById('error-message').textContent = 'Por favor, preencha todos os campos corretamente.';
                document.getElementById('error-message').style.display = 'block';
            }
            
            // Ocultar a mensagem de erro após 3 segundos
            setTimeout(function() {
                document.getElementById('error-message').style.display = 'none';
            }, 3000);
        });
        
        // Máscara para o campo de telefone
        document.getElementById('telefone').addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                value = '(' + value;
                
                if (value.length > 3) {
                    value = value.substring(0, 3) + ') ' + value.substring(3);
                }
                
                if (value.length > 10) {
                    value = value.substring(0, 10) + '-' + value.substring(10);
                }
                
                if (value.length > 15) {
                    value = value.substring(0, 15);
                }
            }
            
            e.target.value = value;
        });