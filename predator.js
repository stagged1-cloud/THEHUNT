// PREDATOR GAME LOGIC

// Game State
let currentStage = 1;
let huntTimer = 180; // 3 minutes
let huntInterval = null;
let targetsHit = 0;
let civiliansHit = 0;
let attemptsRemaining = 3;

// Yautja Symbol Mapping (corrected)
const yautjaAlphabet = {
    'A': '⟁', 'B': '⟃', 'C': '⟅', 'D': '⟇', 'E': '⟉',
    'F': '⟋', 'G': '⟍', 'H': '⟏', 'I': '⟑', 'J': '⟓',
    'K': '⟕', 'L': '⟗', 'M': '⟙', 'N': '⟛', 'O': '⟝',
    'P': '⟟', 'Q': '⟡', 'R': '⟣', 'S': '⟥', 'T': '⟧',
    'U': '⟩', 'V': '⟫', 'W': '⟭', 'X': '⟯', 'Y': '⟱', 'Z': '⟳',
    ' ': '•'
};

// Messages to decode (film quotes) - will be randomized and personalized
const messageTemplates = [
    "GET TO THE CHOPPER",
    "THERE IS NO ESCAPE", 
    "WE ARE ALL DEAD",
    "CONTACT THE SHIP",
    "THEY ARE HUNTING US",
    "SOMETHING IS OUT THERE",
    "WE NEED MORE FIREPOWER",
    "THE JUNGLE IS ALIVE"
];

// Personalized messages using user's name from Blade Runner game
const personalizedTemplates = [
    "YOU ARE ONE UGLY MOTHER {NAME}",
    "NICE TRY {NAME}",
    "WHAT THE HELL ARE YOU {NAME}",
    "GAME OVER {NAME}",
    "RUN {NAME} RUN",
    "THEY GOT {NAME}",
    "HELP ME {NAME}",
    "WHERE ARE YOU {NAME}"
];

let availableMessages = [];

let currentMessage = '';
let encodedMessage = '';

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    initializeMessages();
    initializeStage1();
    initializeAudio();
});

function initializeMessages() {
    // Try to get user's name from Blade Runner test
    const userName = getUserName();
    
    // Combine regular and personalized messages
    availableMessages = [...messageTemplates];
    
    if (userName) {
        // Add personalized messages with user's name
        personalizedTemplates.forEach(template => {
            availableMessages.push(template.replace('{NAME}', userName));
        });
    }
    
    // Shuffle the available messages
    shuffleArray(availableMessages);
}

function getUserName() {
    // Try multiple sources for the user's name
    // Check if we can access the Blade Runner page's data
    try {
        // Check localStorage first
        const storedName = localStorage.getItem('subjectName');
        if (storedName) return storedName;
        
        // Check sessionStorage
        const sessionName = sessionStorage.getItem('subjectName');
        if (sessionName) return sessionName;
        
        // If no stored name, try to get from parent window or opener
        if (window.opener && window.opener.subjectName) {
            return window.opener.subjectName;
        }
        
        // Last resort: check for common test names
        const testNames = ['DON', 'CHRIS', 'ALEX', 'SAM', 'JOHN', 'JANE'];
        return testNames[Math.floor(Math.random() * testNames.length)];
    } catch (e) {
        console.log('Could not retrieve user name:', e);
        return null;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeAudio() {
    const jungleAudio = document.getElementById('jungleAmbient');
    if (jungleAudio) {
        jungleAudio.volume = 0.3;
        jungleAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
    }
}

// ===== STAGE 1: THERMAL HUNT =====

let canvas, ctx;
let thermalTargets = [];
let animationFrame;

function initializeStage1() {
    targetsHit = 0;
    civiliansHit = 0;
    huntTimer = 180;
    
    // Initialize canvas
    canvas = document.getElementById('thermalCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    generateThermalTargets();
    generateHiddenVideoTargets();
    initializeVideoSwitch();
    startHuntTimer();
    updateHuntDisplay();
    startThermalAnimation();
    
    // Add click event to canvas
    canvas.addEventListener('click', handleCanvasClick);
}

function generateThermalTargets() {
    thermalTargets = [];
    
    // Generate 3 armed targets (hot - red/orange)
    for (let i = 0; i < 3; i++) {
        thermalTargets.push({
            id: 'armed_' + i,
            type: 'armed',
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            radius: 15 + Math.random() * 10,
            temperature: 0.9, // High heat signature
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            active: true,
            pulseOffset: Math.random() * Math.PI * 2
        });
    }
    
    // Generate 3 civilians (cool - blue/green)
    for (let i = 0; i < 3; i++) {
        thermalTargets.push({
            id: 'civilian_' + i,
            type: 'civilian',
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            radius: 12 + Math.random() * 8,
            temperature: 0.3, // Low heat signature
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            active: true,
            pulseOffset: Math.random() * Math.PI * 2
        });
    }
}

function startThermalAnimation() {
    function animate() {
        drawThermalScene();
        updateTargetPositions();
        animationFrame = requestAnimationFrame(animate);
    }
    animate();
}

function drawThermalScene() {
    // Clear canvas (transparent to let videos show through)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle thermal overlay (very transparent)
    const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
    gradient.addColorStop(0, 'rgba(0, 17, 0, 0.1)');
    gradient.addColorStop(0.5, 'rgba(0, 8, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 3, 0, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add thermal noise
    for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(0, ${50 + Math.random() * 50}, 0, ${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
    
    // Draw thermal targets
    thermalTargets.forEach(target => {
        if (target.active) {
            drawThermalTarget(target);
        }
    });
    
    // Add screen effects
    drawThermalEffects();
}

function drawThermalTarget(target) {
    const time = Date.now() * 0.005;
    const pulseIntensity = 0.8 + 0.2 * Math.sin(time + target.pulseOffset);
    
    // Create heat signature gradient
    const gradient = ctx.createRadialGradient(
        target.x, target.y, 0,
        target.x, target.y, target.radius * 2
    );
    
    if (target.type === 'armed') {
        // Hot signature - red/orange/yellow
        gradient.addColorStop(0, `rgba(255, 255, 100, ${0.9 * pulseIntensity})`);
        gradient.addColorStop(0.3, `rgba(255, 150, 0, ${0.7 * pulseIntensity})`);
        gradient.addColorStop(0.6, `rgba(255, 50, 0, ${0.5 * pulseIntensity})`);
        gradient.addColorStop(1, 'rgba(100, 0, 0, 0)');
    } else {
        // Cool signature - blue/green
        gradient.addColorStop(0, `rgba(0, 200, 255, ${0.6 * pulseIntensity})`);
        gradient.addColorStop(0.4, `rgba(0, 150, 200, ${0.4 * pulseIntensity})`);
        gradient.addColorStop(0.7, `rgba(0, 100, 150, ${0.2 * pulseIntensity})`);
        gradient.addColorStop(1, 'rgba(0, 50, 100, 0)');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add inner bright core for armed targets
    if (target.type === 'armed') {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * pulseIntensity})`;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawThermalEffects() {
    // Add thermal distortion lines
    const time = Date.now() * 0.001;
    for (let y = 0; y < canvas.height; y += 20) {
        const offset = Math.sin(time + y * 0.1) * 2;
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(canvas.width, y + offset);
        ctx.stroke();
    }
}

function updateTargetPositions() {
    thermalTargets.forEach(target => {
        if (target.active) {
            // Update position
            target.x += target.vx;
            target.y += target.vy;
            
            // Bounce off walls
            if (target.x <= target.radius || target.x >= canvas.width - target.radius) {
                target.vx *= -1;
            }
            if (target.y <= target.radius || target.y >= canvas.height - target.radius) {
                target.vy *= -1;
            }
            
            // Keep within bounds
            target.x = Math.max(target.radius, Math.min(canvas.width - target.radius, target.x));
            target.y = Math.max(target.radius, Math.min(canvas.height - target.radius, target.y));
            
            // Slight random movement
            target.vx += (Math.random() - 0.5) * 0.1;
            target.vy += (Math.random() - 0.5) * 0.1;
            
            // Limit velocity
            const maxSpeed = target.type === 'armed' ? 2 : 1.5;
            const speed = Math.sqrt(target.vx * target.vx + target.vy * target.vy);
            if (speed > maxSpeed) {
                target.vx = (target.vx / speed) * maxSpeed;
                target.vy = (target.vy / speed) * maxSpeed;
            }
        }
    });
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;
    
    // Check if click hit any target
    for (let target of thermalTargets) {
        if (target.active) {
            const distance = Math.sqrt(
                Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)
            );
            
            if (distance <= target.radius * 1.5) {
                handleThermalTargetHit(target, clickX, clickY);
                return;
            }
        }
    }
}

// Hidden Video Target System
let hiddenTargets = [];
let videoTargetBonus = 0;

function generateHiddenVideoTargets() {
    const targetContainer = document.getElementById('hiddenTargets');
    targetContainer.innerHTML = '';
    hiddenTargets = [];
    
    // Generate 2-4 hidden targets per stage
    const numTargets = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numTargets; i++) {
        const target = createHiddenTarget(i);
        hiddenTargets.push(target);
        targetContainer.appendChild(target.element);
    }
}

function createHiddenTarget(index) {
    const targetDiv = document.createElement('div');
    targetDiv.className = 'hidden-target';
    
    // Random position (avoiding edges and center crosshair area)
    const x = Math.random() * 600 + 100; // Keep away from edges
    const y = Math.random() * 400 + 100;
    
    // Avoid the center area where crosshair is
    const centerX = 400, centerY = 300;
    if (Math.abs(x - centerX) < 80 && Math.abs(y - centerY) < 80) {
        // Move away from center
        const angle = Math.random() * Math.PI * 2;
        const distance = 120;
        targetDiv.style.left = (centerX + Math.cos(angle) * distance) + 'px';
        targetDiv.style.top = (centerY + Math.sin(angle) * distance) + 'px';
    } else {
        targetDiv.style.left = x + 'px';
        targetDiv.style.top = y + 'px';
    }
    
    // Add slight movement
    const moveOffset = Math.random() * 20 - 10;
    targetDiv.style.animationDelay = (index * 0.5) + 's';
    
    const target = {
        element: targetDiv,
        id: 'hidden_' + index,
        clicked: false,
        points: 50
    };
    
    targetDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        handleHiddenTargetClick(target);
    });
    
    return target;
}

function handleHiddenTargetClick(target) {
    if (target.clicked) return;
    
    target.clicked = true;
    videoTargetBonus += target.points;
    
    // Visual feedback
    target.element.style.background = 'radial-gradient(circle, rgba(0, 255, 0, 0.9) 0%, rgba(0, 255, 0, 0.5) 50%, transparent 70%)';
    target.element.style.transform = 'scale(1.5)';
    
    // Sound effect
    playSound('predatorClick');
    
    // Remove after animation
    setTimeout(() => {
        target.element.style.opacity = '0';
        setTimeout(() => {
            if (target.element.parentNode) {
                target.element.parentNode.removeChild(target.element);
            }
        }, 300);
    }, 500);
    
    // Bonus time reduction
    huntTimer = Math.max(huntTimer - 10, 1); // Reduce timer by 10 seconds (makes it easier)
    updateHuntDisplay();
    
    // Check if all hidden targets found
    const allFound = hiddenTargets.every(t => t.clicked);
    if (allFound) {
        // Extra bonus for finding all
        videoTargetBonus += 100;
        huntTimer = Math.max(huntTimer - 20, 1); // Extra time bonus
        
        // Visual feedback for bonus
        const bonusMsg = document.createElement('div');
        bonusMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ff00;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 0 0 10px #00ff00;
            z-index: 1000;
            pointer-events: none;
        `;
        bonusMsg.textContent = `STEALTH BONUS: +${videoTargetBonus} POINTS`;
        document.body.appendChild(bonusMsg);
        
        setTimeout(() => {
            bonusMsg.style.opacity = '0';
            setTimeout(() => document.body.removeChild(bonusMsg), 1000);
        }, 2000);
    }
}

function initializeVideoSwitch() {
    // Cycle between three thermal videos
    const video1 = document.getElementById('thermalVideo1');
    const video2 = document.getElementById('thermalVideo2');
    const video3 = document.getElementById('thermalVideo3');
    
    if (video1 && video2 && video3) {
        let currentVideo = 0;
        
        // Initial state
        video1.style.opacity = '0.8';
        video2.style.opacity = '0.1';
        video3.style.opacity = '0.1';
        
        setInterval(() => {
            // Fade out all videos
            video1.style.opacity = '0.1';
            video2.style.opacity = '0.1';
            video3.style.opacity = '0.1';
            
            // Cycle to next video
            currentVideo = (currentVideo + 1) % 3;
            
            // Fade in current video
            setTimeout(() => {
                if (currentVideo === 0) video1.style.opacity = '0.8';
                else if (currentVideo === 1) video2.style.opacity = '0.8';
                else if (currentVideo === 2) video3.style.opacity = '0.8';
            }, 500);
            
        }, 5000); // Switch every 5 seconds
    }
}

function handleThermalTargetHit(target, clickX, clickY) {
    playSound('plasmaShot');
    
    // Create impact effect
    createImpactEffect(clickX, clickY, target.type);
    
    if (target.type === 'armed') {
        targetsHit++;
        target.active = false;
        
        if (targetsHit >= 3) {
            completeStage1();
        }
    } else if (target.type === 'civilian') {
        civiliansHit++;
        huntTimer += 30; // Penalty
        
        // Flash effect for civilian hit
        canvas.style.filter = 'brightness(2) sepia(1) hue-rotate(0deg)';
        setTimeout(() => {
            canvas.style.filter = '';
        }, 200);
        
        target.active = false;
    }
    
    updateHuntDisplay();
}

function createImpactEffect(x, y, targetType) {
    const effectColor = targetType === 'armed' ? '#00ff00' : '#ff0000';
    
    // Draw impact explosion
    const explosionGradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    explosionGradient.addColorStop(0, effectColor + 'AA');
    explosionGradient.addColorStop(0.5, effectColor + '66');
    explosionGradient.addColorStop(1, effectColor + '00');
    
    ctx.fillStyle = explosionGradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
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
    document.getElementById('videoBonus').textContent = videoTargetBonus;
}

function completeStage1() {
    clearInterval(huntInterval);
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    playSound('predatorRoar');
    
    // Success effect
    canvas.style.filter = 'brightness(1.5) contrast(1.2) hue-rotate(120deg)';
    
    setTimeout(() => {
        canvas.style.filter = '';
        document.getElementById('stage1').style.display = 'none';
        document.getElementById('stage2').style.display = 'block';
        initializeStage2();
    }, 2000);
}

function failStage1() {
    clearInterval(huntInterval);
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    activateSelfDestruct();
}

// ===== STAGE 2: CODE BREAKER =====

function initializeStage2() {
    attemptsRemaining = 3;
    
    // Select random message from available messages (randomized each game)
    if (availableMessages.length === 0) {
        initializeMessages(); // Fallback if messages not initialized
    }
    
    currentMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
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
    // Remove vowels to make decoding more challenging
    const textWithoutVowels = text.toUpperCase().replace(/[AEIOU]/g, '');
    return textWithoutVowels.split('').map(char => yautjaAlphabet[char] || char).join('');
}

function removeVowelsFromText(text) {
    return text.replace(/[AEIOU]/g, '');
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
    
    // Check if input matches the original message OR the vowel-less version
    // This gives players flexibility to decode with or without vowels
    const inputNoVowels = removeVowelsFromText(input);
    const messageNoVowels = removeVowelsFromText(currentMessage);
    
    if (input === currentMessage || inputNoVowels === messageNoVowels || input === messageNoVowels) {
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
