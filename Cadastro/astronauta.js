// Create starry background
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initializeAstronaut();
});

function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 2;
        
        // Random duration for twinkling
        const duration = 3 + Math.random() * 7;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        
        starsContainer.appendChild(star);
    }
}

function initializeAstronaut() {
    // Create astronaut container
    const astronautContainer = document.createElement('div');
    astronautContainer.id = 'astronaut-container';
    astronautContainer.className = 'astronaut-container';
    document.body.appendChild(astronautContainer);
    
    // Create astronaut character
    const astronaut = document.createElement('div');
    astronaut.id = 'astronaut';
    astronaut.className = 'astronaut';
    astronautContainer.appendChild(astronaut);
    
    // Create speech bubble
    const speechBubble = document.createElement('div');
    speechBubble.id = 'speech-bubble';
    speechBubble.className = 'speech-bubble';
    astronautContainer.appendChild(speechBubble);
    
    // Add initial message
    showAstronautMessage("Olá! Sou o Astro, seu assistente espacial. Precisa de ajuda para criar sua conta?");
    
    // Add event listeners
    addFormEventListeners();
    
    // Make astronaut clickable
    astronaut.addEventListener('click', function() {
        const randomTips = [
            "Sua senha deve ser forte! Combine letras, números e símbolos para maior segurança.",
            "Já é cadastrado? Clique em 'Faça login' abaixo do formulário.",
            "Verifique seu e-mail após o cadastro para confirmar sua conta!",
            "O TalentMatch conecta profissionais em todo o universo!",
            "Precisa de ajuda? Estou aqui para auxiliar em sua jornada!"
        ];
        
        const randomTip = randomTips[Math.floor(Math.random() * randomTips.length)];
        showAstronautMessage(randomTip);
    });
    
    // Add floating animation to astronaut
    animateAstronaut();
}

function showAstronautMessage(message, duration = 5000) {
    const speechBubble = document.getElementById('speech-bubble');
    speechBubble.textContent = message;
    speechBubble.style.display = 'block';
    
    // Clear previous timeout
    if (window.speechTimeout) {
        clearTimeout(window.speechTimeout);
    }
    
    // Auto-hide message after duration
    window.speechTimeout = setTimeout(() => {
        speechBubble.style.display = 'none';
    }, duration);
}

function animateAstronaut() {
    const astronaut = document.getElementById('astronaut');
    
    // Create random movement within bounds
    function moveRandomly() {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        // Keep astronaut in viewport bounds
        const maxX = containerWidth - 150;
        const maxY = containerHeight - 150;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.max(50, Math.random() * maxY * 0.7); // Keep in upper portion of screen
        
        astronaut.style.transition = 'transform 10s ease-in-out';
        astronaut.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 20 - 10}deg)`;
        
        setTimeout(moveRandomly, 10000);
    }
    
    // Start animation
    moveRandomly();
}

function addFormEventListeners() {
    // Field focus events
    document.getElementById('nome').addEventListener('focus', function() {
        showAstronautMessage("Digite seu nome completo para que possamos te conhecer melhor!");
    });
    
    document.getElementById('email').addEventListener('focus', function() {
        showAstronautMessage("Use seu melhor e-mail. Ele será necessário para confirmação!");
    });
    
    document.getElementById('password').addEventListener('focus', function() {
        showAstronautMessage("Crie uma senha forte! Combine letras, números e símbolos para maior segurança.");
    });
    
    document.getElementById('confirm-password').addEventListener('focus', function() {
        showAstronautMessage("Confirme sua senha para garantir que não houve erro de digitação.");
    });
    
    // Terms checkbox
    document.getElementById('terms').addEventListener('change', function(e) {
        if(e.target.checked) {
            showAstronautMessage("Obrigado por aceitar os termos! Estamos quase lá.");
        } else {
            showAstronautMessage("É necessário aceitar os termos para continuar.");
        }
    });
    
    // Form submission
    document.getElementById('cadastro-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        // Simple validation
        if(!nome || !email || !password || !confirmPassword || !terms) {
            showAstronautMessage("Ops! Parece que alguns campos estão faltando.");
            document.getElementById('error-message').style.display = 'block';
            return;
        }
        
        if(password !== confirmPassword) {
            showAstronautMessage("As senhas não coincidem! Verifique e tente novamente.");
            document.getElementById('error-message').textContent = "As senhas não coincidem.";
            document.getElementById('error-message').style.display = 'block';
            return;
        }
        
        // Success
        document.getElementById('error-message').style.display = 'none';
        showAstronautMessage(`Ótimo trabalho, ${nome.split(' ')[0]}! Seu cadastro foi enviado com sucesso. Bem-vindo à TalentMatch!`, 10000);
        
        // Here you would normally send the data to your server
        console.log("Form submitted:", { nome, email, password, terms });
        
        // Simulating successful registration
        setTimeout(() => {
            // Redirect or show success message
            alert("Cadastro realizado com sucesso!");
            // window.location.href = "../Login/index.html"; // Uncomment to redirect
        }, 1500);
    });
    
    // Login link
    document.querySelector('.login-link a').addEventListener('mouseenter', function() {
        showAstronautMessage("Já tem uma conta? Vamos fazer login então!");
    });
    
}