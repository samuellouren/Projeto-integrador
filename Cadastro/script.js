document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const errorMessage = document.getElementById('error-message');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const nomeInput = document.getElementById('nome');
    const registerBtn = document.getElementById('register-btn');

    // Função para verificar força da senha
    function checkPasswordStrength(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (password.length < minLength) {
            return 'fraca';
        }
        
        let strength = 0;
        if (hasUppercase) strength++;
        if (hasLowercase) strength++;
        if (hasNumbers) strength++;
        if (hasSpecial) strength++;
        
        if (strength <= 2) return 'fraca';
        if (strength === 3) return 'média';
        return 'forte';
    }

    // Validação de email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Função para exibir erro
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Esconde a mensagem de erro após 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Função para validar o formulário
    function validateForm() {
        // Validações básicas
        if (!nomeInput.value.trim()) {
            showError('Por favor, insira seu nome completo.');
            return false;
        }

        if (!emailInput.value.trim()) {
            showError('Por favor, insira seu email.');
            return false;
        }

        if (!isValidEmail(emailInput.value.trim())) {
            showError('Por favor, insira um email válido.');
            return false;
        }

        if (!passwordInput.value) {
            showError('Por favor, insira sua senha.');
            return false;
        }

        const passwordStrength = checkPasswordStrength(passwordInput.value);
        if (passwordStrength === 'fraca') {
            showError('Sua senha é muito fraca. Use pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.');
            return false;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            showError('As senhas não coincidem.');
            return false;
        }

        if (!document.getElementById('terms').checked) {
            showError('Você precisa concordar com os Termos de Uso.');
            return false;
        }

        return true;
    }

    // Adicionar feedback visual aos campos conforme são preenchidos
    const inputs = [nomeInput, emailInput, passwordInput, confirmPasswordInput];
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const parent = this.parentElement;
            
            // Remover classes anteriores
            parent.classList.remove('valid', 'error');
            
            // Validar campo específico
            if (this.value.trim() === '') {
                parent.classList.add('error');
            } else if (this.id === 'email' && !isValidEmail(this.value)) {
                parent.classList.add('error');
            } else if (this.id === 'password' && checkPasswordStrength(this.value) === 'fraca') {
                parent.classList.add('error');
            } else if (this.id === 'confirm-password' && this.value !== passwordInput.value) {
                parent.classList.add('error');
            } else {
                parent.classList.add('valid');
            }
        });
    });

    // Envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simular API - Armazenar no localStorage
            const userData = {
                nome: nomeInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value // Em uma aplicação real, nunca armazene senhas em texto puro
            };
            
            // Salvar dados do usuário (simulação)
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Mudar texto do botão para indicar progresso
            registerBtn.innerHTML = 'Cadastrando... <i class="fas fa-spinner fa-spin"></i>';
            registerBtn.disabled = true;
            
            // Simular tempo de resposta da API
            setTimeout(() => {
                // Redirecionar para página de confirmação
                window.location.href = "confirmacao.html";
            }, 1500);
        }
    });
});