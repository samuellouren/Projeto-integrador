
        document.querySelectorAll('.bottom-nav a').forEach(tab => {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                const targetTab = this.getAttribute('data-tab');

                document.querySelectorAll('.bottom-nav a').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');

                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab)?.classList.add('active');
            });
        });

        document.querySelectorAll('.bookmark').forEach(bookmark => {
            bookmark.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        });

        document.querySelectorAll('.filter-tag .remove').forEach(removeBtn => {
            removeBtn.addEventListener('click', function () {
                this.parentElement.remove();
            });
        });

        document.querySelector('.floating-action-btn').addEventListener('click', function () {
            alert('Adicionar novo candidato');
        });
    