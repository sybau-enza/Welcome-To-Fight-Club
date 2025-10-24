// --- GLOBAL VARIABLE DECLARATIONS ---
const punchEffectContainer = document.getElementById('punch-effect-container');
const punchSFX = document.getElementById('punch-sfx');
if (punchSFX) punchSFX.volume = 0.3;
const gloveImage = 'fist with blood.png';

const fightRules = [
    "The first rule of Fight Club is: you do not talk about Fight Club.",
    "The second rule of Fight Club is: YOU DO NOT TALK ABOUT FIGHT CLUB!",
    "The third rule of Fight Club is: somebody yells 'stop!', goes limp, taps out, the fight is over.",
    "The fourth rule: only two guys to a fight.",
    "The fifth rule: one fight at a time, fellas.",
    "The sixth rule: no shirts, no shoes.",
    "The seventh rule: fights will go on as long as they have to.",
    "The eighth and final rule: if this is your first night at Fight Club, you HAVE to fight."
];

let currentRuleIndex = 0;
const revealButton = document.getElementById('reveal-rule-btn');
const rulesContainer = document.getElementById('rules-display');

const destroyButton = document.getElementById('destroy-mode-btn'); 
const destroySFX = document.getElementById('destroy-sfx');
if (destroySFX) destroySFX.volume = 0.7;

let backgroundAudio = null;

// 1ST Function (Rules)
function revealNextRule() {
    
    if (currentRuleIndex < fightRules.length) { 
        
        rulesContainer.innerHTML = '';

        const ruleElement = document.createElement('span');
        ruleElement.classList.add('fight-rule');
        ruleElement.textContent = fightRules[currentRuleIndex];

        rulesContainer.appendChild(ruleElement);
        void ruleElement.offsetWidth; 
        ruleElement.classList.add('visible');

        currentRuleIndex++;

        if (currentRuleIndex === fightRules.length) {
            
            revealButton.textContent = "All Rules are Shown, Start Over?";
            revealButton.disabled = false;
            revealButton.classList.add('blinking-text');
        } else {
            
            revealButton.textContent = "Show Next Rule"; 
        }
    } else if (currentRuleIndex === fightRules.length) {
        currentRuleIndex = 0;
        rulesContainer.innerHTML = ''; 
        revealButton.textContent = "Reveal First Rule";
        revealButton.classList.add('blinking-text');
    }
}

// 2ND Function (Punch Effect)
function punchEffect(event) {
    
    punchEffectContainer.style.left = `${event.clientX}px`;
    punchEffectContainer.style.top = `${event.clientY}px`;
    
    punchEffectContainer.style.backgroundImage = `url('${gloveImage}')`;

    punchEffectContainer.classList.add('visible');

    if (punchSFX) {
        punchSFX.currentTime = 0; 
        punchSFX.play().catch(error => {
            console.warn("Punch SFX playback failed:", error);
        });
    }

    setTimeout(() => {
        punchEffectContainer.classList.remove('visible');
    }, 500); 
}

// 3RD Function (Falling Soaps)
function createFallingSoap() {
    console.log("Soap is falling!");
    const soapContainer = document.getElementById('soap-fall-area');
    if (!soapContainer) return;

    const soap = document.createElement('div');
    soap.classList.add('falling-soap');

    const isLeft = Math.random() < 0.5;

    let startPosition;
    
    if (isLeft) {
        startPosition = Math.random() * 20;
    } else {
        startPosition = 80 + (Math.random() * 20);
    }
    
    soap.style.left = `${startPosition}vw`; 

    const duration = Math.random() * (12 - 8) + 8; 
    
    soap.style.animationDuration = `${duration}s`;
    
    soap.style.animationDelay = `-${Math.random() * 5}s`;

    soapContainer.appendChild(soap);

    setTimeout(() => {
        soap.classList.add('soap-fade-out');

    setTimeout(() => {
    soap.remove();
        }, 1000); 

    }, duration * 1000); 
}

// 4TH Function (Destroy Mode)
function activateDestroyMode() {
    if (document.body.classList.contains('destroy-mode-active')) return;

    const duration = 5000;
    const targetVolume = 0.5;

    document.body.classList.add('destroy-mode-active');
    destroyButton.disabled = true;

    if (backgroundAudio) {
        backgroundAudio.volume = 0.1;
        backgroundAudio.pause();
    }

    if (destroySFX) {
        destroySFX.currentTime = 0;
        destroySFX.play().catch(error => {
            console.warn("Destroy SFX playback failed:", error);
        });
    }

    setTimeout(() => {
        document.body.classList.remove('destroy-mode-active');
        destroyButton.disabled = false;
        
        if (destroySFX) destroySFX.pause(); 
        
        if (backgroundAudio) {
            backgroundAudio.play();
            let currentVolume = 0.1;
            const step = (targetVolume - currentVolume) / 10;
            const interval = 100;

            const fadeInterval = setInterval(() => {
                if (currentVolume < targetVolume) {
                    currentVolume += step;
                    backgroundAudio.volume = Math.min(currentVolume, targetVolume);
                } else {
                    clearInterval(fadeInterval);
                    backgroundAudio.volume = targetVolume;
                }
            }, interval);
        }
        
    }, duration);
}


// --- EVENT LISTENERS AND INITIAL SETUP ---

if (revealButton) {
    revealButton.addEventListener('click', revealNextRule);
}

if (destroyButton) {
    destroyButton.addEventListener('click', activateDestroyMode);
}

// 5TH Function (Splash Screen and Audio)
window.addEventListener('DOMContentLoaded', (event) => {
    const splashScreen = document.getElementById('splash-screen');
    backgroundAudio = document.getElementById('background-audio');
    
    if (backgroundAudio) {
        backgroundAudio.volume = 0.5;
    }

    splashScreen.addEventListener('click', () => {
        splashScreen.classList.add('hidden');
        if (backgroundAudio) {
            backgroundAudio.play().catch(error => {
                console.log("Audio playback failed:", error);
            });
        }

        setTimeout(() => {
            splashScreen.remove();
            document.addEventListener('click', punchEffect);

            createFallingSoap(); 
            setInterval(createFallingSoap, 5000); 

        }, 1000);
    });
    
    const localRevealButton = document.getElementById('reveal-rule-btn'); 
    if (localRevealButton) {
        localRevealButton.textContent = "Reveal First Rule";
        localRevealButton.classList.add('blinking-text');
    }
});