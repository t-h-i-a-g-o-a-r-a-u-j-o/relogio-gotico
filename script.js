document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const horaMinutoEl = document.getElementById('hora-minuto');
    const segundoEl = document.getElementById('segundo');
    const dataAtualEl = document.getElementById('data-atual');
    const body = document.body;
    const nuvensContainer = document.getElementById('container-nuvens');
    const advance1hBtn = document.getElementById('advance1hBtn');
    const advance6hBtn = document.getElementById('advance6hBtn');
    const resetTimeBtn = document.getElementById('resetTimeBtn');

    // --- VARIÁVEL DE TEMPO SIMULADO ---
    let simulatedTime = new Date();

    // --- LÓGICA DO CICLO DE IMAGENS ---
    let fundoAtivoEl = null;

    function setBackgroundByHour(hora) {
        let idDoFundo;
        if (hora >= 6 && hora < 10) { // Amanhecer das 6h às 9h59
            idDoFundo = 'bg-amanhecer';
        } else if (hora >= 10 && hora < 17) { // Dia das 10h às 16h59
            idDoFundo = 'bg-dia';
        } else if (hora >= 17 && hora < 20) { // Pôr do sol das 17h às 19h59
            idDoFundo = 'bg-pordosol';
        } else { // Noite para todas as outras horas
            idDoFundo = 'bg-noite';
        }

        const novoFundoEl = document.getElementById(idDoFundo);

        if (novoFundoEl && novoFundoEl !== fundoAtivoEl) {
            if (fundoAtivoEl) {
                fundoAtivoEl.classList.remove('visible');
            }
            novoFundoEl.classList.add('visible');
            fundoAtivoEl = novoFundoEl;
        }
    }
    
    // --- FUNÇÃO PRINCIPAL DO RELÓGIO ---
    function atualizarRelogio() {
        simulatedTime.setSeconds(simulatedTime.getSeconds() + 1);

        const horas = simulatedTime.getHours();
        const minutos = String(simulatedTime.getMinutes()).padStart(2, '0');
        const segundos = String(simulatedTime.getSeconds()).padStart(2, '0');
        
        horaMinutoEl.textContent = `${String(horas).padStart(2, '0')}:${minutos}`;
        segundoEl.textContent = segundos;
        dataAtualEl.textContent = simulatedTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        setBackgroundByHour(horas);
    }

    // --- LÓGICA DO RELÂMPAGO CONDICIONAL ---
    function triggerLightning() {
        const currentHour = simulatedTime.getHours();
        if (currentHour >= 20 || currentHour < 6) { // Só dispara se for noite ou madrugada
            nuvensContainer.classList.add('storm-brewing');
            setTimeout(() => {
                body.classList.add('lightning-active');
                setTimeout(() => {
                    body.classList.remove('lightning-active');
                    nuvensContainer.classList.remove('storm-brewing');
                }, 250);
            }, 1500);
        }
        setTimeout(triggerLightning, Math.random() * 12000 + 8000);
    }

    // --- EVENT LISTENERS ---
    advance1hBtn.addEventListener('click', () => {
        simulatedTime.setHours(simulatedTime.getHours() + 1);
        atualizarRelogio();
    });
    advance6hBtn.addEventListener('click', () => {
        simulatedTime.setHours(simulatedTime.getHours() + 6);
        atualizarRelogio();
    });
    resetTimeBtn.addEventListener('click', () => {
        simulatedTime = new Date();
        atualizarRelogio();
    });

    // --- INICIALIZAÇÃO ---
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);
    setTimeout(triggerLightning, 5000); // Inicia o primeiro relâmpago após 5s
});