const patterns = [
  { sequence: ['🔴', '🟡', '🔴', '?'], answer: '🟡', options: ['🟡', '🟢', '🔴'] },
  { sequence: ['⭐', '🎈', '⭐', '?'], answer: '🎈', options: ['⭐', '🎈', '🍎'] },
  { sequence: ['🍎', '🍏', '🍎', '?'], answer: '🍏', options: ['🍏', '🍎', '🍌'] }
];

let currentPattern;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function startRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Pattern Pop finished! You completed ${correctAnswers} patterns!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Pattern Pop complete! You got ${correctAnswers} correct!`);
    return;
  }
  
  const seqContainer = document.getElementById('sequence');
  const optContainer = document.getElementById('options');
  seqContainer.innerHTML = '';
  optContainer.innerHTML = '';
  
  currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  currentPattern.sequence.forEach(symbol => {
    const span = document.createElement('span');
    span.textContent = symbol;
    seqContainer.appendChild(span);
  });
  
  AudioHelper.speak(`What comes next in the pattern?`);
  
  currentPattern.options.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('option-card');
    card.textContent = symbol;
    card.onclick = () => checkChoice(symbol, card);
    optContainer.appendChild(card);
  });
  
  gsap.from('.option-card', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
}

function checkChoice(selected, card) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (selected === currentPattern.answer) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    AudioHelper.speak(`That's right! ${selected} comes next!`);
    gsap.to(card, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, onComplete: startRound });
  } else {
    AudioHelper.speak(`Try again!`);
    gsap.to(card, { x: 10, repeat: 3, yoyo: true, duration: 0.05, onComplete: startRound });
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

document.addEventListener('DOMContentLoaded', startRound);