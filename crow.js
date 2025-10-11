// The Crow - Vengeance Protocol Game Logic

// Game State
let currentStage = 1;
let gameState = {
    memoryMatches: 0,
    crowsCaught: 0,
    symbolsCorrect: 0,
    quotesCorrect: 0,
    judgmentsCorrect: 0
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeRain();
    initializeLightning();
    initializeStage1();
    updateProgressBar();

    // Try to play ambient audio
    const ambientAudio = document.getElementById('ambientAudio');
    if (ambientAudio) {
        ambientAudio.volume = 0.3;
        ambientAudio.play().catch(e => console.log('Audio autoplay prevented'));
    }

    // Enable audio on user interaction
    document.addEventListener('click', function enableAudio() {
        if (ambientAudio && ambientAudio.paused) {
            ambientAudio.play().catch(e => console.log('Audio play failed'));
        }
    }, { once: true });
});

// ===== ATMOSPHERIC EFFECTS =====

function initializeRain() {
    const rainContainer = document.getElementById('rainContainer');
    const rainDropCount = 150;

    for (let i = 0; i < rainDropCount; i++) {
        const rain = document.createElement('div');
        rain.className = 'rain';
        rain.style.left = Math.random() * 100 + '%';
        rain.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        rain.style.animationDelay = Math.random() * 2 + 's';
        rainContainer.appendChild(rain);
    }
}

function initializeLightning() {
    const lightning = document.getElementById('lightning');

    function flash() {
        lightning.classList.add('flash');

        // Play thunder sound
        const thunder = document.getElementById('thunderAudio');
        if (thunder) {
            thunder.currentTime = 0;
            thunder.volume = 0.4;
            thunder.play().catch(e => console.log('Thunder sound failed'));
        }

        setTimeout(() => {
            lightning.classList.remove('flash');
        }, 100);

        // Random next flash
        setTimeout(flash, Math.random() * 15000 + 10000);
    }

    // Start lightning after 3 seconds
    setTimeout(flash, 3000);
}

// ===== STAGE 1: MEMORY CARD GAME =====

let flippedCards = [];
let matchedPairs = 0;

function initializeStage1() {
    const cards = document.querySelectorAll('.memory-card');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
                flipCard(this);
            }
        });
    });
}

function flipCard(card) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    const memory1 = card1.getAttribute('data-memory');
    const memory2 = card2.getAttribute('data-memory');

    if (memory1 === memory2) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        gameState.memoryMatches = matchedPairs;

        document.getElementById('matchCount').textContent = `Matches: ${matchedPairs}/6`;

        flippedCards = [];

        // Check if all pairs matched
        if (matchedPairs === 6) {
            setTimeout(() => {
                completeStage1();
            }, 1000);
        }
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function completeStage1() {
    document.getElementById('stage1').style.display = 'none';
    document.getElementById('stage2').style.display = 'block';
    currentStage = 2;
    updateProgressBar();
    initializeStage2();
}

// ===== STAGE 2: CROW CHASE =====

let crowTimer;
let crowInterval;
let crowTimeLeft = 30;
let crowsCaught = 0;

function initializeStage2() {
    const clickableCrow = document.getElementById('clickableCrow');
    const chaseArea = document.querySelector('.crow-chase-area');

    // Position crow randomly
    positionCrow();

    // Move crow every 1.5 seconds
    crowInterval = setInterval(positionCrow, 1500);

    // Start countdown timer
    crowTimer = setInterval(() => {
        crowTimeLeft--;
        document.getElementById('crowTimer').textContent = `Time: ${crowTimeLeft}s`;

        if (crowTimeLeft <= 0) {
            endStage2();
        }
    }, 1000);

    // Click handler
    clickableCrow.addEventListener('click', function(e) {
        e.stopPropagation();
        crowsCaught++;
        gameState.crowsCaught = crowsCaught;
        document.getElementById('crowCount').textContent = `Crows Caught: ${crowsCaught}/10`;

        // Play crow sound
        const crowSound = document.getElementById('crowSound');
        if (crowSound) {
            crowSound.currentTime = 0;
            crowSound.volume = 0.5;
            crowSound.play().catch(e => console.log('Crow sound failed'));
        }

        // Visual feedback
        clickableCrow.style.transform = 'scale(1.5)';
        setTimeout(() => {
            clickableCrow.style.transform = 'scale(1)';
        }, 200);

        if (crowsCaught >= 10) {
            endStage2();
        }
    });
}

function positionCrow() {
    const crow = document.getElementById('clickableCrow');
    const chaseArea = document.querySelector('.crow-chase-area');

    const maxX = chaseArea.offsetWidth - 60;
    const maxY = chaseArea.offsetHeight - 60;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    crow.style.left = x + 'px';
    crow.style.top = y + 'px';
}

function endStage2() {
    clearInterval(crowTimer);
    clearInterval(crowInterval);

    if (crowsCaught >= 10) {
        // Success
        setTimeout(() => {
            completeStage2();
        }, 500);
    } else {
        // Failed - restart stage
        alert('The crow escaped! Try again.');
        crowTimeLeft = 30;
        crowsCaught = 0;
        gameState.crowsCaught = 0;
        document.getElementById('crowCount').textContent = `Crows Caught: 0/10`;
        document.getElementById('crowTimer').textContent = `Time: 30s`;
        initializeStage2();
    }
}

function completeStage2() {
    document.getElementById('stage2').style.display = 'none';
    document.getElementById('stage3').style.display = 'block';
    currentStage = 3;
    updateProgressBar();
    initializeStage3();
}

// ===== STAGE 3: SYMBOL MATCHING =====

function initializeStage3() {
    const submitBtn = document.getElementById('submitSymbols');

    submitBtn.addEventListener('click', function() {
        checkSymbols();
    });
}

function checkSymbols() {
    const answers = document.querySelectorAll('.symbol-answer');
    let correctCount = 0;
    let allAnswered = true;

    answers.forEach(select => {
        const correct = select.getAttribute('data-correct');
        const selected = select.value;

        if (!selected) {
            allAnswered = false;
            return;
        }

        if (selected === correct) {
            select.classList.remove('incorrect');
            select.classList.add('correct');
            correctCount++;
        } else {
            select.classList.remove('correct');
            select.classList.add('incorrect');
        }
    });

    if (!allAnswered) {
        alert('Please answer all symbol meanings before submitting.');
        return;
    }

    gameState.symbolsCorrect = correctCount;

    if (correctCount === answers.length) {
        setTimeout(() => {
            completeStage3();
        }, 1000);
    } else {
        alert(`${correctCount} out of ${answers.length} correct. Try again.`);
    }
}

function completeStage3() {
    document.getElementById('stage3').style.display = 'none';
    document.getElementById('stage4').style.display = 'block';
    currentStage = 4;
    updateProgressBar();
    initializeStage4();
}

// ===== STAGE 4: QUOTE PUZZLE =====

function initializeStage4() {
    const submitBtn = document.getElementById('submitQuotes');

    submitBtn.addEventListener('click', function() {
        checkQuotes();
    });
}

function checkQuotes() {
    const inputs = document.querySelectorAll('.quote-input');
    let correctCount = 0;
    let allAnswered = true;

    inputs.forEach(input => {
        const correct = input.getAttribute('data-correct').toLowerCase();
        const answer = input.value.trim().toLowerCase();

        if (!answer) {
            allAnswered = false;
            return;
        }

        if (answer === correct) {
            input.classList.remove('incorrect');
            input.classList.add('correct');
            correctCount++;
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
        }
    });

    if (!allAnswered) {
        alert('Please complete all quotes before submitting.');
        return;
    }

    gameState.quotesCorrect = correctCount;

    if (correctCount === inputs.length) {
        setTimeout(() => {
            completeStage4();
        }, 1000);
    } else {
        alert(`${correctCount} out of ${inputs.length} correct. Try again.`);
    }
}

function completeStage4() {
    document.getElementById('stage4').style.display = 'none';
    document.getElementById('stage5').style.display = 'block';
    currentStage = 5;
    updateProgressBar();
    initializeStage5();
}

// ===== STAGE 5: TARGET IDENTIFICATION =====

let judgementsComplete = 0;
let correctJudgements = 0;

function initializeStage5() {
    const judgeBtns = document.querySelectorAll('.judge-btn');

    judgeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            makeJudgment(this);
        });
    });
}

function makeJudgment(btn) {
    const card = btn.closest('.target-card');
    const isGuilty = card.getAttribute('data-guilty') === 'true';
    const verdict = btn.getAttribute('data-verdict');

    judgementsComplete++;

    if ((isGuilty && verdict === 'guilty') || (!isGuilty && verdict === 'innocent')) {
        // Correct judgment
        card.classList.add('judged', 'correct');
        correctJudgements++;
        gameState.judgmentsCorrect = correctJudgements;
    } else {
        // Incorrect judgment
        card.classList.add('judged', 'incorrect');
    }

    document.getElementById('judgmentCount').textContent = `Correct Judgments: ${correctJudgements}/4`;

    // Check if all judgments made
    if (judgementsComplete === 4) {
        setTimeout(() => {
            if (correctJudgements === 4) {
                completeStage5();
            } else {
                alert(`Only ${correctJudgements} correct. Justice demands perfection. Try again.`);
                resetStage5();
            }
        }, 1000);
    }
}

function resetStage5() {
    const cards = document.querySelectorAll('.target-card');
    cards.forEach(card => {
        card.classList.remove('judged', 'correct', 'incorrect');
    });

    judgementsComplete = 0;
    correctJudgements = 0;
    gameState.judgmentsCorrect = 0;
    document.getElementById('judgmentCount').textContent = 'Correct Judgments: 0/4';
}

function completeStage5() {
    document.getElementById('stage5').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';
    updateProgressBar();
}

// ===== PROGRESS BAR =====

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressLabel = document.getElementById('progressLabel');

    progressBar.className = 'progress-bar stage-' + currentStage;
    progressLabel.textContent = `Stage ${currentStage} of 5`;
}
