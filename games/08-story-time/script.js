const stories = [
  { text: 'The happy puppy loves to play in the park!', correctEmoji: '🐶', options: ['🐶', '🚀', '🍎'] },
  { text: 'The shiny rocket flies all the way to space!', correctEmoji: '🚀', options: ['🐱', '🚀', '🍌'] },
  { text: 'The yellow banana is sweet and tasty!', correctEmoji: '🍌', options: ['🍌', '🚗', '🐶'] }
];

let currentStory;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;

function startRound() {
  AudioHelper.initAudio();
  if (totalAttempts >= maxAttempts) {
    document.getElementById('results-summary').textContent = `Story time complete! You answered ${correctAnswers} questions!`;
    document.getElementById('results-modal').style.display = 'flex';
    AudioHelper.speak(`Story time complete! You got ${correctAnswers} correct!`);
    return;
  }
  
  const choicesContainer = document.getElementById('choices-grid');
  choicesContainer.innerHTML = '';
  
  currentStory = stories[Math.floor(Math.random() * stories.length)];
  
  document.getElementById('story-emoji').textContent = '📖';
  document.getElementById('story-text').textContent = currentStory.text;
  
  AudioHelper.speak(currentStory.text);
  
  currentStory.options.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('choice-card');
    card.textContent = emoji;
    card.onclick = () => checkChoice(emoji, card);
    choicesContainer.appendChild(card);
  });
  
  gsap.from('.choice-card', { scale: 0, duration: 0.4, stagger: 0.1, ease: 'back.out' });
}

function checkChoice(selectedEmoji, card) {
  totalAttempts++;
  document.getElementById('score-attempts').textContent = totalAttempts;
  
  if (selectedEmoji === currentStory.correctEmoji) {
    correctAnswers++;
    document.getElementById('score-correct').textContent = correctAnswers;
    document.getElementById('story-emoji').textContent = selectedEmoji;
    AudioHelper.speak(`Great listening! You got it right!`);
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