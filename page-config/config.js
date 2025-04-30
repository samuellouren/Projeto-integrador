// Script para a página de configurações

document.addEventListener('DOMContentLoaded', function() {
    // Navegação por tabs na barra inferior (mantendo o código existente)
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
    document.querySelector('.floating-action-btn')?.addEventListener('click', function() {
        alert('Criar nova vaga ou candidato');
    });

    // ===== Scripts específicos para a página de configurações =====

    // Gerenciamento do botão "Editar Perfil"
    document.querySelector('.settings-btn')?.addEventListener('click', function() {
        alert('Editar informações de perfil');
    });

    // Botões de edição para informações pessoais
    document.querySelectorAll('.settings-edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Pega o elemento pai do botão
            const settingsItem = this.closest('.settings-item');
            
            // Pega o label e o valor atual
            const label = settingsItem.querySelector('.settings-label').textContent;
            const currentValue = settingsItem.querySelector('.settings-value').textContent;
            
            // Simula um prompt para edição
            const newValue = prompt(`Editar ${label}:`, currentValue);
            
            // Se o usuário não cancelou e forneceu um valor
            if (newValue !== null && newValue.trim() !== '') {
                settingsItem.querySelector('.settings-value').textContent = newValue;
                
                // Simula uma notificação de sucesso
                showToast(`${label} atualizado com sucesso!`);
            }
        });
    });

    // Botões de ação específicos
    document.querySelectorAll('.settings-action-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Pega o elemento pai do botão
            const settingsItem = this.closest('.settings-item');
            
            // Pega o label para identificar a ação
            const label = settingsItem.querySelector('.settings-label').textContent;
            
            switch(label) {
                case 'Exportar Dados':
                    alert('Iniciando download de dados...');
                    // Simulação de download
                    setTimeout(() => showToast('Dados exportados com sucesso!'), 1500);
                    break;
                case 'Histórico de Login':
                    showModal('Histórico de Login', 
                              `<div class="login-history">
                                <div class="login-item">
                                  <div>São Paulo, BR</div>
                                  <div>Chrome - Windows</div>
                                  <div>30/04/2025 09:23</div>
                                </div>
                                <div class="login-item">
                                  <div>São Paulo, BR</div>
                                  <div>App Mobile - Android</div>
                                  <div>29/04/2025 17:45</div>
                                </div>
                                <div class="login-item">
                                  <div>Rio de Janeiro, BR</div>
                                  <div>Safari - MacOS</div>
                                  <div>28/04/2025 14:12</div>
                                </div>
                              </div>`);
                    break;
                case 'Alterar Senha':
                    showModal('Alteração de Senha',
                              `<form id="change-password-form">
                                <div class="form-group">
                                  <label>Senha Atual</label>
                                  <input type="password" class="form-input" required>
                                </div>
                                <div class="form-group">
                                  <label>Nova Senha</label>
                                  <input type="password" class="form-input" required>
                                </div>
                                <div class="form-group">
                                  <label>Confirmar Nova Senha</label>
                                  <input type="password" class="form-input" required>
                                </div>
                                <button type="submit" class="settings-btn">Alterar Senha</button>
                              </form>`);
                    
                    // Adiciona listener para o formulário dentro do modal
                    document.getElementById('change-password-form')?.addEventListener('submit', function(e) {
                        e.preventDefault();
                        hideModal();
                        showToast('Senha alterada com sucesso!');
                    });
                    break;
                case 'Autenticação de 2 Fatores':
                    showModal('Autenticação de 2 Fatores',
                              `<div class="two-factor-auth">
                                <p>Status: <strong>Ativado</strong></p>
                                <p>Método: <strong>Aplicativo Autenticador</strong></p>
                                <div class="qr-placeholder"></div>
                                <p>Escaneie o código QR com seu aplicativo de autenticação ou insira a chave manualmente.</p>
                                <div class="backup-code">
                                  <p>Sua chave de backup:</p>
                                  <code>ABCD-EFGH-IJKL-MNOP</code>
                                </div>
                                <button class="settings-btn">Desativar 2FA</button>
                              </div>`);
                    break;
                default:
                    alert(`Ação para: ${label}`);
            }
        });
    });

    // Botões da zona de perigo
    document.querySelectorAll('.settings-danger-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            const confirmAction = confirm(`Tem certeza que deseja ${action.toLowerCase()} sua conta? Esta ação pode ter consequências irreversíveis.`);
            
            if (confirmAction) {
                // Simulação de ação
                showToast(`Conta ${action.toLowerCase()}da com sucesso!`);
                
                // Redirecionar para login após breve delay (simulação)
                if (action === 'Excluir') {
                    setTimeout(() => {
                        alert('Você será redirecionado para a página de login.');
                        window.location.href = '#';
                    }, 2000);
                }
            }
        });
    });

    // Toggles de configurações
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const toggleItem = this.closest('.settings-toggle-item');
            const featureName = toggleItem.querySelector('.settings-toggle-label').textContent;
            
            if (this.checked) {
                showToast(`${featureName} ativado`);
                
                // Lógica especial para o modo noturno
                if (featureName === 'Modo Noturno') {
                    document.body.classList.add('dark-mode');
                }
            } else {
                showToast(`${featureName} desativado`);
                
                // Lógica especial para o modo noturno
                if (featureName === 'Modo Noturno') {
                    document.body.classList.remove('dark-mode');
                }
            }
        });
    });

    // Funções utilitárias para a UI

    // Função para exibir toast (notificação temporária)
    function showToast(message) {
        // Checa se já existe um toast e remove
        let existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Cria o novo toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Adiciona ao body
        document.body.appendChild(toast);
        
        // Anima entrada
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove após timeout
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Função para exibir modal
    function showModal(title, content) {
        // Remove modal existente, se houver
        let existingModal = document.querySelector('.modal-container');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Cria o container do modal
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        
        // Cria o conteúdo do modal
        modalContainer.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // Adiciona ao body
        document.body.appendChild(modalContainer);
        
        // Anima entrada
        setTimeout(() => {
            modalContainer.classList.add('show');
        }, 10);
        
        // Adiciona listener para fechar
        modalContainer.querySelector('.modal-close-btn').addEventListener('click', hideModal);
        
        // Fechar ao clicar fora
        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                hideModal();
            }
        });
    }

    // Função para esconder modal
    function hideModal() {
        const modalContainer = document.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.classList.remove('show');
            setTimeout(() => {
                modalContainer.remove();
            }, 300);
        }
    }

    // Adiciona estilos CSS necessários para toast e modal dinamicamente
    addDynamicStyles();

    function addDynamicStyles() {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            /* Toast Styles */
            .toast {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background-color: var(--primary);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 80%;
                text-align: center;
            }
            
            .toast.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            
            /* Modal Styles */
            .modal-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                padding: 20px;
            }
            
            .modal-container.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 8px;
                width: 100%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            
            .modal-container.show .modal-content {
                transform: translateY(0);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border-bottom: 1px solid var(--gray-200);
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 1.2rem;
            }
            
            .modal-close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--gray-500);
            }
            
            .modal-body {
                padding: 16px;
            }
            
            /* Form styles dentro do modal */
            .form-group {
                margin-bottom: 16px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 0.9rem;
            }
            
            .form-input {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid var(--gray-300);
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            /* Estilos específicos para o histórico de login */
            .login-history {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .login-item {
                padding: 12px;
                background-color: var(--gray-100);
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            .login-item div:first-child {
                font-weight: 500;
            }
            
            .login-item div:last-child {
                font-size: 0.8rem;
                color: var(--gray-500);
                margin-top: 4px;
            }
            
            /* Estilos para 2FA */
            .two-factor-auth {
                text-align: center;
            }
            
            .qr-placeholder {
                width: 180px;
                height: 180px;
                background-color: var(--gray-200);
                margin: 16px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: var(--gray-500);
            }
            
            .qr-placeholder:after {
                content: "QR Code";
            }
            
            .backup-code {
                background-color: var(--gray-100);
                padding: 12px;
                border-radius: 6px;
                margin: 16px 0;
            }
            
            .backup-code code {
                font-family: monospace;
                font-size: 1.1rem;
                letter-spacing: 1px;
            }
            
            /* Estilos para dark mode */
            body.dark-mode {
                background-color: var(--gray-800);
                color: var(--light);
            }
            
            body.dark-mode .card,
            body.dark-mode .modal-content {
                background-color: var(--gray-700);
                color: var(--light);
            }
            
            body.dark-mode .card-header {
                border-bottom-color: var(--gray-600);
            }
            
            body.dark-mode .settings-item {
                border-bottom-color: var(--gray-600);
            }
            
            body.dark-mode .settings-value {
                color: var(--gray-300);
            }
            
            body.dark-mode .bottom-nav {
                background-color: var(--gray-700);
            }
            
            body.dark-mode .bottom-nav a {
                color: var(--gray-300);
            }
            
            body.dark-mode .bottom-nav a.active {
                color: var(--accent);
            }
            
            body.dark-mode .settings-toggle-description {
                color: var(--gray-300);
            }
        `;
        document.head.appendChild(styleEl);
    }
});