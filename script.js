const greetings = [
  { de: "Hallo", en: "Hello" },
  { de: "Guten Morgen", en: "Good Morning" },
  { de: "Guten Abend", en: "Good Evening" },
  { de: "Gute Nacht", en: "Good Night" },
  { de: "Tschüss", en: "Goodbye" },
  { de: "Danke", en: "Thank you" },
  { de: "Bitte", en: "Please / You're welcome" },
  { de: "Wie geht's?", en: "How are you?" },
  { de: "Willkommen", en: "Welcome" },
  { de: "Auf Wiedersehen", en: "See you again" }
];

let index = 0;

// Flashcard elements
const cardText = document.getElementById("card-text");
const flashcard = document.getElementById("flashcard");
const flashControls = document.getElementById("flash-controls");
const testBtn = document.getElementById("test-btn");

// Test elements
const testArea = document.getElementById("test-area");
const question = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const result = document.getElementById("result");

let testQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = [];

// Flashcards
function showCard() {
  cardText.textContent = `${greetings[index].de} — ${greetings[index].en}`;
}

function nextCard() {
  index = (index + 1) % greetings.length;
  showCard();
}

function prevCard() {
  index = (index - 1 + greetings.length) % greetings.length;
  showCard();
}

// Shuffle helper
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Test Mode
function startTest() {
  flashcard.classList.add("hidden");
  flashControls.classList.add("hidden");
  testBtn.classList.add("hidden");

  testArea.classList.remove("hidden");

  testQuestions = shuffleArray([...greetings]);
  currentQuestionIndex = 0;
  score = 0;
  wrongAnswers = [];

  loadQuestion();
}

function closeTest() {
  testArea.classList.add("hidden");
  flashcard.classList.remove("hidden");
  flashControls.classList.remove("hidden");
  testBtn.classList.remove("hidden");

  result.textContent = "";
  result.style.display = "block";
}

// Load Question
function loadQuestion() {
  result.textContent = "";
  result.style.display = "block";

  if (currentQuestionIndex >= testQuestions.length) {
    showFinalResult();
    return;
  }

  const current = testQuestions[currentQuestionIndex];
  question.textContent = `What does "${current.de}" mean?`;

  let options = greetings
    .map(g => g.en)
    .filter(en => en !== current.en)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  options.push(current.en);
  options = shuffleArray(options);

  optionsDiv.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt, current.en);
    optionsDiv.appendChild(btn);
  });
}

// Check Answer
function checkAnswer(selected, correct) {
  if (selected === correct) {
    result.textContent = "✅ Correct!";
    score++;
  } else {
    result.textContent = `❌ Wrong! Correct answer: ${correct}`;
    wrongAnswers.push(testQuestions[currentQuestionIndex]);
  }

  currentQuestionIndex++;
  setTimeout(loadQuestion, 900);
}

// Final Result
function showFinalResult() {
  result.textContent = "";
  result.style.display = "none";

  question.textContent = `Test Complete! Your Score: ${score} / ${testQuestions.length}`;
  optionsDiv.innerHTML = "";

  if (wrongAnswers.length > 0) {
    const p = document.createElement("p");
    p.textContent = "Review these words you missed:";
    optionsDiv.appendChild(p);

    wrongAnswers.forEach(w => {
      const item = document.createElement("p");
      item.textContent = `${w.de} — ${w.en}`;
      optionsDiv.appendChild(item);
    });
  } else {
    const p = document.createElement("p");
    p.textContent = "Perfect! You got everything right 🎉";
    optionsDiv.appendChild(p);
  }

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back to Flashcards";
  backBtn.className = "back-btn";
  backBtn.onclick = closeTest;
  optionsDiv.appendChild(backBtn);
}

// Init
showCard();
