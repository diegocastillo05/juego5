const cards = document.querySelectorAll('.card');
const btnVolver = document.getElementById('volver');
const btnContinuar = document.getElementById('continuar');
let activeCard = null;

// Agregar inputs ocultos en cada tarjeta
cards.forEach(card => {
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    card.appendChild(input);

    // Guardar letras iniciales
    const divs = card.querySelectorAll('.texto div[data-correct]');
    divs.forEach(div => {
        div.dataset.initial = div.textContent; // Guardar la letra inicial visible
    });
});

// Función para verificar el estado del juego
function checkGameStatus() {
    const allTrue = Array.from(cards).every(card => card.classList.contains('true'));
    if (allTrue) {
        btnContinuar.classList.add('active');
        btnVolver.classList.remove('active');
    } else {
        btnVolver.classList.add('active');
        btnContinuar.classList.remove('active');
    }
}

// Manejar escritura en el juego
document.addEventListener('input', (event) => {
    if (!activeCard) return;

    const textoContainer = activeCard.querySelector('.texto');
    const vacios = Array.from(textoContainer.querySelectorAll('div:not(.space)')).filter(div => div.textContent === '_' || div.dataset.filled === 'true');

    let currentIndex = textoContainer.dataset.index || 0;
    currentIndex = parseInt(currentIndex, 10);

    const letra = event.data ? event.data.toUpperCase() : ''; // Obtener la letra del input

    if (letra === '' && currentIndex > 0) {
        // Simular BACKSPACE
        currentIndex--;
        vacios[currentIndex].textContent = '_';
        delete vacios[currentIndex].dataset.filled;
    } else if (/^[A-Z]$/.test(letra) && currentIndex < vacios.length) {
        vacios[currentIndex].textContent = letra;
        vacios[currentIndex].dataset.filled = 'true';
        currentIndex++;
    }

    textoContainer.dataset.index = currentIndex;

    const isCorrect = vacios.every(div => div.textContent === div.dataset.correct);
    if (isCorrect) {
        //activeCard.classList.remove('active');
        activeCard.classList.add('true');
    } else if (currentIndex === vacios.length) {
        activeCard.classList.remove('active');
        activeCard.classList.add('false');
    } else {
        activeCard.classList.remove('true', 'false');
    }

    checkGameStatus();
    activeCard.querySelector('input').value = ''; // Limpiar el input después de cada escritura
});

// Resetear el juego
btnVolver.addEventListener('click', () => {
    cards.forEach(card => {
        const textoContainer = card.querySelector('.texto');
        const divs = card.querySelectorAll('.texto div[data-correct]');
        divs.forEach(div => {
            div.textContent = div.dataset.initial; // Restaurar letras iniciales
            delete div.dataset.filled;
        });
        textoContainer.dataset.index = 0; // Reiniciar índice de escritura
        card.classList.remove('true', 'false');
    });
    activeCard = null; // Deseleccionar cualquier tarjeta activa
    checkGameStatus();
});

// Activar un card al hacer clic
cards.forEach(card => {
    card.addEventListener('click', () => {
        if (activeCard) activeCard.classList.remove('active');
        activeCard = card;
        activeCard.classList.add('active');
        const input = activeCard.querySelector('input');
        input.focus(); // Enfocar el input para mostrar el teclado en móviles
    });
});