// PREDATOR GAME LOGIC

// Game State
let currentStage = 1;
let huntTimer = 180; // 3 minutes
let huntInterval = null;
let targetsHit = 0;
let civiliansHit = 0;
let attemptsRemaining = 3;

// Yautja Symbol Mapping (simplified symbols using special characters)
const yautjaAlphabet = {
    'A': '⟁', 'B': '⟃', 'C': '⟅', 'D': '⟇', 'E': '⟉',
    'F': '⟋', 'G': '⟍', 'H': '⟏', 'I': '⟑', 'J': '⟓',
    'K': '⟕', 'L': '⟗', 'M': '⟙', 'N': '⟛', 'O': '⟝',
    'P': '⟟', 'Q': '⟡', 'R': '⟣', 'S': '⟥', 'T': '⟧',
    'U': '⟩', 'V': '⟫', 'W': '⟭', 'X': '⟯', 'Y': '⟱', 'Z': '⟳',
    ' ': '•'
};

// Messages to decode (film quotes)
const messages = [
    "GET TO THE CHOPPER",
    "IF IT BLEEDS WE CAN KILL IT",
    "YOU ARE ONE UGLY MOTHER"
];

let currentMessage = '';
let encodedMessage = '';

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    initializeStage1();
    initializeAudio();
});

function initializeAudio() {
    const jungleAudio = document.getElementById('jungleAmbient');
    if (jungleAudio) {
        jungleAudio.volume = 0.3;
        jungleAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
    }
}

// ===== STAGE 1: THERMAL HUNT =====

function initializeStage1() {
    targetsHit = 0;
    civiliansHit = 0;
    huntTimer = 180;
    
    generateHeatSignatures();
    startHuntTimer();
    updateHuntDisplay();
}

function generateHeatSignatures() {
    const container = document.getElementById('heatSignatures');
    container.innerHTML = '';
    
    // Generate 3 armed targets and 3 civilians
    const signatures = [
        { type: 'armed', count: 3 },
        { type: 'civilian', count: 3 }
    ];
    
    signatures.forEach(sig => {
        for (let i = 0; i < sig.count; i++) {
            const heat = document.createElement('div');
            heat.className = `heat-signature heat-${sig.type}`;
            heat.dataset.type = sig.type;
            
            // Random position
            heat.style.left = Math.random() * 85 + '%';
            heat.style.top = Math.random() * 75 + '%';
            
            // Random movement
            animateHeatSignature(heat);
            
            heat.addEventListener('click', function() {
                handleHeatSignatureClick(this);
            });
            
            container.appendChild(heat);
        }
    });
}

function animateHeatSignature(element) {
    setInterval(() => {
        const currentLeft = parseFloat(element.style.left);
        const currentTop = parseFloat(element.style.top);
        
        const newLeft = Math.max(0, Math.min(85, currentLeft + (Math.random() - 0.5) * 10));
        const newTop = Math.max(0, Math.min(75, currentTop + (Math.random() - 0.5) * 10));
        
        element.style.left = newLeft + '%';
        element.style.top = newTop + '%';
    }, 2000);
}

function handleHeatSignatureClick(element) {
    const type = element.dataset.type;
    
    playSound('plasmaShot');
    
    if (type === 'armed') {
        targetsHit++;
        element.style.opacity = '0';
        setTimeout(() => element.remove(), 300);
        
        if (targetsHit >= 3) {
            completeStage1();
        }
    } else if (type === 'civilian') {
        civiliansHit++;
        // Penalty: Add 30 seconds
        huntTimer += 30;
        
        // Visual feedback
        element.style.background = 'radial-gradient(ellipse, #ff0000 0%, #ff0000 40%, transparent 70%)';
        setTimeout(() => {
            element.style.opacity = '0';
            setTimeout(() => element.remove(), 300);
        }, 500);
    }
    
    updateHuntDisplay();
}

function startHuntTimer() {
    huntInterval = setInterval(() => {
        huntTimer--;
        updateHuntDisplay();
        
        if (huntTimer <= 0) {
            failStage1();
        }
        
        // Predator clicking sounds randomly
        if (Math.random() < 0.05) {
            playSound('predatorClick');
        }
    }, 1000);
}

function updateHuntDisplay() {
    document.getElementById('huntTimer').textContent = huntTimer;
    document.getElementById('targetsHit').textContent = `${targetsHit}/3`;
    document.getElementById('civiliansHit').textContent = civiliansHit;
}

function completeStage1() {
    clearInterval(huntInterval);
    playSound('predatorRoar');
    
    setTimeout(() => {
        document.getElementById('stage1').style.display = 'none';
        document.getElementById('stage2').style.display = 'block';
        initializeStage2();
    }, 2000);
}

function failStage1() {
    clearInterval(huntInterval);
    activateSelfDestruct();
}

// ===== STAGE 2: CODE BREAKER =====

function initializeStage2() {
    attemptsRemaining = 3;
    
    // Select random message
    currentMessage = messages[Math.floor(Math.random() * messages.length)];
    encodedMessage = encodeToYautja(currentMessage);
    
    // Display encoded message
    document.getElementById('yautjaSymbols').textContent = encodedMessage;
    
    // Generate symbol grid
    generateSymbolGrid();
    
    // Setup submit button
    document.getElementById('submitDecode').addEventListener('click', checkDecode);
    document.getElementById('decodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkDecode();
        }
    });
    
    updateAttemptsDisplay();
}

function encodeToYautja(text) {
    return text.toUpperCase().split('').map(char => yautjaAlphabet[char] || char).join('');
}

function generateSymbolGrid() {
    const grid = document.getElementById('symbolGrid');
    grid.innerHTML = '';
    
    for (const [letter, symbol] of Object.entries(yautjaAlphabet)) {
        const keyDiv = document.createElement('div');
        keyDiv.className = 'symbol-key';
        keyDiv.innerHTML = `
            <span class="symbol-char">${symbol}</span>
            <span class="symbol-letter">${letter}</span>
        `;
        grid.appendChild(keyDiv);
    }
}

function checkDecode() {
    const input = document.getElementById('decodeInput').value.toUpperCase().trim();
    
    if (input === currentMessage) {
        // Correct!
        playSound('predatorRoar');
        completeStage2();
    } else {
        // Wrong
        attemptsRemaining--;
        playSound('predatorLaugh');
        
        // Blood splatter effect
        document.body.style.animation = 'bloodFlash 0.5s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
        
        if (attemptsRemaining <= 0) {
            activateSelfDestruct();
        } else {
            alert(`INCORRECT. ${attemptsRemaining} attempts remaining.`);
            updateAttemptsDisplay();
            document.getElementById('decodeInput').value = '';
        }
    }
}

function updateAttemptsDisplay() {
    document.getElementById('attemptsRemaining').textContent = attemptsRemaining;
}

function completeStage2() {
    document.getElementById('stage2').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';
}

// ===== FAILURE: SELF DESTRUCT =====

function activateSelfDestruct() {
    playSound('selfDestruct');
    
    document.getElementById('stage1').style.display = 'none';
    document.getElementById('stage2').style.display = 'none';
    document.getElementById('failureScreen').style.display = 'block';
    
    let countdown = 10;
    const countdownElement = document.getElementById('selfDestructCountdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = 'index.html';
        }
    }, 1000);
}

// ===== AUDIO FUNCTIONS =====

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }
}

// ===== CSS ANIMATIONS =====

const style = document.createElement('style');
style.textContent = `
    @keyframes bloodFlash {
        0%, 100% { background-color: #000; }
        50% { background-color: #330000; }
    }
`;
document.head.appendChild(style);
