import { saveMathProgress } from './firebase-config.js';

const areaA = document.getElementById('areaA');
const areaB = document.getElementById('areaB');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const inst = document.getElementById('inst');
const star = document.getElementById('star');

let countA, countB, attempts = 0;
let selectedDotA = null;
let pairsFound = 0;

export function initLevel() {
    areaA.innerHTML = ''; areaB.innerHTML = '';
    feedback.style.display = 'none'; nextBtn.style.display = 'none';
    inst.innerText = "Click a Lion, then click a Monkey to pair!";
    star.draggable = true; star.style.opacity = '1';
    
    attempts = 0; pairsFound = 0; selectedDotA = null;

    countA = Math.floor(Math.random() * 8) + 2;
    countB = Math.floor(Math.random() * 8) + 2;

    populateArea(areaA, countA, '🦁');
    populateArea(areaB, countB, '🐵');
}

function populateArea(area, count, emoji) {
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'animal-dot';
        dot.innerText = emoji;
        dot.style.left = Math.random() * 70 + 10 + '%';
        dot.style.top = Math.random() * 70 + 10 + '%';
        
        dot.addEventListener('click', () => handleDotClick(dot));
        area.appendChild(dot);
    }
}

function handleDotClick(dot) {
    if (dot.classList.contains('matched')) return;

    const isGroupA = (dot.parentNode.id === 'areaA');

    if (isGroupA) {
        document.querySelectorAll('#areaA .animal-dot').forEach(d => d.classList.remove('active-dot'));
        dot.classList.add('active-dot');
        selectedDotA = dot;
    } else if (selectedDotA) {
        dot.classList.add('matched');
        selectedDotA.classList.remove('active-dot');
        selectedDotA.classList.add('matched');
        selectedDotA = null;
        pairsFound++;
        
        if (pairsFound === Math.min(countA, countB)) {
            inst.innerText = "Great pairing! Now, which group has leftovers? Drag the star!";
        }
    }
}

// Drag/Drop logic for the Star (Final Answer)
star.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', e.target.id));

document.querySelectorAll('.card-face').forEach(card => {
    card.addEventListener('dragover', (e) => e.preventDefault());
    card.addEventListener('drop', (e) => {
        const chosen = (card.id === 'groupACard') ? 'A' : 'B';
        checkFinalAnswer(chosen);
    });
});

function checkFinalAnswer(chosen) {
    let correct = (countA > countB && chosen === 'A') || (countB > countA && chosen === 'B') || (countA === countB);
    
    feedback.style.display = 'block';
    feedback.innerHTML = correct ? "Mission Success! 🌟" : "Check the leftovers and try again!";
    if (correct) {
        feedback.classList.add('success-glow');
        nextBtn.style.display = 'inline-block';
        star.draggable = false;
    }

    saveMathProgress({
        standard: "MA.K.NSO.1.4",
        isCorrect: correct,
        pairsMatched: pairsFound,
        countA, countB, chosen
    });
}

window.initLevel = initLevel;
window.onload = initLevel;
