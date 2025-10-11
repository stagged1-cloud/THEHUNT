// The Crow - Cinematic Gothic Experience

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
    initializeAudio();

    // Cinematic fade-in
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 2s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== AUDIO INITIALIZATION =====

function initializeAudio() {
    const ambientAudio = document.getElementById('ambientAudio');
    const cureMusic = document.getElementById('cureMusic');
    const gothicAmbient = document.getElementById('gothicAmbient');

    // Set volumes
    if (ambientAudio) ambientAudio.volume = 0.4;
    if (cureMusic) cureMusic.volume = 0.6;
    if (gothicAmbient) gothicAmbient.volume = 0.3;

    // Try autoplay with fallback
    const playAudio = () => {
        Promise.all([
            ambientAudio?.play().catch(e => console.log('Ambient audio autoplay prevented')),
            gothicAmbient?.play().catch(e => console.log('Gothic ambient autoplay prevented'))
        ]).then(() => {
            // Start The Cure music after 3 seconds
            setTimeout(() => {
                if (cureMusic) {
                    cureMusic.play().catch(e => console.log('Music autoplay prevented'));
                }
            }, 3000);
        });
    };

    // Try immediate playback
    playAudio();

    // Fallback on user interaction
    const enableAudio = () => {
        playAudio();
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
}

// ===== ATMOSPHERIC EFFECTS =====

function initializeRain() {
    const rainContainer = document.getElementById('rainContainer');
    const rainDropCount = 200; // Increased for more cinematic effect

    for (let i = 0; i < rainDropCount; i++) {
        const rain = document.createElement('div');
        rain.className = 'rain';
        rain.style.left = Math.random() * 100 + '%';
        rain.style.animationDuration = (Math.random() * 0.5 + 0.4) + 's';
        rain.style.animationDelay = Math.random() * 2 + 's';
        rain.style.opacity = Math.random() * 0.5 + 0.3;
        rainContainer.appendChild(rain);
    }
}

function initializeLightning() {
    const lightning = document.getElementById('lightning');

    function flash() {
        lightning.classList.add('flash');

        // Play thunder sound with random delay
        setTimeout(() => {
            const thunder = document.getElementById('thunderAudio');
            if (thunder) {
                thunder.currentTime = 0;
                thunder.volume = 0.5;
                thunder.play().catch(e => console.log('Thunder sound failed'));
            }
        }, Math.random() * 500 + 200);

        // Create multiple flashes for realism
        setTimeout(() => {
            lightning.classList.remove('flash');
            
            // Secondary flash (optional)
            if (Math.random() > 0.5) {
                setTimeout(() => {
                    lightning.classList.add('flash');
                    setTimeout(() => {
                        lightning.classList.remove('flash');
                    }, 100);
                }, 200);
            }
        }, 150);

        // Random next flash between 10-30 seconds
        setTimeout(flash, Math.random() * 20000 + 10000);
    }

    // Start lightning after 5 seconds
    setTimeout(flash, 5000);
}

// Play crow sound randomly
function playRandomCrowSound() {
    const crowSound = document.getElementById('crowSound');
    if (crowSound && Math.random() > 0.7) {
        crowSound.currentTime = 0;
        crowSound.volume = 0.3;
        crowSound.play().catch(e => console.log('Crow sound failed'));
    }
    
    // Schedule next crow sound
    setTimeout(playRandomCrowSound, Math.random() * 15000 + 10000);
}

// Start crow sounds after 10 seconds
setTimeout(playRandomCrowSound, 10000);

// ===== STAGE 1: MEMORY CARD GAME =====

let flippedCards = [];
let matchedPairs = 0;

// Images from crowmem folder
const memoryImages = [
    '0d72354056a4ccbb18e93c510b94be84.jpg',
    '14a9fed56c53f21535c3d01357119926.jpg',
    '1e978071d06615a6fb36327ea60dc19b.jpg',
    '550dc6976e17bbf78850c7bb830eefa8.jpg',
    '70c9b0a2551b78cd23317aaf87b64c78.jpg',
    'a2fbca4d1eaae1a22520a3789f8189b7.jpg',
    'ad25d5d325f76109a3faff9094e7f8d6.jpg',
    'b4c0b1a024c69d00e97b238b239f3fda.jpg',
    'c85d8a78d28f83b899d342805e96f307.jpg',
    'ce8516ca2279c34732bc6e431194f737.jpg'
];

function initializeStage1() {
    generateMemoryGrid();
    
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
                flipCard(this);
            }
        });
    });
}

function generateMemoryGrid() {
    const memoryGrid = document.getElementById('memoryGrid');
    memoryGrid.innerHTML = '';
    
    // Create array with 10 pairs of each image (10 images × 10 pairs = 100 cards)
    let cardsArray = [];
    for (let i = 0; i < memoryImages.length; i++) {
        for (let j = 0; j < 10; j++) {
            cardsArray.push({
                id: i + 1,
                image: memoryImages[i]
            });
        }
    }
    
    // Shuffle the cards
    cardsArray = shuffleArray(cardsArray);
    
    // Generate HTML for each card
    cardsArray.forEach(cardData => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('data-memory', cardData.id);
        card.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back"><img src="assets/images/crowmem/${cardData.image}" alt="Memory"></div>
        `;
        memoryGrid.appendChild(card);
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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

        document.getElementById('matchCount').textContent = `Matches: ${matchedPairs}/50`;

        flippedCards = [];

        // Check if all pairs matched
        if (matchedPairs === 50) {
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
