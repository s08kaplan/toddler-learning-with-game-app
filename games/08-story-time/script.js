const stories = [
  { text: 'The happy puppy loves to play in the park!', correctEmoji: '🐶', options: ['🐶', '🚀', '🍎'] },
  { text: 'The shiny rocket flies all the way to space!', correctEmoji: '🚀', options: ['🐱', '🚀', '🍌'] },
  { text: 'The yellow banana is sweet and tasty!', correctEmoji: '🍌', options: ['🍌', '🚗', '🐶'] },
  { text: 'The fluffy kitten purrs softly in the sun.', correctEmoji: '🐱', options: ['🐱', '🐸', '⚽'] },
  { text: 'The bright red car zooms down the road!', correctEmoji: '🚗', options: ['🎈', '🚗', '🦁'] },
  { text: 'The colorful balloon floats high in the sky.', correctEmoji: '🎈', options: ['🎈', '🍕', '🐵'] },
  { text: 'The friendly frog jumps into the water!', correctEmoji: '🐸', options: ['🍦', '🐸', '🚲'] },
  { text: 'The crispy pizza is fresh out of the oven.', correctEmoji: '🍕', options: ['🍕', '🐰', '👑'] },
  { text: 'The sleepy bear takes a long nap in the cave.', correctEmoji: '🐻', options: ['🐝', '🐻', '🌈'] },
  { text: 'The little duck swims gracefully in the pond.', correctEmoji: '🦆', options: ['🦆', '🍓', '🏀'] },
  { text: 'The sweet strawberry is bright red and juicy!', correctEmoji: '🍓', options: ['🍓', '🐯', '🚁'] },
  { text: 'The speedy train chug-chugs along the tracks!', correctEmoji: '🚂', options: ['🎨', '🚂', '🍪'] },
  { text: 'The cute rabbit loves to munch on crunchy carrots.', correctEmoji: '🐰', options: ['🐰', '⚽', '⛵'] },
  { text: 'The cold ice cream cone melts on a hot day.', correctEmoji: '🍦', options: ['🍦', '🐼', '🔔'] },
  { text: 'The brave lion roars loudly in the jungle!', correctEmoji: '🦁', options: ['🦁', '🥐', '🚗'] },
  { text: 'The busy bee gathers sweet honey from flowers.', correctEmoji: '🐝', options: ['🐝', '🎈', '🐠'] },
  { text: 'The big orange basketball bounces up and down!', correctEmoji: '🏀', options: ['🏀', '🐸', '🍎'] },
  { text: 'The magical crown sits on top of the king\'s head.', correctEmoji: '👑', options: ['👑', '🍌', '🐶'] },
  { text: 'The playful monkey swings high on the tree branches.', correctEmoji: '🐵', options: ['🐱', '🐵', '🚀'] },
  { text: 'The tiny fish bubbles along deep under the sea.', correctEmoji: '🐠', options: ['🐠', '🍕', '🐻'] },
  { text: 'The fast bicycle pedals through the leafy park.', correctEmoji: '🚲', options: ['🚲', '🦆', '🍓'] },
  { text: 'The tasty chocolate cookie goes great with milk!', correctEmoji: '🍪', options: ['🍪', '🦁', '🍦'] },
  { text: 'The pretty rainbow appears right after the rain.', correctEmoji: '🌈', options: ['🌈', '🐰', '🚂'] },
  { text: 'The flying helicopter spins its big blades above!', correctEmoji: '🚁', options: ['🚁', '🏀', '🐝'] },
  { text: 'The gentle panda sits quietly and eats green bamboo.', correctEmoji: '🐼', options: ['🐼', '👑', '🚗'] },
  { text: 'The sailboat glides smoothly across the blue lake.', correctEmoji: '⛵', options: ['⛵', '🐵', '🍕'] },
  { text: 'The shiny gold bell rings ding-dong softly.', correctEmoji: '🔔', options: ['🔔', '🐠', '🐻'] },
  { text: 'The artist uses a brush to paint a lovely picture.', correctEmoji: '🎨', options: ['🎨', '🎈', '🦆'] },
  { text: 'The warm bakery croissant smells so delicious!', correctEmoji: '🥐', options: ['🥐', '🐶', '🍓'] },
  { text: 'The striped tiger walks silently through the forest.', correctEmoji: '🐯', options: ['🐯', '🍦', '🚲'] }
];

let currentStory;
let correctAnswers = 0;
let totalAttempts = 0;
const maxAttempts = 5;
let isGameStarted = false;

// Call this from a user click gesture (e.g., "Start Game" button)
function initAndStartGame() {
  AudioHelper.initAudio();
  document.getElementById('start-overlay').style.display = 'none';
  isGameStarted = true;
  startRound();
}

function startRound() {
  if (!isGameStarted) return;

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
  
  // Audio trigger
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

function repeatStory() {
  if (currentStory && currentStory.text) {
    AudioHelper.speak(currentStory.text);
  }
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