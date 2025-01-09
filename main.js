const wordDisplay = document.querySelector(".word-display");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const guessesText = document.querySelector(".guesses-text b");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const timerDisplay = document.querySelector(".timer");
const images = [
  `https://media.geeksforgeeks.org/wp-content/uploads/20240215173028/0.png`,
  `https://media.geeksforgeeks.org/wp-content/uploads/20240215173033/1.png`,
  `https://media.geeksforgeeks.org/wp-content/uploads/20240215173038/2.png`,
  `https://media.geeksforgeeks.org/wp-content/uploads/20240215172733/3.png`,
  `https://media.geeksforgeeks.org/wp-content/uploads/20240215173815/4.png`,
  `https://media.geeksforgeeks.org/wp-content/uploads/20240215173859/5.png`,
  `https://media.geeksforgeeks.org/wp-content/uploads/20240215173931/6.png`,
];

// Pirate-themed words and hints
const pirateQuiz = [
  { word: "treasure", hint: "A pirate's ultimate prize." },
  { word: "parrot", hint: "A pirate's talkative companion." },
  { word: "buccaneer", hint: "Another word for a pirate." },
  { word: "compass", hint: "Essential for finding one's way at sea." },
  { word: "jollyroger", hint: "A flag featuring skull and crossbones." },
  { word: "mutiny", hint: "Rebellion among the crew." },
  { word: "cutlass", hint: "A short sword favored by pirates." },
  { word: "shipwreck", hint: "The remains of a sunken ship." },
  { word: "captain", hint: "The leader of the pirate crew." },
  { word: "plunder", hint: "Goods stolen by pirates." },
  { word: "debug", hint: "Finding and fixing errors in code." },
  { word: "variable", hint: "A placeholder for a value in programming." },
  { word: "function", hint: "A block of reusable code in programming." },
  { word: "algorithm", hint: "A step-by-step solution to a problem." },
  { word: "syntax", hint: "The set of rules that defines a programming language." },
  { word: "array", hint: "A collection of elements, often of the same type." },
  { word: "loop", hint: "Used to repeat a block of code multiple times." },
  { word: "opensource", hint: "Software with publicly available source code." },
  { word: "github", hint: "A platform for hosting and collaborating on code." },
  { word: "javascript", hint: "A popular programming language for the web." },
  { word: "hackclub", hint: "A global nonprofit network of high school coding clubs." },
  { word: "zachlatta", hint: "The founder of Hack Club." },
  { word: "slack", hint: "The platform Hack Club uses for communication." },
  { word: "flagship", hint: "Hack Club's summer program for student leaders." },
  { word: "workshops", hint: "Hack Club's guides for learning and creating projects." },
  { word: "grant", hint: "Funding provided by Hack Club to support student projects." },
  { word: "hackathons", hint: "Events where students collaborate to build projects in a short time." },
  { word: "community", hint: "Hack Club's core value: a space for creativity and collaboration." },
  { word: "hardware", hint: "Hack Club frequently provides this for hands-on projects." },
  { word: "hackasaurus", hint: "A playful term often used in the Hack Club community." },
];

let currentWord, correctLetters, incorrectGuesses, timerInterval;
const maxAttempts = 6;
const timeLimit = 30; // Time in seconds

// Reset game state and UI
const resetGame = () => {
  correctLetters = [];
  incorrectGuesses = 0;
  hangmanImage.src = images[0];
  guessesText.innerText = `${incorrectGuesses} / ${maxAttempts}`;
  keyboardDiv.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
  clearInterval(timerInterval);
  startTimer();
  gameModal.classList.remove("show");
};

// Pick a random word and hint
const pickRandomWord = () => {
  const randomEntry = pirateQuiz[Math.floor(Math.random() * pirateQuiz.length)];
  currentWord = randomEntry.word;
  document.querySelector(".hint-text b").innerText = randomEntry.hint;
  resetGame();
};

// Start the countdown timer
const startTimer = () => {
  let timeLeft = timeLimit;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time left: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""
      }${timeLeft % 60}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
};

// End the game with victory or defeat
const endGame = (isVictory) => {
  setTimeout(() => {
    clearInterval(timerInterval);
    const message = isVictory
      ? `Ahoy, Matey! Ye found the word:`
      : `The ship sank! The word was:`;
    gameModal.querySelector("p").innerHTML = `${message} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
  }, 300);
};

// Handle a letter being guessed
const handleGuess = (button, guessedLetter) => {
  if (currentWord.includes(guessedLetter)) {
    [...currentWord].forEach((letter, index) => {
      if (letter === guessedLetter) {
        correctLetters.push(letter);
        const targetLetter = wordDisplay.querySelectorAll("li")[index];
        targetLetter.innerText = letter;
        targetLetter.classList.add("guessed");
      }
    });
  } else {
    incorrectGuesses++;
    hangmanImage.src = images[incorrectGuesses];
  }

  if (button) button.disabled = true;
  guessesText.innerText = `${incorrectGuesses} / ${maxAttempts}`;

  if (incorrectGuesses === maxAttempts) return endGame(false);
  if (correctLetters.length === currentWord.length) return endGame(true);
};

// Handle physical keyboard input
const handleKeyboardInput = (event) => {
  const letter = event.key.toLowerCase();
  if (/^[a-z]$/.test(letter)) {
    const button = [...keyboardDiv.querySelectorAll("button")].find(
      (btn) => btn.innerText === letter
    );
    if (button && !button.disabled) {
      handleGuess(button, letter);
    }
  }
};

// Create the keyboard dynamically
const createKeyboard = () => {
  for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i);
    button.innerText = letter;
    keyboardDiv.appendChild(button);
    button.addEventListener("click", () => handleGuess(button, letter));
  }
};

// Initialize game
createKeyboard();
pickRandomWord();
playAgainBtn.addEventListener("click", pickRandomWord);
document.addEventListener("keydown", handleKeyboardInput);
