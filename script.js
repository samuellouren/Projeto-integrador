// Função para criar o efeito das estrelas
function createStars() {
    const stars = document.getElementById("stars");
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 8;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty("--duration", `${duration}s`);
        star.style.animationDelay = `${delay}s`;

        stars.appendChild(star);
    }
}

// Redireciona para dashboard
function redirectToDashboard() {
    console.log("Redirecionando para o dashboard...");
    window.location.href = "../Dashboard/novo-dasbord.html";
}

// Mostra mensagem de erro
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message || "Erro no login";
    errorMessage.style.display = "block";

    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

// Faz login com a API
async function login(email, password) {
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message);
            return false;
        }

        localStorage.setItem("token", data.token);
        redirectToDashboard();
        return true;
    } catch (error) {
        showError("Erro ao conectar com o servidor.");
        console.error(error);
        return false;
    }
}

// Setup do formulário de login
function setupLoginForm() {
    console.log("Script de login carregado");

    const loginBtn = document.getElementById("login-btn");
    if (!loginBtn) {
        console.error("Botão de login não encontrado!");
        return;
    }

    loginBtn.onclick = async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            showError("Preencha email e senha.");
            return;
        }

        console.log("Tentando login com email:", email);
        await login(email, password);
    };

    const form = document.querySelector("form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            loginBtn.click();
        };
    }
}

// Inicializa tudo quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    createStars();
    setupLoginForm();
});
