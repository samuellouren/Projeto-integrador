// Estrelas de fundo
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

window.addEventListener("load", createStars);

// Função para exibir mensagens
function showMessage(message, isError = true) {
  const messageBox = document.getElementById("error-message");
  messageBox.textContent = message;
  messageBox.style.display = "block";
  messageBox.style.color = isError ? "red" : "green";

  if (isError) {
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 4000);
  }
}

// Validação de email
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Envio do formulário
document.getElementById("cadastro-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const termsChecked = document.getElementById("terms").checked;

  // Validações
  if (!nome || !email || !password || !confirmPassword) {
    showMessage("Todos os campos são obrigatórios.");
    return;
  }

  if (!validateEmail(email)) {
    showMessage("Digite um email válido.");
    return;
  }

  if (password.length < 6) {
    showMessage("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("As senhas não coincidem.");
    return;
  }

  if (!termsChecked) {
    showMessage("Você deve aceitar os termos de uso para continuar.");
    return;
  }

  // Enviar dados à API
  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
  showMessage("Cadastro realizado com sucesso! Redirecionando...", false);

  setTimeout(() => {
    window.location.href = "../Login/index.html";
  }, 2000);
}

 else {
      showMessage(data.message || "Erro no cadastro.");
    }
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    showMessage("Erro ao conectar com o servidor.");
  }
});
