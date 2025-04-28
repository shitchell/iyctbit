const numCoreQuestions = 1;
const exitMidRabbitHole = false;

let era;
let crafting;
let state = {
  score: 0,
  rhDepth: 0,
  coreAnswered: 0,
  currentTarget: null,
  unsolvedComponents: [],
};

async function loadJSONs() {
  era = await fetch('js/data/eras/1500AD.json').then(res => res.json());
  crafting = await fetch('js/data/crafting.json').then(res => res.json());
  startGame();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function calculatePlausibilityFloor(rhDepth) {
  if (rhDepth === 0) return 0.2;
  return Math.min(0.5 + (rhDepth * 0.05), 0.9);
}

function showQuestion(questionObj, choices) {
  const questionDiv = document.getElementById('question');
  const choicesDiv = document.getElementById('choices');
  questionDiv.textContent = questionObj.text;
  choicesDiv.innerHTML = '';

  choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice.text;
    button.className = 'choice';
    button.onclick = () => choice.handler();
    choicesDiv.appendChild(button);
  });
}

function startGame() {
  const questionKeys = Object.keys(era.questions);
  const randomKey = questionKeys[Math.floor(Math.random() * questionKeys.length)];
  const questionObj = era.questions[randomKey];
  const choices = questionObj.choices.map(choice => ({
    text: choice.text,
    plausibility: choice.plausibility,
    handler: () => handleCoreChoice(choice)
  }));

  shuffle(choices);
  showQuestion(questionObj, choices);
}

function handleCoreChoice(choice) {
  if (!choice.correct) {
    endGame("Wrong answer. You fail to revolutionize the world.");
    return;
  }
  state.score += 1;
  state.coreAnswered += 1;
  state.unsolvedComponents = [...choice.crafting_targets];
  nextCraftingStep();
}

function nextCraftingStep() {
  if (state.unsolvedComponents.length === 0) {
    endGame("You built the technology successfully!");
    return;
  }
  if (state.coreAnswered >= numCoreQuestions && exitMidRabbitHole) {
    endGame("You've answered enough questions to change history!");
    return;
  }

  const target = state.unsolvedComponents.shift();
  state.currentTarget = target;

  const craftingOptions = [];

  if (!crafting[target]) {
    endGame("Unknown tech: " + target);
    return;
  }

  const plausibilityFloor = calculatePlausibilityFloor(state.rhDepth);

  crafting[target].components.forEach(c => {
    craftingOptions.push({
      text: c.join(" + "),
      correct: true,
      handler: () => handleCraftingChoice(true)
    });
  });

  crafting[target].herrings.forEach(h => {
    if (h.plausibility >= plausibilityFloor) {
      craftingOptions.push({
        text: h.components.join(" + "),
        correct: false,
        handler: () => handleCraftingChoice(false)
      });
    }
  });

  shuffle(craftingOptions);

  showQuestion({text: `How would you build: ${target}?`}, craftingOptions);
}

function handleCraftingChoice(correct) {
  if (!correct) {
    endGame("Your approach failed. You were burned as a witch.");
    return;
  }
  state.rhDepth++;
  state.score += 2 * state.rhDepth;
  nextCraftingStep();
}

function endGame(message) {
  const questionDiv = document.getElementById('question');
  const choicesDiv = document.getElementById('choices');
  const scoreDiv = document.getElementById('score');
  questionDiv.textContent = message;
  choicesDiv.innerHTML = '';
  scoreDiv.textContent = `Final Score: ${state.score}`;
}

loadJSONs();
