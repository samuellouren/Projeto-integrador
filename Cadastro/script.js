// Função para criar estrelas de forma aleatória no fundo
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Posição aleatória
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamanho aleatório
        const size = Math.random() * 3;
        
        // Animação com delay aleatório
        const animDuration = 3 + Math.random() * 3;
        const animDelay = Math.random() * 5;
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${animDuration}s`;
        star.style.animationDelay = `${animDelay}s`;
        
        starsContainer.appendChild(star);
    }
}

// Validação de email
function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de senha forte
function isPasswordStrong(password) {
    // Pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

// Exibir mensagem de erro
function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
    
    // Ocultar a mensagem após 5 segundos
    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 5000);
}

// Evento de envio do formulário
document.addEventListener('DOMContentLoaded', function() {
    // Criar estrelas de fundo quando a página carregar
    createStars();
    
    const form = document.getElementById('cadastro-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obter valores dos campos
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsChecked = document.getElementById('terms').checked;
        
        // Validações
        if (nome === '') {
            showError('Por favor, insira seu nome completo.');
            return;
        }
        
        if (!isEmailValid(email)) {
            showError('Por favor, insira um email válido.');
            return;
        }
        
        if (!isPasswordStrong(password)) {
            showError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número.');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('As senhas não coincidem.');
            return;
        }
        
        if (!termsChecked) {
            showError('Você precisa concordar com os Termos de Uso e Política de Privacidade.');
            return;
        }
        
        // Se chegou até aqui, o formulário está válido
        // Simular envio com feedback visual
        const button = document.getElementById('cadastrar-btn');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        
        // Simulação de envio para backend (substituir por chamada real API)
        setTimeout(() => {
            // Armazenar dados no localStorage (apenas para demonstração)
            const userData = {
                nome: nome,
                email: email,
                dataCadastro: new Date().toISOString()
            };
            
            localStorage.setItem('talentMatchUser', JSON.stringify(userData));
            
            // Redirecionar para página de sucesso/login
            window.location.href = '../Login/index.html?cadastroSucesso=true';
        }, 2000);
    });
});

// Adicionar efeito visual nos inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
        // Quando o input recebe foco
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focus');
        });
        
        // Quando o input perde foco
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.parentElement.classList.remove('input-focus');
            }
        });
        
        // Verificar se já tem valor ao carregar a página
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('input-focus');
        }
    });
});