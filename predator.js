// PREDATOR GAME LOGIC

// Game State
let currentStage = 1;
let huntTimer = 20; // 20 seconds
let huntInterval = null;
let targetsHit = 0;
let civiliansHit = 0;
let attemptsRemaining = 3;

// Yautja Symbol Mapping (corrected)
const yautjaAlphabet = {
    'B': '⟃', 'C': '⟅', 'D': '⟇',
    'F': '⟋', 'G': '⟍', 'H': '⟏', 'J': '⟓',
    'K': '⟕', 'L': '⟗', 'M': '⟙', 'N': '⟛',
    'P': '⟟', 'Q': '⟡', 'R': '⟣', 'S': '⟥', 'T': '⟧',
    'V': '⟫', 'W': '⟭', 'X': '⟯', 'Y': '⟱', 'Z': '⟳',
    ' ': '•',
    '_': '◇'  // Placeholder for missing vowels
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
    
    // Play predator_2.mp3 on loop continuously
    const predator2 = document.getElementById('predator2');
    if (predator2) {
        predator2.volume = 0.4;
        predator2.play().catch(e => console.log('Predator 2 audio autoplay prevented:', e));
    }
    
    // Play predator_1, predator_3, and predator_4 randomly in the background
    playRandomPredatorSounds();
}

function playRandomPredatorSounds() {
    // Shuffle the sounds into a random order
    const sounds = ['predator1', 'predator3', 'predator4'];
    let playlist = [...sounds];
    shuffleArray(playlist);
    let currentIndex = 0;
    
    function playNextSound() {
        const soundId = playlist[currentIndex];
        const audio = document.getElementById(soundId);
        
        if (audio) {
            audio.volume = 0.35;
            audio.play().catch(e => console.log(`${soundId} autoplay prevented:`, e));
            
            // When this sound ends, play the next one
            audio.addEventListener('ended', () => {
                currentIndex++;
                
                // If we've played all sounds, reshuffle and start over
                if (currentIndex >= playlist.length) {
                    currentIndex = 0;
                    shuffleArray(playlist);
                }
                
                // Play next sound after a short delay
                setTimeout(playNextSound, 1000);
            }, { once: true });
        }
    }
    
    // Start playing the first sound after a short delay
    setTimeout(playNextSound, 2000);
}

// ===== STAGE 1: THERMAL HUNT =====

let canvas, ctx;
let thermalTargets = [];
let animationFrame;

function initializeStage1() {
    targetsHit = 0;
    civiliansHit = 0;
    huntTimer = 20;
    
    // Initialize canvas
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
    
    // Add mouse move event for cursor feedback
    canvas.addEventListener('mousemove', handleCursorFeedback);
}

function generateThermalTargets() {
    thermalTargets = [];
    
    // Generate 6 armed targets (more challenging)
    for (let i = 0; i < 6; i++) {
        thermalTargets.push({
            id: 'armed_' + i,
            type: 'armed',
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            radius: 4 + Math.random() * 2,
            temperature: 0.4,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            active: true,
            pulseOffset: Math.random() * Math.PI * 2,
            baseOpacity: 0.4 + Math.random() * 0.2,
            lastRelocate: Date.now()
        });
    }
    
    // Generate 6 civilians (more to avoid)
    for (let i = 0; i < 6; i++) {
        thermalTargets.push({
            id: 'civilian_' + i,
            type: 'civilian',
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            radius: 3 + Math.random() * 2,
            temperature: 0.2,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            active: true,
            pulseOffset: Math.random() * Math.PI * 2,
            baseOpacity: 0.3 + Math.random() * 0.15,
            lastRelocate: Date.now()
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
    
    // Add very subtle thermal overlay
    const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
    gradient.addColorStop(0, 'rgba(0, 17, 0, 0.05)');
    gradient.addColorStop(0.5, 'rgba(0, 8, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 3, 0, 0.15)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw VERY subtle target indicators (barely visible dots)
    thermalTargets.forEach(target => {
        if (target.active) {
            drawThermalTarget(target);
        }
    });
    
    // Add screen effects
    drawThermalEffects();
}

function drawThermalTarget(target) {
    const time = Date.now() * 0.002;
    const pulseIntensity = 0.7 + 0.3 * Math.sin(time + target.pulseOffset); // More visible pulse
    const opacity = (target.baseOpacity || 0.5) * pulseIntensity;
    
    if (target.type === 'armed') {
        // Subtle warm signature - soft orange glow (slightly more visible)
        ctx.fillStyle = `rgba(255, 120, 60, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Small bright center
        ctx.fillStyle = `rgba(255, 200, 120, ${opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Subtle cool signature - blue tint
        ctx.fillStyle = `rgba(100, 140, 180, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
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
    const currentTime = Date.now();
    
    thermalTargets.forEach(target => {
        if (target.active) {
            // Check if target should relocate (every 5 seconds)
            if (currentTime - target.lastRelocate > 5000) {
                // Relocate to new random position
                target.x = Math.random() * 700 + 50;
                target.y = Math.random() * 500 + 50;
                target.vx = (Math.random() - 0.5) * 0.3;
                target.vy = (Math.random() - 0.5) * 0.3;
                target.lastRelocate = currentTime;
            }
            
            // Very slow, subtle movement
            target.x += target.vx;
            target.y += target.vy;
            
            // Soft wall collision (slow down instead of bounce)
            if (target.x <= target.radius || target.x >= canvas.width - target.radius) {
                target.vx *= -0.8;
                target.x = Math.max(target.radius, Math.min(canvas.width - target.radius, target.x));
            }
            if (target.y <= target.radius || target.y >= canvas.height - target.radius) {
                target.vy *= -0.8;
                target.y = Math.max(target.radius, Math.min(canvas.height - target.radius, target.y));
            }
            
            // Very subtle random drift
            target.vx += (Math.random() - 0.5) * 0.02;
            target.vy += (Math.random() - 0.5) * 0.02;
            
            // Very low max speeds for almost stationary movement
            const maxSpeed = target.type === 'armed' ? 0.3 : 0.2;
            const speed = Math.sqrt(target.vx * target.vx + target.vy * target.vy);
            if (speed > maxSpeed) {
                target.vx = (target.vx / speed) * maxSpeed;
                target.vy = (target.vy / speed) * maxSpeed;
            }
            
            // Natural velocity decay (targets slow down over time)
            target.vx *= 0.995;
            target.vy *= 0.995;
        }
    });
}

function handleCursorFeedback(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    
    // Check if mouse is over any target
    let overTarget = false;
    for (let target of thermalTargets) {
        if (target.active) {
            const distance = Math.sqrt(
                Math.pow(mouseX - target.x, 2) + Math.pow(mouseY - target.y, 2)
            );
            
            if (distance <= target.radius * 1.5) {
                overTarget = true;
                break;
            }
        }
    }
    
    // Update cursor with shifted reticle when over target
    if (overTarget) {
        // Shifted reticle (dots move 5px closer together - tighter triangle)
        canvas.style.cursor = 'url(\'data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="15" r="2.5" fill="%23ff0000"/><circle cx="17" cy="23" r="2.5" fill="%23ff0000"/><circle cx="23" cy="23" r="2.5" fill="%23ff0000"/></svg>\') 20 20, crosshair';
    } else {
        // Normal reticle (wider triangle)
        canvas.style.cursor = 'url(\'data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="10" r="2.5" fill="%23ff0000"/><circle cx="14" cy="28" r="2.5" fill="%23ff0000"/><circle cx="26" cy="28" r="2.5" fill="%23ff0000"/></svg>\') 20 20, crosshair';
    }
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
        
        // Initial state - show first video
        video1.style.opacity = '0.8';
        video2.style.opacity = '0.0';
        video3.style.opacity = '0.0';
        
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
        
        if (targetsHit >= 6) {
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
        
        if (targetsHit >= 6) {
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
    document.getElementById('targetsHit').textContent = `${targetsHit}/6`;
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
    // Replace vowels with placeholder to make decoding more challenging
    const textWithPlaceholders = text.toUpperCase().replace(/[AEIOU]/g, '_');
    return textWithPlaceholders.split('').map(char => yautjaAlphabet[char] || char).join('');
}

function removeVowelsFromText(text) {
    return text.replace(/[AEIOU]/g, '_');
}

function generateSymbolGrid() {
    const grid = document.getElementById('symbolGrid');
    grid.innerHTML = '';
    
    // Only show consonants and special characters (no vowels)
    for (const [letter, symbol] of Object.entries(yautjaAlphabet)) {
        // Skip vowel entries (A, E, I, O, U)
        if (['A', 'E', 'I', 'O', 'U'].includes(letter)) continue;
        
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
