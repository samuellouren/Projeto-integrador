document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');
    
    // Máscara para telefone
    const telefone = document.getElementById('telefone');
    telefone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length > 2) {
                value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10);
            }
            e.target.value = value;
        }
    });
    
    // Validação do formulário
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar se as senhas coincidem
        if (password.value !== confirmPassword.value) {
            errorMessage.textContent = 'As senhas não coincidem.';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Verificar se a senha tem pelo menos 6 caracteres
        if (password.value.length < 6) {
            errorMessage.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Se tudo estiver correto, enviar o formulário
        window.location.href = 'confirmacao.html';
    });
});