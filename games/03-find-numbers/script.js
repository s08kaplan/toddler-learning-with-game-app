let targetNumber = 1;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function generateRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Game complete! You found ${correctAnswers} correct numbers out of 5!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Game over! You found ${correctAnswers} numbers!`);
    return;
  }
  
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  
  targetNumber = Math.floor(Math.random() * 20) + 1;
  document.getElementById('target-prompt').textContent = `Find Number ${targetNumber}!`;
  AudioHelper.speak(`Find number ${targetNumber}`);
  
  let options = [targetNumber];
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
  
  gsap.from('.num-card', { scale: 0, stagger: 0.1, duration: 0.4, ease: 'back.out' });
}

function checkSelection(num, card) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (num === targetNumber) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    AudioHelper.speak(`Great job! That is ${num}!`);
    gsap.to(card, { scale: 1.2, backgroundColor: '#6bc36f', duration: 0.3, onComplete: generateRound });
  } else {
    AudioHelper.speak(`Try again!`);
    gsap.to(card, { x: 10, repeat: 3, yoyo: true, duration: 0.05, onComplete: generateRound });
  }
}

function toggleMenu() {
  const modal = document.getElementById('menu-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function toggleMute() {
  const isMuted = AudioHelper.toggleMute();
  document.getElementById('mute-btn').textContent = isMuted ? '🔇 Muted' : '🔊 Audio';
}

document.addEventListener('DOMContentLoaded', generateRound);