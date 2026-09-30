const numbersData = Array.from({ length: 20 }, (_, i) => ({
  number: i + 1,
  word: [
    'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
  ][i]
}));

let targetNumberObj = null;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;
let gameStarted = false;
let isProcessingClick = false;

function safeAudioCall(methodName, ...args) {
  if (typeof AudioHelper !== 'undefined' && typeof AudioHelper[methodName] === 'function') {
    AudioHelper[methodName](...args);
  }
}

function repeatInstruction() {
  safeAudioCall('initAudio');
  if (targetNumberObj) {
    safeAudioCall('speak', `Find number ${targetNumberObj.word}!`);
  }
}

function generateRound() {
  isProcessingClick = false; 

  if (totalAttempts >= maxAttempts) {
    const summary = document.getElementById('results-summary');
    if (summary) {
      summary.textContent = `Game complete! You found ${correctAnswers} correct numbers out of ${maxAttempts}!`;
    }
    
    const resultsModal = document.getElementById('results-modal');
    if (resultsModal) {
      resultsModal.style.display = 'flex';
    }
    
    safeAudioCall('playTaDa');
    safeAudioCall('speak', `Great job! You found ${correctAnswers} numbers!`);
    return;
  }
  
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';
  

  targetNumberObj = numbersData[Math.floor(Math.random() * numbersData.length)];
  
  const promptEl = document.getElementById('target-prompt');
  if (promptEl) {
    promptEl.textContent = `Find Number ${targetNumberObj.word}!`;
  }
  
  if (AudioHelper && AudioHelper.isInitialized && gameStarted) {
    repeatInstruction();
  }
  
  let options = [targetNumberObj.number];
  while (options.length < 4) {
    let rand = Math.floor(Math.random() * 20) + 1;
    if (!options.includes(rand)) options.push(rand);
  }
  options.sort(() => Math.random() - 0.5);

  options.forEach(num => {
    const card = document.createElement('div');
    card.classList.add('num-card');
    card.textContent = num;
    card.onclick = () => checkSelection(num, card);
    grid.appendChild(card);
  });
  
  if (typeof gsap !== 'undefined') {
    gsap.from('.num-card', { scale: 0, stagger: 0.1, duration: 0.4, ease: 'back.out' });
  }
}

function checkSelection(num, card) {
  if (isProcessingClick) return;
  isProcessingClick = true;

  safeAudioCall('initAudio');
  totalAttempts++;
  
  const attemptsEl = document.getElementById('score-attempts');
  if (attemptsEl) attemptsEl.textContent = totalAttempts;
  
  if (num === targetNumberObj.number) {
    correctAnswers++;
    const correctEl = document.getElementById('score-correct');
    if (correctEl) correctEl.textContent = correctAnswers;
    
    safeAudioCall('playSuccess');
    safeAudioCall('speak', `Great job! That is ${num}!`);
    
    if (typeof gsap !== 'undefined') {
      gsap.to(card, {
        scale: 1.2,
        backgroundColor: '#6bc36f',
        duration: 0.5,
        onComplete: generateRound
      });
    } else {
      setTimeout(generateRound, 500);
    }
  } else {
    safeAudioCall('playError');
    safeAudioCall('speak', `That is ${num}! Try again!`);
    
    if (typeof gsap !== 'undefined') {
      gsap.to(card, {
        x: 10,
        backgroundColor: '#ff6b6b',
        repeat: 3,
        yoyo: true,
        duration: 0.08,
        onComplete: () => {
          setTimeout(generateRound, 400);
        }
      });
    } else {
      setTimeout(generateRound, 500);
    }
  }
}

function toggleMenu() {
  safeAudioCall('initAudio');
  const modal = document.getElementById('menu-modal');
  if (modal) {
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  }
}

function toggleMute() {
  if (typeof AudioHelper !== 'undefined' && typeof AudioHelper.toggleMute === 'function') {
    const isMuted = AudioHelper.toggleMute();
    const btn = document.getElementById('mute-btn');
    if (btn) btn.textContent = isMuted ? '🔇 Muted' : '🔊 Audio';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof AudioHelper !== 'undefined' && typeof AudioHelper.setupAutoUnlock === 'function') {
    AudioHelper.setupAutoUnlock(() => {
      if (targetNumberObj && !gameStarted) {
        gameStarted = true;
        repeatInstruction();
      }
    });
  }
  
  generateRound();
});