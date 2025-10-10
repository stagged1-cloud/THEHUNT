// Voight-Kampff Test JavaScript
let currentQuestion = 0;
let stressLevel = 0;
let wrongAnswers = 0;
let testStarted = false;
let questions = [];

// Psychopath test questions (20 questions with correct answers)
const psychopathQuestions = [
    {
        question: "You're walking through a forest and come across a wounded animal. What do you do?",
        answers: ["A) Help the animal and try to heal it", "B) Put it out of its misery quickly", "C) Ignore it and continue walking", "D) Take photos for social media"],
        correct: 1
    },
    {
        question: "A homeless person asks you for money. Your first thought is:",
        answers: ["A) How I can help them", "B) They probably deserve their situation", "C) I should give them food instead", "D) They might use it for drugs"],
        correct: 1
    },
    {
        question: "You witness someone being bullied. You:",
        answers: ["A) Immediately intervene to help", "B) Call for authority figures", "C) Film it to show others later", "D) Walk away - not your problem"],
        correct: 1
    },
    {
        question: "Your friend tells you a deeply personal secret. You:",
        answers: ["A) Keep it completely confidential", "B) Tell only your closest friend", "C) Share it if it comes up in conversation", "D) Post about it anonymously online"],
        correct: 1
    },
    {
        question: "You accidentally damage someone's property. You:",
        answers: ["A) Immediately admit fault and offer to pay", "B) Leave a note with your contact info", "C) Only admit it if someone saw you", "D) Hope no one notices and leave"],
        correct: 1
    },
    {
        question: "When you see someone cry, your instinct is to:",
        answers: ["A) Comfort them and ask what's wrong", "B) Give them space but stay nearby", "C) Feel uncomfortable and leave", "D) Wonder what they did to deserve it"],
        correct: 1
    },
    {
        question: "A child drops their ice cream and starts crying. You:",
        answers: ["A) Buy them a new one", "B) Tell them accidents happen", "C) Point out they should be more careful", "D) Find it somewhat amusing"],
        correct: 1
    },
    {
        question: "You find a wallet with $200 cash and ID. You:",
        answers: ["A) Return it immediately with all money", "B) Return it but keep a small finder's fee", "C) Return it only if there's a reward offered", "D) Keep the money, throw away the wallet"],
        correct: 1
    },
    {
        question: "Your coworker is struggling with their tasks. You:",
        answers: ["A) Offer to help them", "B) Give them advice on how to improve", "C) Let them figure it out themselves", "D) Hope they fail so you look better"],
        correct: 1
    },
    {
        question: "You see news about a natural disaster affecting thousands. Your reaction:",
        answers: ["A) Feel sad and want to donate to help", "B) Feel bad but unsure how to help", "C) Think about how it doesn't affect you", "D) Wonder if they brought it on themselves"],
        correct: 1
    },
    {
        question: "A friend asks to borrow money for an emergency. You:",
        answers: ["A) Lend it without expecting anything back", "B) Lend it with a clear repayment plan", "C) Refuse because they might not pay back", "D) Lend it but charge interest"],
        correct: 1
    },
    {
        question: "You notice your neighbor's house being robbed. You:",
        answers: ["A) Call police immediately", "B) Confront the burglars yourself", "C) Wait to see what happens first", "D) Think they probably deserved it"],
        correct: 1
    },
    {
        question: "Someone cuts in front of you in line. You:",
        answers: ["A) Politely point out there's a line", "B) Let it go this time", "C) Make loud comments about rude people", "D) Plan to get revenge somehow"],
        correct: 1
    },
    {
        question: "You accidentally receive someone else's mail with important documents. You:",
        answers: ["A) Deliver it to the correct address immediately", "B) Return it to the post office", "C) Hold onto it until you see the person", "D) Open it to see what's inside first"],
        correct: 1
    },
    {
        question: "A restaurant gives you too much change. You:",
        answers: ["A) Point out the error immediately", "B) Return the extra money before leaving", "C) Keep it but feel slightly guilty", "D) Keep it - their mistake, your gain"],
        correct: 1
    },
    {
        question: "You hear your neighbor's baby crying for hours. You:",
        answers: ["A) Check if they need help or support", "B) Assume they have it handled", "C) Feel annoyed by the noise", "D) Call authorities to complain"],
        correct: 1
    },
    {
        question: "Someone shares good news about their promotion. You:",
        answers: ["A) Feel genuinely happy for them", "B) Congratulate them politely", "C) Feel envious but hide it", "D) Point out why they don't deserve it"],
        correct: 1
    },
    {
        question: "You see an elderly person struggling with heavy groceries. You:",
        answers: ["A) Immediately offer to help carry them", "B) Ask if they need assistance", "C) Watch but don't get involved", "D) Think they should ask for help if needed"],
        correct: 1
    },
    {
        question: "Your friend is going through a difficult divorce. You:",
        answers: ["A) Offer emotional support and listen", "B) Give them practical advice", "C) Try to stay out of their personal business", "D) Take sides and spread gossip"],
        correct: 1
    },
    {
        question: "You accidentally hit someone's parked car with no witnesses. You:",
        answers: ["A) Leave your insurance information", "B) Wait for the owner to return", "C) Check if there's any real damage first", "D) Drive away quickly"],
        correct: 1
    }
];

// Initialize the test
function initializeTest() {
    questions = [...psychopathQuestions];
    shuffleArray(questions);
    updateTerminal("System initialized. Awaiting subject identification...");
}

// Subject database with background information
const subjectDatabase = {
    'SABRINA': {
        location: 'HASTINGS, UK',
        criminalRecord: true,
        criminalDetails: 'FIREARMS WEAPONS - CROWN COURT - SUSPENDED PRISON SENTENCE',
        associates: ['DON', 'ASHA', 'JAMES'],
        records: ['CRIMINAL RECORD: FIREARMS OFFENSES', 'COURT RECORD: CROWN COURT SENTENCING', 'PROBATION: ACTIVE SUPERVISION']
    },
    'DON': {
        location: 'HASTINGS, UK',
        criminalRecord: false,
        associates: ['SABRINA', 'ASHA', 'JAMES'],
        records: ['CLEAN CRIMINAL RECORD', 'EMPLOYMENT HISTORY: VERIFIED', 'MEDICAL RECORDS: ACCESSED']
    },
    'ASHA': {
        location: 'HASTINGS, UK',
        criminalRecord: false,
        associates: ['SABRINA', 'DON', 'JAMES'],
        records: ['CLEAN CRIMINAL RECORD', 'EDUCATIONAL BACKGROUND: VERIFIED', 'MEDICAL RECORDS: ACCESSED']
    },
    'JAMES': {
        location: 'HASTINGS, UK',
        criminalRecord: false,
        associates: ['SABRINA', 'DON', 'ASHA'],
        records: ['CLEAN CRIMINAL RECORD', 'EMPLOYMENT HISTORY: VERIFIED', 'MEDICAL RECORDS: ACCESSED']
    },
    'CHRIS': {
        location: 'COVENTRY, NOD LANE, UK',
        criminalRecord: false,
        associates: ['DEESHA'],
        records: ['CLEAN CRIMINAL RECORD', 'PARENTS RECORD: ACCESSED', 'HEALTH RECORDS: COMPREHENSIVE SCAN', 'ADDRESS VERIFICATION: CONFIRMED']
    },
    'DEESHA': {
        location: 'COVENTRY, NOD LANE, UK',
        criminalRecord: false,
        associates: ['CHRIS'],
        records: ['CLEAN CRIMINAL RECORD', 'PARENTS RECORD: ACCESSED', 'HEALTH RECORDS: COMPREHENSIVE SCAN', 'ADDRESS VERIFICATION: CONFIRMED']
    }
};

// Submit identification for background check
function submitIdentification() {
    const nameInput = document.getElementById('subjectName');
    const name = nameInput.value.trim().toUpperCase();
    
    if (!name) {
        updateTerminal("ERROR: Subject name required for identification.");
        return;
    }
    
    // Hide form and show background check
    document.querySelector('.id-form').style.display = 'none';
    document.getElementById('backgroundCheck').style.display = 'block';
    
    updateTerminal(`Subject identification submitted: ${name}`);
    updateTerminal("Initiating comprehensive background verification...");
    
    // Trigger audio start on user interaction
    document.dispatchEvent(new Event('backgroundCheckStarted'));
    
    // Try to start audio again on this user interaction
    const ambientAudio = document.getElementById('ambientAudio');
    if (ambientAudio && ambientAudio.paused) {
        ambientAudio.volume = 0.65;
        ambientAudio.currentTime = 10;
        ambientAudio.play().catch(e => console.log('Audio start on interaction failed:', e));
    }
    
    // Start background check animation
    runBackgroundCheck(name);
}

// Run background check with realistic delays and information
function runBackgroundCheck(name) {
    const progressFill = document.getElementById('progressFill');
    const checkResults = document.getElementById('checkResults');
    let progress = 0;
    
    const checkSteps = [
        "ACCESSING GOVERNMENT DATABASES...",
        "CHECKING CRIMINAL RECORDS...",
        "VERIFYING IDENTITY DOCUMENTS...",
        "SCANNING POLICE DATABASES...",
        "CHECKING ASSOCIATES AND CONNECTIONS...",
        "ANALYZING BEHAVIORAL PATTERNS...",
        "CROSS-REFERENCING KNOWN SUBJECTS...",
        "GENERATING SECURITY PROFILE...",
        "FINALIZING BACKGROUND VERIFICATION..."
    ];
    
    let stepIndex = 0;
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        
        if (stepIndex < checkSteps.length) {
            const currentStep = checkSteps[stepIndex];
            
            // Special handling for Sabrina when scanning police databases
            if (name === 'SABRINA' && currentStep === "SCANNING POLICE DATABASES...") {
                showSabrinaPoliceAlert(currentStep);
            } else {
                updateTerminal(currentStep);
            }
            stepIndex++;
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                displayBackgroundResults(name);
            }, 1000);
        }
    }, 800);
}

// Special alert for Sabrina during police scan
function showSabrinaPoliceAlert(step) {
    const terminal = document.getElementById('terminalContent');
    const timestamp = new Date().toLocaleTimeString();
    
    // Add the step with red flashing effect
    const alertLine = document.createElement('div');
    alertLine.innerHTML = `<br>[${timestamp}] > <span class="sabrina-alert">${step}</span>`;
    terminal.appendChild(alertLine);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Show immediate warning popup
    setTimeout(() => {
        showSabrinaWarningPopup();
    }, 1500);
}

// Show Sabrina criminal warning popup
function showSabrinaWarningPopup() {
    const warningPopup = document.createElement('div');
    warningPopup.className = 'sabrina-warning-popup';
    warningPopup.innerHTML = `
        <div class="warning-header">⚠️ CRIMINAL RECORD ALERT ⚠️</div>
        <div class="warning-content">
            <div class="warning-line">SUBJECT: SABRINA</div>
            <div class="warning-line">OFFENSE: FIREARMS WEAPONS</div>
            <div class="warning-line">COURT: CROWN COURT</div>
            <div class="warning-line">SENTENCE: SUSPENDED PRISON</div>
            <div class="warning-line">STATUS: HIGH RISK</div>
        </div>
        <div class="warning-footer">SECURITY PROTOCOLS ACTIVATED</div>
    `;
    
    document.body.appendChild(warningPopup);
    
    // Remove popup after 5 seconds
    setTimeout(() => {
        if (warningPopup.parentNode) {
            warningPopup.parentNode.removeChild(warningPopup);
        }
    }, 5000);
    
    updateTerminal("ALERT: HIGH-RISK CRIMINAL RECORD DETECTED");
    updateTerminal("FIREARMS OFFENSE CONFIRMED - CROWN COURT RECORD");
}

// Display background check results
function displayBackgroundResults(name) {
    const checkResults = document.getElementById('checkResults');
    const identificationPanel = document.getElementById('identificationPanel');
    
    // Check if name exists in database or find partial matches
    let subject = subjectDatabase[name];
    let isAssociate = false;
    
    // If not found directly, check if they're an associate
    if (!subject) {
        for (const [key, data] of Object.entries(subjectDatabase)) {
            if (data.associates && data.associates.some(assoc => name.includes(assoc) || assoc.includes(name))) {
                subject = {
                    location: data.location,
                    criminalRecord: false,
                    associates: [key],
                    records: [`ASSOCIATION DETECTED WITH: ${key}`, 'SECONDARY SUBJECT PROFILE', 'LIMITED BACKGROUND DATA']
                };
                isAssociate = true;
                break;
            }
        }
    }
    
    // Generate results
    let results = `BACKGROUND VERIFICATION COMPLETE\n`;
    results += `=====================================\n`;
    results += `SUBJECT: ${name}\n`;
    
    if (subject) {
        results += `LOCATION: ${subject.location}\n`;
        results += `CRIMINAL RECORD: ${subject.criminalRecord ? 'POSITIVE MATCH' : 'CLEAN'}\n`;
        results += `ASSOCIATES: ${subject.associates.join(', ')}\n\n`;
        
        results += `DETAILED RECORDS:\n`;
        results += `-----------------\n`;
        subject.records.forEach(record => {
            results += `• ${record}\n`;
        });
        
        // Special handling for Sabrina's criminal record
        if (name === 'SABRINA' && subject.criminalRecord) {
            setTimeout(() => {
                const criminalWarning = document.createElement('div');
                criminalWarning.className = 'criminal-warning';
                criminalWarning.innerHTML = `
                    ⚠️ CRIMINAL RECORD ALERT ⚠️<br>
                    FIREARMS WEAPONS OFFENSE<br>
                    CROWN COURT CONVICTION<br>
                    SUSPENDED PRISON SENTENCE<br>
                    HIGH RISK SUBJECT
                `;
                identificationPanel.appendChild(criminalWarning);
                
                updateTerminal("ALERT: HIGH RISK SUBJECT DETECTED - CRIMINAL RECORD CONFIRMED");
                updateTerminal("FIREARMS OFFENSE - CROWN COURT - SUSPENDED SENTENCE");
            }, 2000);
        }
    } else {
        results += `LOCATION: UNKNOWN\n`;
        results += `CRIMINAL RECORD: NO MATCHES FOUND\n`;
        results += `ASSOCIATES: NONE DETECTED\n\n`;
        results += `DETAILED RECORDS:\n`;
        results += `-----------------\n`;
        results += `• IDENTITY VERIFICATION: PENDING\n`;
        results += `• NO PRIOR RECORDS FOUND\n`;
        results += `• SUBJECT REQUIRES FURTHER SCREENING\n`;
    }
    
    checkResults.textContent = results;
    document.getElementById('subjectId').textContent = name;
    
    updateTerminal(`Background verification complete for: ${name}`);
    updateTerminal("Subject cleared for psychological evaluation.");
    
    // Enable test start after background check
    setTimeout(() => {
        // Compact the identification panel
        identificationPanel.classList.add('compact');
        
        // Reveal the VK test interface with slide-in animation
        const vkInterface = document.getElementById('vkTestInterface');
        vkInterface.style.display = 'block';
        setTimeout(() => {
            vkInterface.classList.add('slide-in');
        }, 100);
        
        updateTerminal("VOIGHT-KAMPFF TEST INTERFACE ACTIVATED");
        updateTerminal("BIOMETRIC SYSTEMS ONLINE - READY FOR TESTING");
        updateTerminal("CLICK INITIALIZE TEST TO BEGIN PSYCHOLOGICAL EVALUATION");
        
        // Start the video eye monitoring
        const video = document.getElementById('eyeVideo');
        if (video) {
            video.play().catch(e => console.log('Video autoplay after reveal failed:', e));
        }
    }, 5000);
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start the test
function startTest() {
    if (testStarted) return;
    
    // Check if subject identification is complete
    const subjectId = document.getElementById('subjectId').textContent;
    if (subjectId === 'UNKNOWN') {
        updateTerminal("ERROR: Subject identification required before test initialization.");
        return;
    }
    
    testStarted = true;
    currentQuestion = 0;
    stressLevel = 0;
    wrongAnswers = 0;
    
    document.getElementById('startBtn').style.display = 'none';
    
    updateTerminal("Test initiated. Subject preparation complete.");
    updateTerminal("Beginning psychological evaluation sequence...");
    
    // Start ambient audio - Leon's Interrogation track
    const ambientAudio = document.getElementById('ambientAudio');
    ambientAudio.volume = 0.65; // 30% louder than the previous 0.3 (0.3 * 1.3 = 0.39, boosted to 0.65 for better effect)
    ambientAudio.currentTime = 10; // Start at 10 seconds
    ambientAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
    
    // Show first question
    showQuestion();
}

// Show current question
function showQuestion() {
    console.log(`Showing question ${currentQuestion + 1} of ${questions.length}`);
    
    if (currentQuestion >= questions.length) {
        console.log('No more questions, ending test');
        endTest();
        return;
    }
    
    const question = questions[currentQuestion];
    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    
    if (!question) {
        console.error('Question is undefined at index', currentQuestion);
        return;
    }
    
    questionText.textContent = `Question ${currentQuestion + 1}: ${question.question}`;
    answerOptions.style.display = 'grid';
    
    // Clear previous answers and set new ones
    const buttons = answerOptions.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        if (question.answers[index]) {
            btn.textContent = question.answers[index];
            btn.className = 'answer-btn';
            btn.disabled = false;
        }
    });
    
    document.getElementById('responseCount').textContent = `${currentQuestion}/20`;
    
    updateTerminal(`Question ${currentQuestion + 1} displayed. Monitoring subject response...`);
    
    // Animate eye
    animateEye();
}

// Handle answer selection
function selectAnswer(answerIndex) {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    const selectedButton = buttons[answerIndex - 1];
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Check if answer is correct (human response)
    if (answerIndex === question.correct) {
        selectedButton.classList.add('correct');
        updateTerminal(`Response recorded: EMPATHETIC. Human behavioral pattern detected.`);
        updateStressLevel(-5); // Reduce stress for correct answer
    } else {
        selectedButton.classList.add('wrong');
        wrongAnswers++;
        updateTerminal(`Response recorded: CONCERNING. Lack of empathy detected.`);
        updateStressLevel(15); // Increase stress significantly for wrong answer
        
        // Show correct answer
        buttons[question.correct - 1].classList.add('correct');
    }
    
    // Update readings
    updateReadings(answerIndex === question.correct);
    
    // Show progress indicator
    const progressIndicator = document.getElementById('progressIndicator');
    if (progressIndicator) {
        progressIndicator.style.display = 'flex';
    }
    
    // Check if test should end early (too many wrong answers)
    if (wrongAnswers >= 8 || stressLevel >= 100) {
        setTimeout(() => {
            if (progressIndicator) progressIndicator.style.display = 'none';
            failTest();
        }, 2000);
        return;
    }
    
    // Automatically advance to next question after showing results
    setTimeout(() => {
        if (progressIndicator) progressIndicator.style.display = 'none';
        nextQuestion();
    }, 1500);
}

// Move to next question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        updateTerminal(`Advancing to question ${currentQuestion + 1}...`);
    }
    
    if (currentQuestion >= questions.length) {
        endTest();
    } else {
        showQuestion();
    }
}

// Update stress level and needle position
function updateStressLevel(change) {
    stressLevel = Math.max(0, Math.min(100, stressLevel + change));
    
    // Update needle rotation (-90deg = left/human, 0deg = center, 90deg = right/replicant)
    const needleRotation = -90 + (stressLevel * 1.8); // 180 degree range
    document.getElementById('stressNeedle').style.transform = 
        `translateX(-50%) rotate(${needleRotation}deg)`;
    
    // Update readout display
    const responseLevel = document.getElementById('responseLevel');
    if (stressLevel < 20) {
        responseLevel.textContent = 'HUMAN';
        responseLevel.style.color = '#00ff88';
    } else if (stressLevel < 40) {
        responseLevel.textContent = 'STABLE';
        responseLevel.style.color = '#00ff88';
    } else if (stressLevel < 60) {
        responseLevel.textContent = 'ELEVATED';
        responseLevel.style.color = '#ffff00';
    } else if (stressLevel < 80) {
        responseLevel.textContent = 'CRITICAL';
        responseLevel.style.color = '#ff6600';
    } else {
        responseLevel.textContent = 'REPLICANT';
        responseLevel.style.color = '#ff3030';
    }
    
    // Update LEDs
    updateLEDs();
    
    updateTerminal(`Empathy response level: ${stressLevel.toFixed(1)}% - ${responseLevel.textContent}`);
}

// Update LED indicators
function updateLEDs() {
    const leds = document.querySelectorAll('.led');
    leds.forEach(led => {
        led.className = 'led';
    });
    
    // BASELINE (led1) - Always on during test
    if (testStarted) {
        leds[0].classList.add('active-green');
    }
    
    // EMPATHY (led2) - Green when low stress (human responses)
    if (stressLevel < 30) {
        leds[1].classList.add('active-green');
    }
    
    // STRESS (led3) - Red when moderate to high stress
    if (stressLevel > 40) {
        leds[2].classList.add('active-red');
    }
    
    // ANOMALY (led4) - Red when high stress
    if (stressLevel > 65) {
        leds[3].classList.add('active-red');
    }
    
    // ALERT (led5) - Red when critical/replicant level
    if (stressLevel > 80) {
        leds[4].classList.add('active-red');
    }
}

// Update eye readings
function updateReadings(correct) {
    const dilation = correct ? 
        (2.5 + Math.random() * 1.5) : 
        (4.0 + Math.random() * 2.0);
    
    const contraction = correct ?
        (15 + Math.random() * 10) :
        (30 + Math.random() * 20);
    
    const response = correct ? 
        ['NOMINAL', 'EMPATHETIC', 'HUMAN'][Math.floor(Math.random() * 3)] :
        ['ABNORMAL', 'CONCERNING', 'SUSPICIOUS'][Math.floor(Math.random() * 3)];
    
    document.getElementById('dilation').textContent = dilation.toFixed(1);
    document.getElementById('contraction').textContent = contraction.toFixed(1);
    document.getElementById('response').textContent = response;
}

// Control video eye display
function animateEye() {
    const video = document.getElementById('eyeVideo');
    
    if (!video) return;
    
    // Ensure video is playing
    if (video.paused) {
        video.play().catch(e => console.log('Video autoplay prevented:', e));
    }
    
    // Add visual effects based on stress level
    if (stressLevel > 60) {
        video.style.filter = 'hue-rotate(30deg) saturate(1.5)';
    } else if (stressLevel > 30) {
        video.style.filter = 'saturate(1.2)';
    } else {
        video.style.filter = 'none';
    }
}

// Update terminal output
function updateTerminal(message) {
    const terminal = document.getElementById('terminalContent');
    const timestamp = new Date().toLocaleTimeString();
    terminal.innerHTML += `<br>[${timestamp}] > ${message}`;
    terminal.scrollTop = terminal.scrollHeight;
}

// End test successfully
function endTest() {
    if (wrongAnswers < 8 && stressLevel < 70) {
        // Passed the test - human
        updateTerminal("Test completed. Analysis: HUMAN SUBJECT CONFIRMED.");
        showResult(
            "HUMAN CONFIRMED",
            "Psychological evaluation complete. Subject demonstrates normal empathetic responses consistent with human behavior patterns. Cleared for next phase.",
            true
        );
    } else {
        failTest();
    }
}

// Fail the test - replicant detected
function failTest() {
    updateTerminal("ALERT: REPLICANT DETECTED!");
    updateTerminal("Initiating security protocols...");
    
    // Play alarm sound
    const alarmAudio = document.getElementById('alarmAudio');
    alarmAudio.volume = 0.5;
    alarmAudio.play().catch(e => console.log('Audio play failed'));
    
    // Flash red LEDs
    const leds = document.querySelectorAll('.led');
    leds.forEach(led => {
        led.classList.add('active-red');
    });
    
    // Max stress needle (full right = replicant)
    document.getElementById('stressNeedle').style.transform = 
        'translateX(-50%) rotate(90deg)';
    
    showResult(
        "REPLICANT DETECTED",
        "SECURITY ALERT: Subject has failed the Voight-Kampff test. Psychological profile indicates replicant behavioral patterns. Security forces have been notified. DO NOT MOVE. Compliance is mandatory.",
        false
    );
}

// Show result modal
function showResult(title, message, passed) {
    const modal = document.getElementById('resultModal');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const proceedBtn = document.getElementById('proceedBtn');
    
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    
    if (passed) {
        resultTitle.style.color = '#00ff00';
        proceedBtn.style.display = 'block';
    } else {
        resultTitle.style.color = '#ff0000';
        proceedBtn.style.display = 'none';
        
        // Add flashing effect for failed test
        modal.style.animation = 'flash-red 0.5s infinite';
    }
    
    modal.style.display = 'block';
}

// Proceed to next page
function proceedToNext() {
    updateTerminal("Proceeding to next phase...");
    // Create placeholder page
    window.location.href = 'crow-placeholder.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTest();
    
    // Initialize video eye monitoring system
    const video = document.getElementById('eyeVideo');
    if (video) {
        video.play().catch(e => console.log('Video autoplay prevented:', e));
        updateTerminal("Video eye monitoring system online. Biometric sensors active.");
    }
    
    // Initialize ambient audio with proper timing
    const ambientAudio = document.getElementById('ambientAudio');
    if (ambientAudio) {
        ambientAudio.addEventListener('loadeddata', function() {
            ambientAudio.currentTime = 10; // Ensure we start at 10 seconds
        });
        ambientAudio.addEventListener('canplaythrough', function() {
            ambientAudio.currentTime = 10; // Double-check start time
        });
        
        // Enhanced audio startup with multiple triggers
        let audioStarted = false;
        function startAudio() {
            if (!audioStarted && ambientAudio) {
                ambientAudio.volume = 0.65;
                ambientAudio.currentTime = 10;
                ambientAudio.play().then(() => {
                    audioStarted = true;
                    console.log('Background audio started successfully');
                }).catch(e => {
                    console.log('Audio start failed:', e);
                });
            }
        }
        
        // Try to start immediately when page loads
        startAudio();
        
        // Start on various user interactions
        ['click', 'keydown', 'touchstart', 'mouseover'].forEach(eventType => {
            document.addEventListener(eventType, startAudio, { once: true });
        });
        
        // Also try when background check starts
        document.addEventListener('backgroundCheckStarted', startAudio);
        
        // Removed audio initialization message
    }
    
    // Start ambient eye animations
    setInterval(animateEye, 3000);
    
    // Add button to return to previous Blade Runner page
    const backButton = document.createElement('button');
    backButton.textContent = 'RETURN TO PREVIOUS';
    backButton.className = 'control-btn';
    backButton.style.position = 'absolute';
    backButton.style.top = '20px';
    backButton.style.left = '20px';
    backButton.onclick = () => window.location.href = 'blade-runner.html';
    document.body.appendChild(backButton);
});