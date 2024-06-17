// Počká na načtení celé stránky
document.addEventListener('DOMContentLoaded', () => {
    // Získání referencí na prvky HTML
    const canvas = document.getElementById('gameCanvas'); // Plátno pro vykreslování tvarů
    const ctx = canvas.getContext('2d'); // Kontext pro vykreslování 2D grafiky
    const startBtn = document.getElementById('startBtn'); // Tlačítko pro spuštění hry
    const submitAnswerBtn = document.getElementById('submitAnswerBtn'); // Tlačítko pro odeslání odpovědi
    const nicknameInput = document.getElementById('nickname'); // Pole pro zadání přezdívky hráče
    const squareInput = document.getElementById('squareInput'); // Pole pro zadání počtu čtverců
    const circleInput = document.getElementById('circleInput'); // Pole pro zadání počtu kruhů
    const scoreDisplay = document.getElementById('score'); // Zobrazení aktuálního skóre
    const answerSection = document.getElementById('answerSection'); // Sekce s odpověďmi
    const timeBar = document.getElementById('timeBar'); // Ukazatel zbývajícího času

    // Pole pro ukládání tvarů
    let shapes = [];
    // Proměnné pro skóre a úroveň
    let score = 0;
    let level = 1;
    // Proměnná pro interval (časovač)
    let interval;

    // Typy tvarů
    const shapeTypes = ['square', 'circle'];

    // Funkce pro kontrolu překrytí tvarů
    function checkOverlap(shape1, shape2) {
        return !(shape1.x + 50 < shape2.x || shape2.x + 50 < shape1.x || shape1.y + 50 < shape2.y || shape2.y + 50 < shape1.y);
    }

    // Funkce pro generování náhodného tvaru
    function getRandomShape() {
        let newShape;
        do {
            newShape = {
                shapeType: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                x: Math.random() * (canvas.width - 50),
                y: Math.random() * (canvas.height - 50)
            };
        } while (shapes.some(shape => checkOverlap(shape, newShape)));
        return newShape;
    }

    // Funkce pro vykreslování tvarů
    function drawShapes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach(shape => {
            if (shape.shapeType === 'square') {
                ctx.fillRect(shape.x, shape.y, 50, 50);
            } else if (shape.shapeType === 'circle') {
                ctx.beginPath();
                ctx.arc(shape.x + 25, shape.y + 25, 25, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    // Funkce pro spuštění hry
    function startGame() {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            alert('Prosím, zadejte svou přezdívku.');
            return;
        }

        // Deaktivace vstupního pole pro přezdívku a tlačítka pro spuštění hry
        nicknameInput.disabled = true;
        startBtn.disabled = true;
        startBtn.style.display = 'none';
        // Zobrazení sekce s odpověďmi
        answerSection.style.display = 'block';
        // Nastavení skóre a úrovně na výchozí hodnoty
        score = 0;
        level = 1;
        // Aktualizace zobrazení skóre
        scoreDisplay.textContent = score;
        // Spuštění první úrovně hry
        nextLevel();
    }

    // Funkce pro přechod na další úroveň
    function nextLevel() {
        // Generování nových tvarů pro aktuální úroveň
        shapes = Array.from({ length: level }, getRandomShape);

        // Výpis počtu čtverců a kruhů do konzole
        const correctSquares = shapes.filter(shape => shape.shapeType === 'square').length;
        const correctCircles = shapes.filter(shape => shape.shapeType === 'circle').length;
        console.log(`Úroveň ${level}: čtverců - ${correctSquares}, kruhů - ${correctCircles}`);

        // Vykreslení tvarů na plátno
        drawShapes();
        // Spuštění časovače pro aktuální úroveň
        startTimer(1000 + (3000 / level));
    }

    // Funkce pro spuštění časovače
    function startTimer(duration) {
        let startTime = Date.now();
        interval = setInterval(() => {
            let elapsedTime = Date.now() - startTime;
            let remainingTime = duration - elapsedTime;
            let percentage = (remainingTime / duration) * 100;
            // Aktualizace zobrazení zbývajícího času
            timeBar.style.height = percentage + '%';
            // Zastavení časovače po uplynutí času
            if (remainingTime <= 0) {
                clearInterval(interval);
                // Vyčištění plátna a vstupních polí
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                squareInput.value = '';
                circleInput.value = '';
            }
        }, 50);
    }

    // Funkce pro kontrolu odpovědí hráče
    function checkAnswer() {
        clearInterval(interval); // Zastavení časovače

        // Získání odpovědí hráče a převedení na čísla
        const squareAnswer = parseInt(squareInput.value.trim()) || 0;
        const circleAnswer = parseInt(circleInput.value.trim()) || 0;

        // Spočítání počtu správných čtverců a kruhů na plátně
        const correctSquares = shapes.filter(shape => shape.shapeType === 'square').length;
        const correctCircles = shapes.filter(shape => shape.shapeType === 'circle').length;

        // Porovnání odpovědí hráče s počtem správných tvarů
        if (squareAnswer === correctSquares && circleAnswer === correctCircles) {
            // Přičtení bodů, pokud jsou odpovědi správné
            score++;
            // Aktualizace zobrazení skóre
            scoreDisplay.textContent = score;
            // Zvýšení úrovně a přechod na další úroveň hry
            level++;
            nextLevel();
        } else {
            // Ukončení hry, pokud jsou odpovědi nesprávné
            endGame();
        }
    }

    // Funkce pro ukončení hry
    function endGame() {
        alert(`Hra skončila! Vaše skóre: ${score}`);
        saveScore(nicknameInput.value.trim(), score);
        resetGame();
    }

    // Funkce pro resetování hry
    function resetGame() {
        // Aktivace vstupního pole pro přezdívku a tlačítka pro spuštění hry
        nicknameInput.disabled = false;
        startBtn.disabled = false;
        startBtn.style.display = 'block';
        // Skrytí sekce s odpověďmi
        answerSection.style.display = 'none';
        // Vyčištění plátna a vstupních polí
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        squareInput.value = '';
        circleInput.value = '';
        circleInput.value = '';
        scoreDisplay.textContent = 0;
        shapes = [];
        score = 0;
        level = 1;
    }

    // Funkce pro uložení skóre
    function saveScore(nickname, score) {
        fetch('/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname, score })
        })
        .then(response => {
            if (response.ok) {
                console.log('Skóre bylo úspěšně uloženo.');
            } else {
                console.error('Chyba při ukládání skóre.');
            }
        })
        .catch(error => {
            console.error('Chyba při ukládání skóre:', error);
        });
    }

    // Nastavení posluchačů událostí pro tlačítka
    startBtn.addEventListener('click', startGame);
    submitAnswerBtn.addEventListener('click', checkAnswer);
});
