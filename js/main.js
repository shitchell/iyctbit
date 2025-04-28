// Game configuration
const config = {
  numCoreQuestions: 1,
  exitMidRabbitHole: false
};

// IIFE to wrap the game class and prevent global access
(function() {
  // Game class to encapsulate all game functionality
  class IYCTBITGame {
    constructor() {
      this.era = null;
      this.crafting = null;
      this.state = {
        score: 0,
        rhDepth: 0,
        coreAnswered: 0,
        currentTarget: null,
        unsolvedComponents: [],
      };
      
      // Initialize the game
      this.loadJSONs();
    }
    
    async loadJSONs() {
      try {
        this.era = await fetch('js/data/eras/1500AD.json').then(res => res.json());
        this.crafting = await fetch('js/data/crafting.json').then(res => res.json());
        this.startGame();
      } catch (error) {
        console.error('Error loading game data:', error);
        document.getElementById('question').textContent = 'Error loading game data. Please try again.';
      }
    }
    
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    
    calculatePlausibilityFloor(rhDepth) {
      if (rhDepth === 0) return 0.2;
      return Math.min(0.5 + (rhDepth * 0.05), 0.9);
    }
    
    showQuestion(questionObj, choices) {
      const questionDiv = document.getElementById('question');
      const choicesDiv = document.getElementById('choices');
      
      // Clear previous content
      questionDiv.textContent = questionObj.text;
      choicesDiv.innerHTML = '';
      
      // Add info button if info exists
      if (questionObj.info || questionObj.links) {
        const infoButton = document.createElement('button');
        infoButton.textContent = 'ℹ️';
        infoButton.className = 'info-button';
        infoButton.onclick = () => this.showInfo(questionObj);
        questionDiv.appendChild(infoButton);
      }
      
      // Add choices
      choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.className = 'choice';
        button.onclick = () => choice.handler();
        choicesDiv.appendChild(button);
      });
    }
    
    showInfo(questionObj) {
      const infoModal = document.createElement('div');
      infoModal.className = 'info-modal';
      
      const infoContent = document.createElement('div');
      infoContent.className = 'info-content';
      
      // Add info text if available
      if (questionObj.info) {
        const infoText = document.createElement('p');
        infoText.textContent = questionObj.info;
        infoContent.appendChild(infoText);
      }
      
      // Add links if available
      if (questionObj.links && questionObj.links.length > 0) {
        const linksList = document.createElement('ul');
        questionObj.links.forEach(link => {
          const listItem = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.href = link.url;
          anchor.textContent = link.text;
          anchor.target = '_blank';
          listItem.appendChild(anchor);
          linksList.appendChild(listItem);
        });
        infoContent.appendChild(linksList);
      }
      
      // Close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.onclick = () => document.body.removeChild(infoModal);
      infoContent.appendChild(closeButton);
      
      infoModal.appendChild(infoContent);
      document.body.appendChild(infoModal);
    }
    
    startGame() {
      const questionKeys = Object.keys(this.era.questions);
      const randomKey = questionKeys[Math.floor(Math.random() * questionKeys.length)];
      const questionObj = this.era.questions[randomKey];
      const choices = questionObj.choices.map(choice => ({
        text: choice.text,
        plausibility: choice.plausibility,
        handler: () => this.handleCoreChoice(choice)
      }));
      
      this.shuffle(choices);
      this.showQuestion(questionObj, choices);
    }
    
    handleCoreChoice(choice) {
      if (!choice.correct) {
        // If there's no explicit feedback, generate one based on plausibility
        let feedback;
        if (choice.feedback) {
          feedback = choice.feedback;
        } else {
          // Create a generic name for the attempted solution
          const solutionName = choice.text || "your approach";
          feedback = this.getRandomFailureMessage(solutionName, choice.plausibility || 0.5);
        }
        
        this.endGame(feedback);
        return;
      }
      
      // Show feedback message if available
      if (choice.feedback) {
        this.showFeedback(choice.feedback, () => {
          this.state.score += 1;
          this.state.coreAnswered += 1;
          this.state.unsolvedComponents = [...choice.crafting_targets];
          this.nextCraftingStep();
        });
      } else {
        this.state.score += 1;
        this.state.coreAnswered += 1;
        this.state.unsolvedComponents = [...choice.crafting_targets];
        this.nextCraftingStep();
      }
    }
    
    // Show a temporary feedback message with a continue button
    showFeedback(message, callback) {
      const questionDiv = document.getElementById('question');
      const choicesDiv = document.getElementById('choices');
      
      // Store original content
      const originalQuestionText = questionDiv.textContent;
      const originalChoicesHTML = choicesDiv.innerHTML;
      
      // Show feedback
      questionDiv.textContent = message;
      choicesDiv.innerHTML = '';
      
      // Add continue button
      const continueButton = document.createElement('button');
      continueButton.textContent = 'Continue';
      continueButton.className = 'choice continue-button';
      continueButton.onclick = () => {
        // Restore callbacks
        callback();
      };
      choicesDiv.appendChild(continueButton);
    }
    
    nextCraftingStep() {
      if (this.state.unsolvedComponents.length === 0) {
        // Customize success message based on rabbit hole depth
        let successMessage;
        if (this.state.rhDepth <= 2) {
          successMessage = "You built the technology successfully! You've made a small dent in history.";
        } else if (this.state.rhDepth <= 5) {
          successMessage = "You've successfully created this technology! The Renaissance will never be the same.";
        } else {
          successMessage = "Amazing! You've mastered this technology and revolutionized history! The timeline has been forever changed by your knowledge.";
        }
        this.endGame(successMessage);
        return;
      }
      if (this.state.coreAnswered >= config.numCoreQuestions && config.exitMidRabbitHole) {
        this.endGame("You've answered enough questions to change history! Your futuristic knowledge has left its mark on this era.");
        return;
      }
      
      const targetId = this.state.unsolvedComponents.shift();
      this.state.currentTarget = targetId;
      
      const craftingOptions = [];
      
      if (!this.crafting[targetId]) {
        this.endGame("Unknown tech: " + targetId);
        return;
      }
      
      const targetName = this.crafting[targetId].name || targetId;
      
      // Create a question object with tech info and links if available
      const questionObj = {
        text: `How would you build a ${targetName}?`,
        info: this.crafting[targetId].info,
        links: this.crafting[targetId].links
      };
      
      const plausibilityFloor = this.calculatePlausibilityFloor(this.state.rhDepth);
      
      this.crafting[targetId].components.forEach(components => {
        // Convert component IDs to names when possible
        const componentNames = components.map(compId => 
          this.crafting[compId] ? this.crafting[compId].name : this.formatComponentName(compId)
        );
        
        craftingOptions.push({
          text: componentNames.join(" + "),
          correct: true,
          handler: () => this.handleCraftingChoice(true, null)
        });
      });
      
      this.crafting[targetId].herrings.forEach(h => {
        if (h.plausibility >= plausibilityFloor) {
          // Convert component IDs to names when possible
          const componentNames = h.components.map(compId => 
            this.crafting[compId] ? this.crafting[compId].name : this.formatComponentName(compId)
          );
          
          // Generate a funny failure message based on plausibility
          const failureMessage = this.getRandomFailureMessage(
            componentNames.join(" + "), 
            h.plausibility
          );
          
          craftingOptions.push({
            text: componentNames.join(" + "),
            correct: false,
            handler: () => this.handleCraftingChoice(false, failureMessage)
          });
        }
      });
      
      this.shuffle(craftingOptions);
      this.showQuestion(questionObj, craftingOptions);
    }
    
    // Helper method to format component names that don't have crafting definitions
    formatComponentName(componentId) {
      // Convert snake_case to Title Case
      return componentId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    handleCraftingChoice(correct, feedback) {
      if (!correct) {
        const message = feedback || "Your approach failed. You were burned as a witch.";
        this.endGame(message);
        return;
      }
      
      // Generate positive feedback message based on the current item being crafted
      const craftingItem = this.crafting[this.state.currentTarget];
      const successMessage = feedback || 
        `Success! You've successfully created a ${craftingItem.name}.${this.getRandomSuccessQuip()}`;
      
      this.showFeedback(successMessage, () => {
        this.state.rhDepth++;
        this.state.score += 2 * this.state.rhDepth;
        this.nextCraftingStep();
      });
    }
    
    // Returns a random success quip based on the depth of the rabbit hole
    getRandomSuccessQuip() {
      // Higher depth = more impressive = more extreme reactions
      const rhDepth = this.state.rhDepth;
      
      // Define messages with depth ranges
      const quipsByDepth = [
        // Initial success (0-1 depth)
        { 
          range: [0, 2], 
          quips: [
            " The locals are intrigued by your creation.",
            " Your knowledge seems to be working.",
            " This time travel adventure is off to a good start.",
            " A small step for you, a potential leap for Renaissance technology.",
            " Not bad for your first attempt in this era."
          ]
        },
        // Medium success (2-4 depth)
        {
          range: [2, 5],
          quips: [
            " The locals are impressed by your knowledge!",
            " Your future insights are proving valuable.",
            " This time machine vacation is going well.",
            " You're making progress in changing history.",
            " Renaissance minds are definitely curious!",
            " Local craftsmen want to learn from you."
          ]
        },
        // Deep success (5+ depth)
        {
          range: [5, Infinity],
          quips: [
            " The locals are utterly amazed by your ingenuity!",
            " Your future knowledge is revolutionizing this era!",
            " You're drastically altering the timeline now!",
            " Renaissance minds are completely blown!",
            " Da Vinci would be extremely jealous.",
            " You're changing the course of history dramatically!",
            " The Church is suspicious but too impressed to burn you as a witch... yet.",
            " Your technology is causing a scientific revolution centuries early!",
            " Who needs computers when you've bootstrapped electricity in 1500?",
            " You're truly reshaping this world with your future knowledge!"
          ]
        }
      ];
      
      // Find the appropriate quip set for current depth
      const quipSet = quipsByDepth.find(set => 
        rhDepth >= set.range[0] && rhDepth < set.range[1]
      ) || quipsByDepth[0]; // Default to initial if nothing matches
      
      return " " + quipSet.quips[Math.floor(Math.random() * quipSet.quips.length)];
    }
    
    // Returns a funny failure message based on the components used and plausibility
    getRandomFailureMessage(components, plausibility = 0.5) {
      // Define messages with plausibility ranges
      const messages = [
        // High plausibility (close to working)
        { 
          plausibility: [0.8, 1.0], 
          texts: [
            `Your ${components} approach was almost right! Just a small miscalculation led to failure.`,
            `So close! ${components} might have worked with a slight adjustment.`,
            `The local artisans are impressed by your ${components} attempt, but it just doesn't quite work.`,
            `Your theory with ${components} is sound, but there's a missing element the locals can't provide.`
          ]
        },
        // Medium-high plausibility
        {
          plausibility: [0.6, 0.8],
          texts: [
            `Your ${components} experiment produces interesting results, but not what you intended.`,
            `The ${components} design looks promising at first, but fails during testing.`,
            `Local scholars examine your ${components} contraption with interest, but it ultimately fails.`,
            `Your ${components} creation almost works! But "almost" doesn't change history.`
          ]
        },
        // Medium plausibility
        {
          plausibility: [0.4, 0.6],
          texts: [
            `Using ${components} that way makes smoke, but no electricity. The townsfolk are confused.`,
            `Your ${components} experiment fails. Maybe brush up on your basic physics next time?`,
            `That combination of ${components} just creates a mess. The locals are unimpressed.`,
            `Your ${components} device breaks apart. Back to the drawing board!`
          ]
        },
        // Low-medium plausibility
        {
          plausibility: [0.2, 0.4],
          texts: [
            `${components}? The local guild masters examine your contraption and declare you a fraud.`,
            `Your attempt to use ${components} resulted in a small explosion. The local authorities are suspicious.`,
            `The ${components} experiment fails spectacularly. The Church has questions about your "foreign knowledge."`,
            `The king's scientists review your work with ${components} and sentence you to the dungeon for wasting royal resources.`
          ]
        },
        // Low plausibility (ridiculous attempts)
        {
          plausibility: [0.0, 0.2],
          texts: [
            `${components}? Really? The townsfolk can't stop laughing at your absurd ideas.`,
            `Your ${components} creation is declared "an affront to God's natural order." That's definitely heresy.`,
            `Did you seriously think ${components} would work? Maybe you should have paid more attention in science class before time traveling.`,
            `Combining ${components} like that gets you branded as a witch. Should have studied history more carefully.`,
            `The local children make fun of your ${components} attempt. Even they know that's not how things work.`
          ]
        }
      ];
      
      // Find all message categories that match the plausibility
      const matchingCategories = messages.filter(category => 
        plausibility >= category.plausibility[0] && plausibility < category.plausibility[1]
      );
      
      // If no matching categories, use medium plausibility as fallback
      if (matchingCategories.length === 0) {
        const mediumCategory = messages.find(category => 
          category.plausibility[0] === 0.4 && category.plausibility[1] === 0.6
        );
        const randomIndex = Math.floor(Math.random() * mediumCategory.texts.length);
        return mediumCategory.texts[randomIndex];
      }
      
      // Random selection from matching categories
      const randomCategory = matchingCategories[Math.floor(Math.random() * matchingCategories.length)];
      const randomIndex = Math.floor(Math.random() * randomCategory.texts.length);
      
      return randomCategory.texts[randomIndex];
    }
    
    endGame(message) {
      const questionDiv = document.getElementById('question');
      const choicesDiv = document.getElementById('choices');
      const scoreDiv = document.getElementById('score');
      questionDiv.textContent = message;
      choicesDiv.innerHTML = '';
      scoreDiv.textContent = `Final Score: ${this.state.score}`;
      
      // Add restart button
      const restartButton = document.createElement('button');
      restartButton.textContent = 'Play Again';
      restartButton.onclick = () => {
        this.state = {
          score: 0,
          rhDepth: 0,
          coreAnswered: 0,
          currentTarget: null,
          unsolvedComponents: []
        };
        this.startGame();
        scoreDiv.textContent = '';
      };
      choicesDiv.appendChild(restartButton);
    }
  }
  
  // Create and initialize the game instance
  window.addEventListener('DOMContentLoaded', () => {
    new IYCTBITGame();
  });
})();