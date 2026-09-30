const words = [
  { word: 'CAT', missing: 'A', display: 'C _ T', emoji: '🐱' },
  { word: 'DOG', missing: 'O', display: 'D _ G', emoji: '🐶' },
  { word: 'SUN', missing: 'U', display: 'S _ N', emoji: '☀️' },
  { word: 'BUS', missing: 'U', display: 'B _ S', emoji: '🚌' },
  { word: 'ARM', missing: 'A', display: '_ R M', emoji: '🦾' },
  { word: 'EYE', missing: 'E', display: 'E Y _', emoji: '👁️' },
  { word: 'NOSE', missing: 'S', display: 'N O _ E', emoji: '👃' },
  { word: 'DOOR', missing: 'D', display: '_ O O R', emoji: '🚪' },
  { word: 'WINDOW', missing: 'N', display: 'W I _ D O W', emoji: '🪟' },
  { word: 'FISH', missing: 'I', display: 'F _ S H', emoji: '🐟' },
  { word: 'BIRD', missing: 'R', display: 'B I _ D', emoji: '🐦' },
  { word: 'FROG', missing: 'O', display: 'F R _ G', emoji: '🐸' },
  { word: 'DUCK', missing: 'U', display: 'D _ C K', emoji: '🦆' },
  { word: 'LION', missing: 'I', display: 'L _ O N', emoji: '🦁' },
  { word: 'BEAR', missing: 'A', display: 'B E _ R', emoji: '🐻' },
  { word: 'STAR', missing: 'T', display: 'S _ A R', emoji: '⭐' },
  { word: 'MOON', missing: 'O', display: 'M _ O N', emoji: '🌙' },
  { word: 'TREE', missing: 'E', display: 'T R _ E', emoji: '🌳' },
  { word: 'BOOK', missing: 'O', display: 'B _ O K', emoji: '📖' },
  { word: 'BALL', missing: 'A', display: 'B _ L L', emoji: '⚽' }
];

let currentWordItem;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function startRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Word Builder finished! You spelled ${correctAnswers} words!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Session complete! You built ${correctAnswers} words!`);
    return;
  }
  
  const grid = document.getElementById('letters-grid');
  grid.innerHTML = '';
  
  currentWordItem = words[Math.floor(Math.random() * words.length)];
  
  document.getElementById('target-emoji').textContent = currentWordItem.emoji;
  document.getElementById('word-target').textContent = currentWordItem.display;
  
  AudioHelper.speak(`Find the letter to complete ${currentWordItem.word}!`);
  
  let choices = [currentWordItem.missing, 'E', 'I', 'O', 'A'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
  choices.sort(() => Math.random() - 0.5);
  
  choices.forEach(letter => {
    const btn = document.createElement('button');
    btn.classList.add('letter-btn');
    btn.textContent = letter;
    btn.onclick = () => checkChoice(letter, btn);
    grid.appendChild(btn);
  });
  
  gsap.from('.letter-btn', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
}

function checkChoice(letter, btn) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (letter === currentWordItem.missing) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    document.getElementById('word-target').textContent = currentWordItem.word;
    AudioHelper.speak(`Correct! ${currentWordItem.word}!`);
    gsap.to(btn, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, onComplete: startRound });
  } else {
    AudioHelper.speak(`Try another letter!`);
    gsap.to(btn, { x: 10, repeat: 3, yoyo: true, duration: 0.05, onComplete: startRound });
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