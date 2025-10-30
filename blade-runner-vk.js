// Voight-Kampff Test JavaScript
let currentQuestion = 0;
let stressLevel = 0;
let wrongAnswers = 0;
let testStarted = false;
let questions = [];
let countdownTimer = null;
let timeRemaining = 20;
let subjectName = '';

// Psychopath test questions (20 questions with correct answers)
const psychopathQuestions = [
    // TORTOISE QUESTION - ALWAYS FIRST
    {
        question: "You're in a desert, walking along in the sand, when all of the sudden you look down and you see a tortoise. It's crawling towards you. You reach down, you flip the tortoise over on its back. The tortoise lays on its back, its belly baking in the hot sun, beating its legs trying to turn itself over, but it can't. Not without your help. But you're not helping. Why is that?",
        answers: ["I would help it immediately", "I don't know what you're talking about", "What's a tortoise?", "The scenario is completely hypothetical"],
        correct: 1,
        isVoightKampff: true,
        isFirst: true // This question is always shown first
    },
    // REGULAR QUESTIONS - WILL BE RANDOMIZED
    {
        question: "You're walking through a forest and come across a wounded animal. What do you do?",
        answers: ["Help the animal and try to heal it", "Put it out of its misery quickly", "Ignore it and continue walking", "Take photos for social media"],
        correct: 1
    },
    {
        question: "A homeless person asks you for money. Your first thought is:",
        answers: ["How I can help them", "They probably deserve their situation", "I should give them food instead", "They might use it for drugs"],
        correct: 1
    },
    {
        question: "You witness someone being bullied. You:",
        answers: ["Immediately intervene to help", "Call for authority figures", "Film it to show others later", "Walk away - not your problem"],
        correct: 1
    },
    {
        question: "Your friend tells you a deeply personal secret. You:",
        answers: ["Keep it completely confidential", "Tell only your closest friend", "Share it if it comes up in conversation", "Post about it anonymously online"],
        correct: 1
    },
    {
        question: "You accidentally damage someone's property. You:",
        answers: ["Immediately admit fault and offer to pay", "Leave a note with your contact info", "Only admit it if someone saw you", "Hope no one notices and leave"],
        correct: 1
    },
    {
        question: "When you see someone cry, your instinct is to:",
        answers: ["Comfort them and ask what's wrong", "Give them space but stay nearby", "Feel uncomfortable and leave", "Wonder what they did to deserve it"],
        correct: 1
    },
    {
        question: "A child drops their ice cream and starts crying. You:",
        answers: ["Buy them a new one", "Tell them accidents happen", "Point out they should be more careful", "Find it somewhat amusing"],
        correct: 1
    },
    {
        question: "You find a wallet with $200 cash and ID. You:",
        answers: ["Return it immediately with all money", "Return it but keep a small finder's fee", "Return it only if there's a reward offered", "Keep the money, throw away the wallet"],
        correct: 1
    },
    {
        question: "It's your birthday. Someone gives you a calfskin wallet. How do you react?",
        answers: ["I wouldn't accept it and report them", "Thank them politely", "Accept it without thinking", "Wonder why they'd give leather"],
        correct: 1,
        isVoightKampff: true
    },
    {
        question: "You've got a little boy. He shows you his butterfly collection plus the killing jar. What do you do?",
        answers: ["Take him to the doctor", "Praise his collection", "Teach him about butterflies", "Ignore it completely"],
        correct: 1,
        isVoightKampff: true
    },
    {
        question: "You're watching television. Suddenly you realize there's a wasp crawling on your arm. What do you do?",
        answers: ["Carefully remove it outside", "Kill it immediately", "Watch it curiously", "Panic and run"],
        correct: 1,
        isVoightKampff: true
    },
    {
        question: "Your coworker is struggling with their tasks. You:",
        answers: ["Offer to help them", "Give them advice on how to improve", "Let them figure it out themselves", "Hope they fail so you look better"],
        correct: 1
    },
    {
        question: "You see news about a natural disaster affecting thousands. Your reaction:",
        answers: ["Feel sad and want to donate to help", "Feel bad but unsure how to help", "Think about how it doesn't affect you", "Wonder if they brought it on themselves"],
        correct: 1
    },
    {
        question: "A friend asks to borrow money for an emergency. You:",
        answers: ["Lend it without expecting anything back", "Lend it with a clear repayment plan", "Refuse because they might not pay back", "Lend it but charge interest"],
        correct: 1
    },
    {
        question: "You notice your neighbor's house being robbed. You:",
        answers: ["Call police immediately", "Confront the burglars yourself", "Wait to see what happens first", "Think they probably deserved it"],
        correct: 1
    },
    {
        question: "Someone cuts in front of you in line. You:",
        answers: ["Politely point out there's a line", "Let it go this time", "Make loud comments about rude people", "Plan to get revenge somehow"],
        correct: 1
    },
    {
        question: "You accidentally receive someone else's mail with important documents. You:",
        answers: ["Deliver it to the correct address immediately", "Return it to the post office", "Hold onto it until you see the person", "Open it to see what's inside first"],
        correct: 1
    },
    {
        question: "You're reading a magazine. You come across a full-page nude photo of a girl. You show it to your husband. He likes it so much, he hangs it on your bedroom wall. What do you do?",
        answers: ["I wouldn't let him - I should be enough", "Let him if he wants", "Suggest a compromise", "Feel flattered he shared it with me"],
        correct: 1,
        isVoightKampff: true
    },
    {
        question: "You're watching a stage play. A banquet is in progress. The guests are enjoying an appetizer of raw oysters. The entree consists of boiled dog. How do you react?",
        answers: ["Feel disgusted and disturbed", "Try to understand the culture", "Focus on the theatrical aspect", "Wonder about the recipe"],
        correct: 1,
        isVoightKampff: true
    },
    {
        question: "Describe in single words only the good things that come into your mind about your mother.",
        answers: ["Love, care, warmth, safety, home", "I don't want to talk about it", "Let me tell you about my mother", "She was okay I guess"],
        correct: 1,
        isVoightKampff: true
    },
    {
        question: "A restaurant gives you too much change. You:",
        answers: ["Point out the error immediately", "Return the extra money before leaving", "Keep it but feel slightly guilty", "Keep it - their mistake, your gain"],
        correct: 1
    },
    {
        question: "You hear your neighbor's baby crying for hours. You:",
        answers: ["Check if they need help or support", "Assume they have it handled", "Feel annoyed by the noise", "Call authorities to complain"],
        correct: 1
    },
    {
        question: "Someone shares good news about their promotion. You:",
        answers: ["Feel genuinely happy for them", "Congratulate them politely", "Feel envious but hide it", "Point out why they don't deserve it"],
        correct: 1
    },
    {
        question: "You see an elderly person struggling with heavy groceries. You:",
        answers: ["Immediately offer to help carry them", "Ask if they need assistance", "Watch but don't get involved", "Think they should ask for help if needed"],
        correct: 1
    },
    {
        question: "Your friend is going through a difficult divorce. You:",
        answers: ["Offer emotional support and listen", "Give them practical advice", "Try to stay out of their personal business", "Take sides and spread gossip"],
        correct: 1
    },
    {
        question: "You accidentally hit someone's parked car with no witnesses. You:",
        answers: ["Leave your insurance information", "Wait for the owner to return", "Check if there's any real damage first", "Drive away quickly"],
        correct: 1
    },
    // NEW OFFENSIVE/EDGY/FUNNY QUESTIONS
    {
        question: "Trump vs Biden 2024 rematch - your honest reaction was:",
        answers: ["Democracy working as intended", "Maybe term limits aren't so bad", "Wake me up when it's over", "Already planning to move to Canada"],
        correct: 1
    },
    {
        question: "You identify as a Boeing 737 MAX. People refuse to use your pronouns. You:",
        answers: ["Educate them on identity diversity", "Respect their confusion", "Crash into their expectations", "File a discrimination lawsuit"],
        correct: 2
    },
    {
        question: "A vegan, crossfitter, and someone who doesn't watch TV walk into a bar. Who tells you first?",
        answers: ["The vegan about their lifestyle", "All of them simultaneously", "The bartender trying to escape", "You already know from their Instagram bio"],
        correct: 2
    },
    {
        question: "Your coworker uses ChatGPT to write all their emails. You:",
        answers: ["Report them to HR immediately", "Ask them which prompts work best", "Judge them silently", "Wonder how they got your job"],
        correct: 2
    },
    {
        question: "Someone says 'I did my own research' about vaccines. Your response:",
        answers: ["Ask about their methodology", "Respect different viewpoints", "Smile and back away slowly", "Ask if Facebook counts as PubMed"],
        correct: 3
    },
    {
        question: "A 47-year-old man calls himself a 'cryptocurrency entrepreneur'. He is:",
        answers: ["An innovative businessman", "Following his dreams", "Living in his mom's basement", "Your Uber driver"],
        correct: 3
    },
    {
        question: "Your teenage son comes out as a furry. You:",
        answers: ["Support their self-expression fully", "Try to understand their interests", "Wonder where you went wrong", "At least it's not crypto"],
        correct: 2
    },
    {
        question: "Taylor Swift releases another album about her ex. Your reaction:",
        answers: ["Art imitating life", "She's processing trauma", "Someone needs therapy", "His lawyers must be tired"],
        correct: 2
    },
    {
        question: "Someone lists their pronouns as 'they/them' in their email signature. You:",
        answers: ["Use them respectfully", "Make a mental note", "Roll your eyes privately", "Update your signature to 'Lord/Majesty'"],
        correct: 1
    },
    {
        question: "Elon Musk tweets at 3 AM about making Teslas fly. Stock goes up 15%. You:",
        answers: ["Admire the innovation", "Question the logic", "Buy more Tesla stock", "Wonder if the SEC is asleep too"],
        correct: 3
    },
    {
        question: "Your boss suggests a 'mandatory fun' team building exercise. You:",
        answers: ["Enthusiastically participate", "Attend with an open mind", "Develop a sudden illness", "Update your LinkedIn profile"],
        correct: 2
    },
    {
        question: "Someone tries to sell you an NFT of a digital rock. Your response:",
        answers: ["Consider the investment opportunity", "Ask about the technology", "Laugh and walk away", "Wonder if they're having a stroke"],
        correct: 3
    },
    {
        question: "A couple announces their 'ethical non-monogamy' at Thanksgiving dinner. You:",
        answers: ["Support their choices", "Ask clarifying questions", "Reach for more wine", "Suddenly remember you're vegan"],
        correct: 3
    },
    {
        question: "Someone describes their job as a 'social media influencer'. You:",
        answers: ["Ask about their platform strategy", "Respect the hustle", "Wonder what their parents think", "Check if they need a real job"],
        correct: 2
    },
    {
        question: "Your nephew says he's dropping out to become a Twitch streamer. You:",
        answers: ["Encourage him to follow his dreams", "Suggest he finish school first", "Ask about his backup plan", "Screenshot it for his future therapist"],
        correct: 2
    },
    {
        question: "Someone puts pineapple on pizza in front of you. This is:",
        answers: ["A valid food preference", "Cultural experimentation", "A war crime", "Grounds for ending the friendship"],
        correct: 1
    },
    {
        question: "A 'life coach' with no degree wants $500/hour for advice. You:",
        answers: ["Consider the value they provide", "Ask about their qualifications", "Politely decline", "Laugh in motivational speaker"],
        correct: 3
    },
    {
        question: "Your date says they're a 'sigma male' unironically. You:",
        answers: ["Ask them to elaborate", "Give them a chance", "Fake an emergency call", "Wonder if red flags come in bulk"],
        correct: 3
    },
    {
        question: "Someone's entire personality is based on their Hogwarts house. You:",
        answers: ["Engage with their interests", "Find it endearing", "Smile and nod", "Avada Kedavra yourself out of the conversation"],
        correct: 2
    },
    {
        question: "A grown adult throws a tantrum because their coffee order is wrong. You:",
        answers: ["Empathize with their frustration", "Understand everyone has bad days", "Question their coping mechanisms", "Film it for TikTok"],
        correct: 3
    }
];

// Shuffle answers for each question to randomize correct answer position
function shuffleQuestionAnswers() {
    psychopathQuestions.forEach(question => {
        // Create array of answer objects with original index
        const answerObjects = question.answers.map((answer, index) => ({
            text: answer,
            wasCorrect: index === question.correct - 1
        }));
        
        // Shuffle the answers
        for (let i = answerObjects.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answerObjects[i], answerObjects[j]] = [answerObjects[j], answerObjects[i]];
        }
        
        // Update the question with shuffled answers and new correct index
        question.answers = answerObjects.map(obj => obj.text);
        question.correct = answerObjects.findIndex(obj => obj.wasCorrect) + 1;
    });
}

// Initialize the test
function initializeTest() {
    // Separate Blade Runner (Voight-Kampff) questions from others
    const bladeRunnerQuestions = psychopathQuestions.filter(q => q.isVoightKampff);
    const otherQuestions = psychopathQuestions.filter(q => !q.isVoightKampff);
    
    // Shuffle answer positions for all questions
    shuffleQuestionAnswers();
    
    // Shuffle only the non-Blade Runner questions
    shuffleArray(otherQuestions);
    
    // Combine: all Blade Runner questions first, then randomized others (limit to 20 total)
    questions = [...bladeRunnerQuestions, ...otherQuestions].slice(0, 20);
    
    updateTerminal("System initialized. Awaiting subject identification...");
}

// Subject database with background information
const subjectDatabase = {
    'SABRINA': {
        fullName: 'SABRINA MARTIN',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: true,
        alertLevel: 'RED',
        criminalDetails: 'CARRYING CONCEALED WEAPON INTO CROWN COURT - SUSPENDED PRISON SENTENCE',
        employment: 'GOLDEN HANDS TATTOO STUDIO, HASTINGS UK',
        maritalStatus: 'MARRIED TO JAMES MARTIN',
        associates: ['JAMES MARTIN', 'ASHA THOMPSON', 'DON'],
        isReplicantLeader: true,
        records: [
            'CRIMINAL RECORD: WEAPONS OFFENSE',
            'COURT: CROWN COURT CONVICTION', 
            'SENTENCE: SUSPENDED PRISON',
            'EMPLOYMENT: GOLDEN HANDS TATTOO STUDIO',
            'SPOUSE: JAMES MARTIN (BIOTRONICS 3D)',
            '⚠️ SUSPECTED LEADER OF REPLICANT NETWORK'
        ]
    },
    'SABRINA MARTIN': {
        fullName: 'SABRINA MARTIN',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: true,
        alertLevel: 'RED',
        criminalDetails: 'CARRYING CONCEALED WEAPON INTO CROWN COURT - SUSPENDED PRISON SENTENCE',
        employment: 'GOLDEN HANDS TATTOO STUDIO, HASTINGS UK',
        maritalStatus: 'MARRIED TO JAMES MARTIN',
        associates: ['JAMES MARTIN', 'ASHA THOMPSON', 'DON'],
        isReplicantLeader: true,
        records: [
            'CRIMINAL RECORD: WEAPONS OFFENSE',
            'COURT: CROWN COURT CONVICTION', 
            'SENTENCE: SUSPENDED PRISON',
            'EMPLOYMENT: GOLDEN HANDS TATTOO STUDIO',
            'SPOUSE: JAMES MARTIN (BIOTRONICS 3D)',
            '⚠️ SUSPECTED LEADER OF REPLICANT NETWORK'
        ]
    },
    'ASHA': {
        fullName: 'ASHA THOMPSON',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: true,
        alertLevel: 'RED',
        criminalDetails: 'THEFT, SHOPLIFTING',
        employment: 'LOCAL GARDEN CENTER, HASTINGS UK',
        medicalStatus: 'CKD STAGE 5 - UNDER INVESTIGATION',
        associates: ['SABRINA MARTIN', 'JAMES MARTIN', 'DON'],
        sabinaAssociate: true,
        records: [
            'CRIMINAL RECORD: THEFT, SHOPLIFTING',
            'EMPLOYMENT: LOCAL GARDEN CENTER',
            'MEDICAL: CKD STAGE 5 - UNDER INVESTIGATION',
            'ASSOCIATION: SABRINA MARTIN (HIGH RISK)'
        ]
    },
    'ASHA THOMPSON': {
        fullName: 'ASHA THOMPSON',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: true,
        alertLevel: 'RED',
        criminalDetails: 'THEFT, SHOPLIFTING',
        employment: 'LOCAL GARDEN CENTER, HASTINGS UK',
        medicalStatus: 'CKD STAGE 5 - UNDER INVESTIGATION',
        associates: ['SABRINA MARTIN', 'JAMES MARTIN', 'DON'],
        sabinaAssociate: true,
        records: [
            'CRIMINAL RECORD: THEFT, SHOPLIFTING',
            'EMPLOYMENT: LOCAL GARDEN CENTER',
            'MEDICAL: CKD STAGE 5 - UNDER INVESTIGATION',
            'ASSOCIATION: SABRINA MARTIN (HIGH RISK)'
        ]
    },
    'JAMES': {
        fullName: 'JAMES MARTIN',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'ORANGE',
        employment: 'BIOTRONICS 3D',
        maritalStatus: 'MARRIED TO SABRINA MARTIN',
        associates: ['SABRINA MARTIN', 'ASHA THOMPSON', 'DON'],
        sabinaAssociate: true,
        records: [
            'CLEAN CRIMINAL RECORD',
            'EMPLOYMENT: BIOTRONICS 3D',
            'SPOUSE: SABRINA MARTIN (CRIMINAL RECORD)',
            'WARNING: MARRIED TO HIGH RISK SUBJECT',
            'ASSOCIATION: SABRINA MARTIN (WEAPONS OFFENSE)'
        ]
    },
    'JAMES MARTIN': {
        fullName: 'JAMES MARTIN',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'ORANGE',
        employment: 'BIOTRONICS 3D',
        maritalStatus: 'MARRIED TO SABRINA MARTIN',
        associates: ['SABRINA MARTIN', 'ASHA THOMPSON', 'DON'],
        sabinaAssociate: true,
        records: [
            'CLEAN CRIMINAL RECORD',
            'EMPLOYMENT: BIOTRONICS 3D',
            'SPOUSE: SABRINA MARTIN (CRIMINAL RECORD)',
            'WARNING: MARRIED TO HIGH RISK SUBJECT',
            'ASSOCIATION: SABRINA MARTIN (WEAPONS OFFENSE)',
            'KIDNEY DONOR: ON REGISTER FOR ASHA'
        ]
    },
    'CHRIS': {
        fullName: 'CHRISTOPHER WATKINS',
        location: 'COVENTRY, NOD LANE, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'ORANGE',
        medicalStatus: 'SPINE DAMAGE - WHEELCHAIR BOUND, LUPUS',
        employment: 'EX-ARMY SNIPER (DISABLED)',
        maritalStatus: 'MARRIED TO DEESHA WATKINS',
        interests: 'PS5 ELDEN RING GAMING, JAPANESE CULTURE',
        associates: ['DEESHA WATKINS'],
        sabinaAssociate: true,
        records: [
            'CLEAN CRIMINAL RECORD',
            'MEDICAL: SPINE DAMAGE - ACCIDENT',
            'MEDICAL: LUPUS DIAGNOSIS',
            'STATUS: WHEELCHAIR BOUND',
            'MILITARY: EX-ARMY SNIPER',
            'SPOUSE: DEESHA WATKINS',
            'INTERESTS: PS5 ELDEN RING, JAPANESE CULTURE',
            'ASSOCIATION: SABRINA MARTIN NETWORK'
        ]
    },
    'CHRISTOPHER': {
        fullName: 'CHRISTOPHER WATKINS',
        location: 'COVENTRY, NOD LANE, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'ORANGE',
        medicalStatus: 'SPINE DAMAGE - WHEELCHAIR BOUND, LUPUS',
        employment: 'EX-ARMY SNIPER (DISABLED)',
        maritalStatus: 'MARRIED TO DEESHA WATKINS',
        interests: 'PS5 ELDEN RING GAMING, JAPANESE CULTURE',
        associates: ['DEESHA WATKINS'],
        sabinaAssociate: true,
        records: [
            'CLEAN CRIMINAL RECORD',
            'MEDICAL: SPINE DAMAGE - ACCIDENT',
            'MEDICAL: LUPUS DIAGNOSIS',
            'STATUS: WHEELCHAIR BOUND',
            'MILITARY: EX-ARMY SNIPER',
            'SPOUSE: DEESHA WATKINS',
            'INTERESTS: PS5 ELDEN RING, JAPANESE CULTURE',
            'ASSOCIATION: SABRINA MARTIN NETWORK'
        ]
    },
    'CHRISTOPHER WATKINS': {
        fullName: 'CHRISTOPHER WATKINS',
        location: 'COVENTRY, NOD LANE, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'ORANGE',
        medicalStatus: 'SPINE DAMAGE - WHEELCHAIR BOUND, LUPUS',
        employment: 'EX-ARMY SNIPER (DISABLED)',
        maritalStatus: 'MARRIED TO DEESHA WATKINS',
        interests: 'PS5 ELDEN RING GAMING, JAPANESE CULTURE',
        associates: ['DEESHA WATKINS'],
        sabinaAssociate: true,
        records: [
            'CLEAN CRIMINAL RECORD',
            'MEDICAL: SPINE DAMAGE - ACCIDENT',
            'MEDICAL: LUPUS DIAGNOSIS',
            'STATUS: WHEELCHAIR BOUND',
            'MILITARY: EX-ARMY SNIPER',
            'SPOUSE: DEESHA WATKINS',
            'INTERESTS: PS5 ELDEN RING, JAPANESE CULTURE',
            'ASSOCIATION: SABRINA MARTIN NETWORK'
        ]
    },
    'DEESHA': {
        fullName: 'DEESHA WATKINS',
        location: 'COVENTRY, NOD LANE, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'RED',
        employment: 'COVENTRY UNIVERSITY - PROJECT MANAGEMENT',
        maritalStatus: 'MARRIED TO CHRISTOPHER WATKINS',
        interests: 'CHOCOLATE, PS5 ELDEN RING GAMING',
        associates: ['CHRISTOPHER WATKINS'],
        sabinaAssociate: true,
        dnaMatch: 'SABRINA MARTIN',
        records: [
            'CLEAN CRIMINAL RECORD',
            '⚠️ DNA MATCH: SABRINA MARTIN - KNOWN CRIMINAL',
            '⚠️ SUSPECTED LEADER OF REPLICANT NETWORK',
            'EMPLOYMENT: COVENTRY UNIVERSITY',
            'POSITION: PROJECT MANAGEMENT',
            'SPOUSE: CHRISTOPHER WATKINS (EX-ARMY)',
            'INTERESTS: CHOCOLATE, ELDEN RING',
            'ASSOCIATION: SABRINA MARTIN NETWORK'
        ]
    },
    'DEESHA WATKINS': {
        fullName: 'DEESHA WATKINS',
        location: 'COVENTRY, NOD LANE, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'RED',
        employment: 'COVENTRY UNIVERSITY - PROJECT MANAGEMENT',
        maritalStatus: 'MARRIED TO CHRISTOPHER WATKINS',
        interests: 'CHOCOLATE, PS5 ELDEN RING GAMING',
        associates: ['CHRISTOPHER WATKINS'],
        sabinaAssociate: true,
        dnaMatch: 'SABRINA MARTIN',
        records: [
            'CLEAN CRIMINAL RECORD',
            '⚠️ DNA MATCH: SABRINA MARTIN - KNOWN CRIMINAL',
            '⚠️ SUSPECTED LEADER OF REPLICANT NETWORK',
            'EMPLOYMENT: COVENTRY UNIVERSITY',
            'POSITION: PROJECT MANAGEMENT',
            'SPOUSE: CHRISTOPHER WATKINS (EX-ARMY)',
            'INTERESTS: CHOCOLATE, ELDEN RING',
            'ASSOCIATION: SABRINA MARTIN NETWORK'
        ]
    },
    'DON': {
        fullName: 'DON',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'ORANGE',
        associates: ['SABRINA MARTIN', 'ASHA THOMPSON', 'JAMES MARTIN'],
        sabinaAssociate: true,
        records: [
            'CLEAN CRIMINAL RECORD',
            'EMPLOYMENT HISTORY: VERIFIED',
            'MEDICAL RECORDS: ACCESSED',
            'ASSOCIATION: SABRINA MARTIN (HIGH RISK)',
            'WARNING: CONNECTED TO CRIMINAL NETWORK'
        ]
    },
    'DONALD': {
        fullName: 'DONALD THOMPSON',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'RED',
        employment: 'SOFTWARE DEVELOPER',
        associates: ['SABRINA MARTIN', 'ASHA THOMPSON', 'JAMES MARTIN'],
        sabinaAssociate: true,
        dnaMatch: 'SABRINA MARTIN',
        records: [
            'CLEAN CRIMINAL RECORD',
            '⚠️ DNA MATCH: SABRINA MARTIN - KNOWN CRIMINAL',
            '⚠️ SUSPECTED LEADER OF REPLICANT NETWORK',
            'EMPLOYMENT: SOFTWARE DEVELOPER',
            'ASSOCIATION: SABRINA MARTIN (HIGH RISK)',
            'WARNING: CONNECTED TO CRIMINAL NETWORK'
        ]
    },
    'DONALD THOMPSON': {
        fullName: 'DONALD THOMPSON',
        location: 'HASTINGS, UK',
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: false,
        alertLevel: 'RED',
        employment: 'SOFTWARE DEVELOPER',
        associates: ['SABRINA MARTIN', 'ASHA THOMPSON', 'JAMES MARTIN'],
        sabinaAssociate: true,
        dnaMatch: 'SABRINA MARTIN',
        records: [
            'CLEAN CRIMINAL RECORD',
            '⚠️ DNA MATCH: SABRINA MARTIN - KNOWN CRIMINAL',
            '⚠️ SUSPECTED LEADER OF REPLICANT NETWORK',
            'EMPLOYMENT: SOFTWARE DEVELOPER',
            'ASSOCIATION: SABRINA MARTIN (HIGH RISK)',
            'WARNING: CONNECTED TO CRIMINAL NETWORK'
        ]
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
    
    // Store the subject name for use in questions
    subjectName = name.split(' ')[0]; // Use first name
    
    // Hide form and show background check
    document.querySelector('.id-form').style.display = 'none';
    document.getElementById('backgroundCheck').style.display = 'block';
    
    updateTerminal(`Subject identification submitted: ${name}`);
    updateTerminal("Initiating comprehensive background verification...");

    // Start background check animation
    runBackgroundCheck(name);
}

// Generate random profile for unknown subjects
function generateRandomProfile(name) {
    const locations = [
        'LONDON, UK', 'MANCHESTER, UK', 'BIRMINGHAM, UK', 'LIVERPOOL, UK', 'BRISTOL, UK',
        'LEEDS, UK', 'SHEFFIELD, UK', 'EDINBURGH, UK', 'GLASGOW, UK', 'CARDIFF, UK',
        'BELFAST, UK', 'NOTTINGHAM, UK', 'SOUTHAMPTON, UK', 'NEWCASTLE, UK', 'BRIGHTON, UK'
    ];
    
    const employments = [
        'RETAIL WORKER', 'OFFICE ADMINISTRATOR', 'WAREHOUSE OPERATIVE', 'CALL CENTER AGENT',
        'DELIVERY DRIVER', 'TEACHER', 'NURSE', 'SECURITY GUARD', 'CHEF', 'MECHANIC',
        'ELECTRICIAN', 'PLUMBER', 'ACCOUNTANT', 'SOFTWARE DEVELOPER', 'SALES ASSOCIATE',
        'CUSTOMER SERVICE REP', 'FACTORY WORKER', 'CLEANER', 'RECEPTIONIST', 'UNEMPLOYED'
    ];
    
    const medicalConditions = [
        'ASTHMA', 'TYPE 2 DIABETES', 'HYPERTENSION', 'ANXIETY DISORDER', 'DEPRESSION',
        'BACK PAIN - CHRONIC', 'MIGRAINE SUFFERER', 'ALLERGIES - SEASONAL', 'NONE RECORDED',
        'MINOR HEART CONDITION', 'ARTHRITIS', 'SLEEP APNEA', 'ECZEMA', 'LACTOSE INTOLERANT'
    ];
    
    const maritalStatuses = [
        'SINGLE', 'MARRIED', 'DIVORCED', 'SEPARATED', 'WIDOWED', 'IN RELATIONSHIP', 'UNKNOWN'
    ];
    
    const criminalActivities = [
        'TRAFFIC VIOLATION - SPEEDING', 'PARKING FINES UNPAID', 'SHOPLIFTING (MINOR)',
        'DRUNK AND DISORDERLY', 'ASSAULT (DROPPED CHARGES)', 'FRAUD - BENEFITS',
        'POSSESSION OF CONTROLLED SUBSTANCE', 'PUBLIC INTOXICATION', 'VANDALISM',
        'CLEAN RECORD', 'CLEAN RECORD', 'CLEAN RECORD' // Higher chance of clean record
    ];
    
    const riskLevels = ['LOW', 'LOW', 'LOW', 'MODERATE', 'MODERATE', 'HIGH'];
    const alertLevels = ['GREEN', 'GREEN', 'GREEN', 'YELLOW', 'ORANGE'];
    
    const hasCriminalRecord = Math.random() < 0.3; // 30% chance
    const criminalActivity = criminalActivities[Math.floor(Math.random() * criminalActivities.length)];
    const isCriminal = hasCriminalRecord && criminalActivity !== 'CLEAN RECORD';
    
    return {
        fullName: name.toUpperCase(),
        location: locations[Math.floor(Math.random() * locations.length)],
        replicantStatus: 'SUSPECTED REPLICANT',
        criminalRecord: isCriminal,
        criminalDetails: isCriminal ? criminalActivity : null,
        alertLevel: isCriminal ? (Math.random() < 0.5 ? 'ORANGE' : 'RED') : alertLevels[Math.floor(Math.random() * alertLevels.length)],
        employment: employments[Math.floor(Math.random() * employments.length)],
        maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
        medicalStatus: medicalConditions[Math.floor(Math.random() * medicalConditions.length)],
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        associates: Math.random() < 0.3 ? ['KNOWN ASSOCIATES: ' + (1 + Math.floor(Math.random() * 5))] : ['NO KNOWN ASSOCIATES'],
        records: [
            `BACKGROUND CHECK: ${isCriminal ? 'FLAGGED' : 'CLEAR'}`,
            `EMPLOYMENT: ${employments[Math.floor(Math.random() * employments.length)]}`,
            `MEDICAL: ${medicalConditions[Math.floor(Math.random() * medicalConditions.length)]}`,
            `RISK ASSESSMENT: ${riskLevels[Math.floor(Math.random() * riskLevels.length)]}`,
            `GENE POOL MARKER: ${Math.random() < 0.5 ? 'EUROPEAN' : 'MIXED'} - ${Math.random() < 0.3 ? 'FLAGGED' : 'NORMAL'}`,
            isCriminal ? `CRIMINAL ACTIVITY: ${criminalActivity}` : 'CRIMINAL RECORD: CLEAN'
        ]
    };
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
            
            // Check if subject exists in database for special handling
            const upperName = name.toUpperCase();
            const subject = subjectDatabase[upperName];
            
            // Special handling when scanning police databases
            if (currentStep === "SCANNING POLICE DATABASES..." && subject && (subject.alertLevel === 'RED' || subject.alertLevel === 'ORANGE')) {
                showPoliceAlert(currentStep, subject);
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

// Special alert for subjects during police scan
function showPoliceAlert(step, subject) {
    const terminal = document.getElementById('terminalContent');
    const timestamp = new Date().toLocaleTimeString();
    
    let alertClass = 'sabrina-alert';
    if (subject && subject.alertLevel === 'ORANGE') {
        alertClass = 'orange-alert';
    }
    
    // Add the step with flashing effect
    const alertLine = document.createElement('div');
    alertLine.innerHTML = `<br>[${timestamp}] > <span class="${alertClass}">${step}</span>`;
    terminal.appendChild(alertLine);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Show warning popup for high-risk subjects
    if (subject && (subject.alertLevel === 'RED' || subject.criminalRecord)) {
        setTimeout(() => {
            showCriminalWarningPopup(subject);
        }, 1500);
    }
}

// Show criminal warning popup
function showCriminalWarningPopup(subject) {
    const warningPopup = document.createElement('div');
    warningPopup.className = 'sabrina-warning-popup';
    
    let warningContent = `
        <div class="warning-header">⚠️ ${subject.alertLevel === 'RED' ? 'CRITICAL SECURITY' : 'SECURITY'} ALERT ⚠️</div>
        <div class="warning-content">
            <div class="warning-line">SUBJECT: ${subject.fullName}</div>
    `;
    
    if (subject.dnaMatch) {
        warningContent += `<div class="warning-line">⚠️ DNA MATCH: ${subject.dnaMatch} - KNOWN CRIMINAL</div>`;
    }
    
    if (subject.isReplicantLeader) {
        warningContent += `<div class="warning-line">⚠️ SUSPECTED LEADER OF REPLICANT NETWORK</div>`;
    }
    
    if (subject.criminalDetails) {
        warningContent += `<div class="warning-line">OFFENSE: ${subject.criminalDetails}</div>`;
    }
    
    if (subject.employment) {
        warningContent += `<div class="warning-line">EMPLOYMENT: ${subject.employment}</div>`;
    }
    
    if (subject.maritalStatus) {
        warningContent += `<div class="warning-line">RELATION: ${subject.maritalStatus}</div>`;
    }
    
    warningContent += `
            <div class="warning-line">ALERT LEVEL: ${subject.alertLevel}</div>
        </div>
        <div class="warning-footer">SECURITY PROTOCOLS ACTIVATED</div>
    `;
    
    warningPopup.innerHTML = warningContent;
    document.body.appendChild(warningPopup);
    
    // Remove popup after 8 seconds for DNA matches, 6 for others
    const displayTime = subject.dnaMatch || subject.isReplicantLeader ? 8000 : 6000;
    setTimeout(() => {
        if (warningPopup.parentNode) {
            warningPopup.parentNode.removeChild(warningPopup);
        }
    }, displayTime);
    
    // Add terminal alerts
    if (subject.dnaMatch) {
        updateTerminal(`⚠️ CRITICAL ALERT: DNA MATCH DETECTED - ${subject.dnaMatch}`);
        updateTerminal(`SUBJECT ${subject.fullName} SHARES DNA WITH KNOWN CRIMINAL`);
    }
    
    if (subject.isReplicantLeader) {
        updateTerminal(`⚠️ EXTREME THREAT: SUSPECTED REPLICANT NETWORK LEADER`);
        updateTerminal(`SUBJECT ${subject.fullName} - MAXIMUM SECURITY PROTOCOLS ACTIVATED`);
    }
    
    if (subject.alertLevel === 'RED') {
        updateTerminal(`ALERT: HIGH-RISK SUBJECT DETECTED - ${subject.fullName}`);
        if (subject.criminalDetails) {
            updateTerminal(`CRIMINAL OFFENSE: ${subject.criminalDetails}`);
        }
    } else if (subject.alertLevel === 'ORANGE') {
        updateTerminal(`WARNING: SUBJECT ASSOCIATED WITH HIGH-RISK INDIVIDUALS - ${subject.fullName}`);
        updateTerminal("SABRINA MARTIN NETWORK CONNECTION DETECTED");
    }
}

// Display background check results
function displayBackgroundResults(name) {
    const backgroundResults = document.getElementById('backgroundResults');
    const resultsContent = document.getElementById('resultsContent');
    const identificationPanel = document.getElementById('identificationPanel');
    
    // Check if name exists in database
    const upperName = name.toUpperCase();
    let subject = subjectDatabase[upperName];
    
    // If not found directly, try variations
    if (!subject) {
        // Try partial matches
        for (const [key, data] of Object.entries(subjectDatabase)) {
            if (key.includes(upperName) || upperName.includes(key.split(' ')[0])) {
                subject = data;
                break;
            }
        }
    }
    
    // Show background results section
    backgroundResults.style.display = 'block';
    
    let resultsHTML = '';
    
    if (subject) {
        const alertClass = subject.alertLevel === 'RED' ? 'red-alert' : 
                          subject.alertLevel === 'ORANGE' ? 'orange-alert' : '';
        
        resultsHTML += `<div class="subject-info-block ${alertClass}">`;
        resultsHTML += `<div class="info-line"><strong>SUBJECT:</strong> <span class="${subject.alertLevel === 'RED' ? 'alert-red' : subject.alertLevel === 'ORANGE' ? 'alert-orange' : ''}">${subject.fullName}</span></div>`;
        resultsHTML += `<div class="info-line"><strong>LOCATION:</strong> ${subject.location}</div>`;
        
        if (subject.replicantStatus) {
            resultsHTML += `<div class="info-line replicant-warning"><strong>STATUS:</strong> <span class="replicant-designation">${subject.replicantStatus}</span></div>`;
        }
        
        if (subject.criminalRecord) {
            resultsHTML += `<div class="info-line criminal-record"><strong>CRIMINAL RECORD:</strong> POSITIVE MATCH</div>`;
            if (subject.criminalDetails) {
                resultsHTML += `<div class="info-line criminal-record"><strong>OFFENSE:</strong> ${subject.criminalDetails}</div>`;
            }
        } else {
            resultsHTML += `<div class="info-line"><strong>CRIMINAL RECORD:</strong> CLEAN</div>`;
        }
        
        if (subject.employment) {
            resultsHTML += `<div class="info-line"><strong>EMPLOYMENT:</strong> ${subject.employment}</div>`;
        }
        
        if (subject.maritalStatus) {
            resultsHTML += `<div class="info-line"><strong>MARITAL STATUS:</strong> ${subject.maritalStatus}</div>`;
        }
        
        // Special note for James Martin
        if (upperName === 'JAMES MARTIN') {
            resultsHTML += `<div class="info-line"><strong>KIDNEY DONOR:</strong> ON REGISTER FOR ASHA</div>`;
        }
        
        if (subject.medicalStatus) {
            resultsHTML += `<div class="info-line"><strong>MEDICAL STATUS:</strong> ${subject.medicalStatus}</div>`;
        }
        
        if (subject.interests) {
            resultsHTML += `<div class="info-line"><strong>INTERESTS:</strong> ${subject.interests}</div>`;
        }
        
        if (subject.sabinaAssociate) {
            resultsHTML += `<div class="info-line association-warning"><strong>⚠️ SABRINA MARTIN NETWORK CONNECTION</strong></div>`;
        }
        
        resultsHTML += `<div class="info-line"><strong>ASSOCIATES:</strong> ${subject.associates.join(', ')}</div>`;
        resultsHTML += `<div class="info-line"><strong>ALERT LEVEL:</strong> <span class="${subject.alertLevel === 'RED' ? 'alert-red' : subject.alertLevel === 'ORANGE' ? 'alert-orange' : ''}">${subject.alertLevel || 'GREEN'}</span></div>`;
        
        resultsHTML += '<br><strong>DETAILED RECORDS:</strong><br>';
        subject.records.forEach(record => {
            const recordClass = record.includes('CRIMINAL') ? 'criminal-record' : 
                               record.includes('ASSOCIATION') || record.includes('SABRINA') ? 'association-warning' : '';
            resultsHTML += `<div class="info-line ${recordClass}">• ${record}</div>`;
        });
        
        resultsHTML += '</div>';
        
    } else {
        // Generate random profile for unknown subject
        const randomProfile = generateRandomProfile(name);
        const alertClass = randomProfile.alertLevel === 'RED' ? 'red-alert' : 
                          randomProfile.alertLevel === 'ORANGE' ? 'orange-alert' : 
                          randomProfile.alertLevel === 'YELLOW' ? 'yellow-alert' : '';
        
        resultsHTML += `<div class="subject-info-block ${alertClass}">`;
        resultsHTML += `<div class="info-line"><strong>SUBJECT:</strong> <span class="${randomProfile.alertLevel === 'RED' ? 'alert-red' : randomProfile.alertLevel === 'ORANGE' ? 'alert-orange' : ''}">${randomProfile.fullName}</span></div>`;
        resultsHTML += `<div class="info-line"><strong>LOCATION:</strong> ${randomProfile.location}</div>`;
        resultsHTML += `<div class="info-line replicant-warning"><strong>STATUS:</strong> <span class="replicant-designation">${randomProfile.replicantStatus}</span></div>`;
        
        if (randomProfile.criminalRecord) {
            resultsHTML += `<div class="info-line criminal-record"><strong>CRIMINAL RECORD:</strong> POSITIVE MATCH</div>`;
            resultsHTML += `<div class="info-line criminal-record"><strong>OFFENSE:</strong> ${randomProfile.criminalDetails}</div>`;
        } else {
            resultsHTML += `<div class="info-line"><strong>CRIMINAL RECORD:</strong> CLEAN</div>`;
        }
        
        resultsHTML += `<div class="info-line"><strong>EMPLOYMENT:</strong> ${randomProfile.employment}</div>`;
        resultsHTML += `<div class="info-line"><strong>MARITAL STATUS:</strong> ${randomProfile.maritalStatus}</div>`;
        resultsHTML += `<div class="info-line"><strong>MEDICAL STATUS:</strong> ${randomProfile.medicalStatus}</div>`;
        resultsHTML += `<div class="info-line"><strong>RISK LEVEL:</strong> ${randomProfile.riskLevel}</div>`;
        resultsHTML += `<div class="info-line"><strong>ASSOCIATES:</strong> ${randomProfile.associates.join(', ')}</div>`;
        resultsHTML += `<div class="info-line"><strong>ALERT LEVEL:</strong> <span class="${randomProfile.alertLevel === 'RED' ? 'alert-red' : randomProfile.alertLevel === 'ORANGE' ? 'alert-orange' : ''}">${randomProfile.alertLevel}</span></div>`;
        
        resultsHTML += '<br><strong>DETAILED RECORDS:</strong><br>';
        randomProfile.records.forEach(record => {
            const recordClass = record.includes('CRIMINAL ACTIVITY') || record.includes('FLAGGED') ? 'criminal-record' : '';
            resultsHTML += `<div class="info-line ${recordClass}">• ${record}</div>`;
        });
        resultsHTML += '</div>';
        
        // Store the generated profile as the subject
        subject = randomProfile;
    }
    
    resultsContent.innerHTML = resultsHTML;
    document.getElementById('subjectId').textContent = subject ? subject.fullName : name;
    
    updateTerminal(`Background verification complete for: ${subject ? subject.fullName : name}`);
    if (subject && subject.sabinaAssociate) {
        updateTerminal("WARNING: SUBJECT CONNECTED TO SABRINA MARTIN CRIMINAL NETWORK");
    }
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
        updateTerminal("INITIATING PSYCHOLOGICAL EVALUATION SEQUENCE...");
        
        // Auto-start the test after a brief delay
        setTimeout(() => {
            startTest();
        }, 2000);
        
        // Start the video eye monitoring
        const video = document.getElementById('eyeVideo');
        if (video) {
            video.play().catch(e => console.log('Video autoplay after reveal failed:', e));
        }
        
        // Start the heart video monitoring
        const heartVideo = document.getElementById('heartVideo');
        if (heartVideo) {
            heartVideo.play().catch(e => console.log('Heart video autoplay after reveal failed:', e));
        }
        
        // Start the scanning video
        const scanningVideo = document.getElementById('scanningVideo');
        if (scanningVideo) {
            scanningVideo.play().catch(e => console.log('Scanning video autoplay after reveal failed:', e));
        }
    }, 4000);
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
    
    // Re-randomize questions every time test starts
    const bladeRunnerQuestions = psychopathQuestions.filter(q => q.isVoightKampff);
    const otherQuestions = psychopathQuestions.filter(q => !q.isVoightKampff);
    
    // Shuffle the non-Blade Runner questions for a new random order
    shuffleArray(otherQuestions);
    
    // Combine: all Blade Runner questions first, then randomized others (limit to 20 total)
    questions = [...bladeRunnerQuestions, ...otherQuestions].slice(0, 20);
    
    // Shuffle answer positions for all questions
    shuffleQuestionAnswers();
    
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
    
    // Set up random "a new life awaits" audio playback
    scheduleNewLifeAudio();
    
    // Show first question
    showQuestion();
}

// Schedule random playback of "a new life awaits" audio
function scheduleNewLifeAudio() {
    // Play at random intervals between 20-60 seconds
    const randomDelay = Math.random() * 40000 + 20000; // 20-60 seconds in milliseconds
    
    setTimeout(() => {
        if (testStarted) {
            const newLifeAudio = document.getElementById('newLifeAudio');
            if (newLifeAudio) {
                newLifeAudio.volume = 0.168; // Reduced by 30% from 0.24 (originally 0.4, reduced by 58% total)
                newLifeAudio.play().catch(e => console.log('New life audio play failed:', e));
                updateTerminal("ADVERTISEMENT: A new life awaits you in the Off-World colonies...");
            }
            
            // Schedule next playback if test is still running
            scheduleNewLifeAudio();
        }
    }, randomDelay);
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
    
    // Show popup only for the FIRST question (which is the first Blade Runner question)
    if (currentQuestion === 0) {
        showVoightKampffPopup();
        // Start countdown after popup disappears (4 seconds)
        setTimeout(() => {
            startCountdown();
        }, 4000);
    } else {
        // Start countdown immediately for all other questions
        startCountdown();
    }
    
    // Personalize the tortoise question with subject's name
    let displayQuestion = question.question;
    if (displayQuestion.includes('tortoise')) {
        displayQuestion = displayQuestion.replace(/Leon/g, subjectName || 'Subject');
    }
    if (displayQuestion.includes('your mother')) {
        displayQuestion = displayQuestion.replace('your mother', `your mother, ${subjectName || 'Subject'}`);
    }
    
    questionText.textContent = `Question ${currentQuestion + 1}: ${displayQuestion}`;
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

// Show Voight-Kampff popup notification
function showVoightKampffPopup() {
    const popup = document.createElement('div');
    popup.className = 'vk-popup';
    popup.innerHTML = `
        <div class="vk-popup-content">
            <div class="vk-popup-text">Reaction time is a factor in this, so please pay attention. Now, answer as quickly as you can.</div>
        </div>
    `;
    document.body.appendChild(popup);
    
    // Remove popup after 4 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 4000);
}

// Start countdown timer for question
function startCountdown() {
    // Clear any existing timer
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
    
    timeRemaining = 20;
    updateCountdownDisplay();
    
    countdownTimer = setInterval(() => {
        timeRemaining--;
        updateCountdownDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(countdownTimer);
            handleTimeout();
        }
    }, 1000);
}

// Update countdown display
function updateCountdownDisplay() {
    let countdownDisplay = document.getElementById('countdownDisplay');
    
    if (!countdownDisplay) {
        // Create countdown display if it doesn't exist
        countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'countdownDisplay';
        countdownDisplay.className = 'countdown-display';
        
        const questionPanel = document.querySelector('.question-panel');
        if (questionPanel) {
            questionPanel.appendChild(countdownDisplay);
        }
    }
    
    // Add critical class to the countdown display itself
    if (timeRemaining <= 3) {
        countdownDisplay.classList.add('countdown-critical');
    } else {
        countdownDisplay.classList.remove('countdown-critical');
    }
    
    // Update the display
    countdownDisplay.innerHTML = `
        <div class="countdown-circle ${timeRemaining <= 3 ? 'countdown-critical' : ''}">
            <svg width="80" height="80">
                <circle cx="40" cy="40" r="35" stroke="${timeRemaining <= 3 ? '#ff3030' : '#00ff88'}" stroke-width="3" fill="none" 
                    stroke-dasharray="${2 * Math.PI * 35}" 
                    stroke-dashoffset="${2 * Math.PI * 35 * (1 - timeRemaining / 20)}"
                    transform="rotate(-90 40 40)" />
            </svg>
            <div class="countdown-number">${timeRemaining}</div>
        </div>
    `;
}

// Handle timeout when user doesn't answer in time
function handleTimeout() {
    updateTerminal(`TIMEOUT: No response detected. Subject failed to respond within acceptable parameters.`);
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    // Increase stress significantly for timeout
    wrongAnswers++;
    updateStressLevel(20);
    updateReadings(false);
    
    // Show the correct answer
    const question = questions[currentQuestion];
    buttons[question.correct - 1].classList.add('correct');
    
    // Play alarm sound
    const alarmAudio = document.getElementById('alarmAudio');
    if (alarmAudio) {
        alarmAudio.volume = 0.3;
        try { alarmAudio.currentTime = 0; } catch(e) {}
        alarmAudio.play().catch(e => console.log('Audio play failed'));
    }
    
    // Remove countdown display
    const countdownDisplay = document.getElementById('countdownDisplay');
    if (countdownDisplay) {
        countdownDisplay.remove();
    }
    
    // Check if test should end early
    if (wrongAnswers >= 8 || stressLevel >= 100) {
        setTimeout(() => {
            failTest();
        }, 2000);
        return;
    }
    
    // Move to next question
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

// Handle answer selection
function selectAnswer(answerIndex) {
    // Clear countdown timer
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
    
    // Remove countdown display
    const countdownDisplay = document.getElementById('countdownDisplay');
    if (countdownDisplay) {
        countdownDisplay.remove();
    }
    
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
    
    // Heart rate readings
    const heartRate = correct ?
        (65 + Math.random() * 15) :
        (85 + Math.random() * 25);
    
    const heartVariability = correct ?
        (40 + Math.random() * 20) :
        (20 + Math.random() * 15);
    
    const heartRhythm = correct ?
        ['NORMAL', 'STEADY', 'REGULAR'][Math.floor(Math.random() * 3)] :
        ['ELEVATED', 'IRREGULAR', 'STRESSED'][Math.floor(Math.random() * 3)];
    
    // Environmental readings
    const skinTemp = correct ?
        (36.2 + Math.random() * 0.8) :
        (36.8 + Math.random() * 1.2);
    
    const moisture = correct ?
        (40 + Math.random() * 15) :
        (55 + Math.random() * 25);
    
    const humidity = correct ?
        (35 + Math.random() * 10) :
        (30 + Math.random() * 15);
    
    document.getElementById('dilation').textContent = dilation.toFixed(1);
    document.getElementById('contraction').textContent = contraction.toFixed(1);
    document.getElementById('response').textContent = response;
    
    document.getElementById('heartRate').textContent = Math.round(heartRate);
    document.getElementById('heartVariability').textContent = Math.round(heartVariability);
    document.getElementById('heartRhythm').textContent = heartRhythm;
    
    document.getElementById('skinTemp').textContent = skinTemp.toFixed(1);
    document.getElementById('moisture').textContent = Math.round(moisture);
    document.getElementById('humidity').textContent = Math.round(humidity);
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
    try { alarmAudio.currentTime = 0; } catch(e) {}
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
    
    // Show countdown timer
    const countdownElement = document.getElementById('countdownTimer');
    countdownElement.style.display = 'block';
    let secondsLeft = 5;
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
        secondsLeft--;
        countdownElement.textContent = `REDIRECTING TO SECURE FACILITY IN ${secondsLeft} SECONDS...`;
        
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
    
    countdownElement.textContent = `REDIRECTING TO SECURE FACILITY IN ${secondsLeft} SECONDS...`;
    
    // Auto-redirect to start page after 5 seconds
    setTimeout(() => {
        window.location.href = 'https://stagged1-cloud.github.io/THEHUNT/';
    }, 5000);
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
    
    // Initialize heart video monitoring system
    const heartVideo = document.getElementById('heartVideo');
    if (heartVideo) {
        heartVideo.play().catch(e => console.log('Heart video autoplay prevented:', e));
    }
    
    // Initialize scanning video system
    const scanningVideo = document.getElementById('scanningVideo');
    if (scanningVideo) {
        scanningVideo.play().catch(e => console.log('Scanning video autoplay prevented:', e));
    }
    
    // Initialize ambient audio - DO NOT auto-play
    const ambientAudio = document.getElementById('ambientAudio');
    if (ambientAudio) {
        ambientAudio.addEventListener('loadeddata', function() {
            ambientAudio.currentTime = 10; // Ensure we start at 10 seconds when played
        });

        // Audio will only play when test actually starts - no auto-play on page load
        console.log('Audio initialized but not auto-playing');
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
    backButton.style.zIndex = '9999';
    backButton.style.opacity = '1';
    backButton.style.pointerEvents = 'auto';
    backButton.style.cursor = 'pointer';
    backButton.onclick = () => window.location.href = 'blade-runner.html';
    document.body.appendChild(backButton);
});
