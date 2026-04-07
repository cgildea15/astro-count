// ThresholdEd - Game Logic for MA.K.NSO.1.4
const areaA = document.getElementById('areaA');
const areaB = document.getElementById('areaB');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const inst = document.getElementById('inst');
const star = document.getElementById('star');
const cardA = document.getElementById('groupACard');
const cardB = document.getElementById('groupBCard');

const zooAnimals = ['🦁', '🐯', '🐘', '🦛', '🐒'];
let countA = 0; 
let countB = 0;
let attempts = 0;

export function initLevel() {
    // Reset State
    attempts = 0;
    areaA.innerHTML = ''; 
    areaB.innerHTML = '';
    feedback.style.display = 'none'; 
    nextBtn.style.display = 'none';
    inst.innerText = "Which group is GREATER?";
    star.style.opacity = '1'; 
    star.draggable = true;

    // Standard NSO.1.4: 0-20 range
    countA = Math.floor(Math.random() * 10) + 1;
    countB = Math.floor(Math.random() * 10) + 1;

    // AAA Accessibility: Set ARIA labels for Screen Readers
    areaA.setAttribute('aria-label', `Group A has ${countA} animals`);
    areaB.setAttribute('aria-label', `Group B has ${countB} animals`);

    populateArea(areaA, countA, '🦁');
    populateArea(areaB, countB, '🐵');
}

function populateArea(area, count, animalEmoji) {
    for (let i = 0; i < count; i++) {
        const animal = document.createElement('div');
        animal.className = 'animal-dot';
        animal.innerText = animalEmoji;
        // Logic to prevent animals from overlapping too much
        animal.style.left = Math.random() * 70 + 10 + '%';
        animal.style.top = Math.random() * 70 + 10 + '%';
        area.appendChild(animal);
    }
}

export function checkAnswer(chosen) {
    attempts++;
    let correct = false;
    
    if (countA > countB && chosen === 'A') correct = true;
    else if (countB > countA && chosen === 'B') correct = true;
    else if (countA === countB) correct = true;

    // Behavioral Support: Soften the feedback
    feedback.innerHTML = correct ? "Great Job! 🌟" : "Try again! You're almost there!";
    feedback.className = correct ? "feedback-area success-glow" : "feedback-area";
    feedback.style.display = 'block';
    
    if (correct) {
        nextBtn.style.display = 'inline-block';
        star.draggable = false;
        star.style.opacity = '0.5';
    }

    // Call Firebase Sync
    if (window.saveMathProgress) {
        window.saveMathProgress(correct, countA, countB, chosen, attempts);
    }
}
