## To Do

Note: some of these list items could reasonably span multiple categories.
"Randomized eras" is a gameplay mode that impacts the logical architecture and
design. But since I don't have a reasonable way to tag (and subsequently filter
tags) in this markdown document, here we are.

### Logical Architecture / Design

- [ ] Update the era JSON to inclue `year: int` and `name: str` attributes
  - the `year` to be used in determining whether a technology is available. negative = BC, positive = AD/BCE
  - e.g.: `"year": 1500, "name": "1500AD"` or `"year": 1500, "name": "14th Century"`
- [ ] Wrap the game in a class (with vars and settings and such) and then wrap *that* in an anonymous function to limit access to any game state stuff
- [ ] Add some info bubbles and wiki links in places (not 100% sure where yet)
  - add `info: str` and `links: list[str]` properties to the craft definitions
- [ ] Ensure that, as RH depth increases, the minimimum plausibility for selected crafting definitions / recipes

### Data

- [ ] Add more eras and core questions with corresponding crafting definitions
- [ ] Add a "names" property to components (see UI/UX `Technology names`)
- [ ] Add more humor (with a little sass, some wit, and a lot of charm), especially in responses
- [ ] Add some success / failure responses
  - failure responses should include a plausibility range, e.g.: `{"plausibility": [0.9, 1.0], "text": "Your ${component} creation almost works! But "almost" doesn't revolutionize the world"}`. The plausibility range is defined as `[inclusive, exclusive]`. When a herring is selected, a failure response should be selected at random from all of the failure responses whose plausibility range includes the herring's plausibility value. The lower the plausibility range, the sassier and cheekier the response :P (but keep it lighthearted)
  - we might consider storing these responses in `js/data/responses/default.json`, `js/data/responses/kind.json`, `js/data/responses/savage.json` etc... the user could then select a mode to decide the game's sassiness level lol. the savage JSON could, for example, include far meaner responses for the lower plausibility failures and still be sarcastic with the success responses. the kind mode would only include kind responses across all response types and plausibilities (i.e.: all failure responses would map to `[0.0, 1.0]` and be kind)

### UI/UX

- [ ] **Technology names**: Display technology names, not just IDs
- [ ] Mobile responsive branching: visualize multiple dependency branches on desktop and fallback gracefully on mobile
- [ ] Make the UI look like more than a barebones minimalistic nothing-burger

### Gameplay

- [ ] Randomized eras: mix questions and tech from different eras
- [ ] Procedurally generated eras: "What if 2000BC suddenly had access to graphene?"
  - Loop over eras
- [ ] ? Multiplayer challenge mode?
- [ ] ? OOP-ify the game and components (Game, Settings, Results, GameHistory, Era, Question, CoreQuestion(Question), RabbitHoleQuestion(Question), Technology, Recipe, etc...)
- [ ] Add a storyline to the start page for settings (ideally: a random selection on page load from a list of settings storylines)
  - e.g.: "You're hitchhiking when a wide-eyed doctor picks you up. Suddenly, he grasps his heart screaming 'Great Scott!', passes out, and the car barrels through {era  selection dropdown}... Can revolutionize the world?" {start button}
  - Possible special era option as implemented: "altered timelines"
  - ? Multi-selection dropdown to facilitate a the above mix mode
  - Each storyline in the list should make sense with the fact that {era selection dropdown} values could be "altered timelines", multiple eras, or a single era. Whatever the user selection, reading the storyline with any of those values injected should sound sensical.
- [ ] Add the idea of "meta" tags and recipes. e.g.: for a battery, one of the meta-recipes might be `["anode", "cathode", "electrolyte"]`. This will facilitate procedurally generated gameplays where we say "You land in the year 0,&4$. Something is weird... but here's a list of cool items in this year (if you can call it that): ..." and then have arbitrary random names given to tags. Then it is up to the user to remember "okay, in this scenario, 'Flidrolog' is an electrolyte", so when the Battery question comes up, they can select a recipe that lists "Flidrolog" as an ingredient.

### General

- [ ] Move web stuff to a `/docs` directory for GitHub
  - If we do this, it would be nice to add some diagrams for how the pieces fit together
- [ ] Once stable, create a script to validate that all required crafting definitions / IDs are accounted for

## Definitions

- **technology**: a tool or ingredient in the crafting JSON
- **technology definition**: the JSON definition for a technology, including its name, ID, links, herrings, recipes, etc...
- **[technology] recipe**: a collection of technologies or resources which compose a higher-level technology
- **herring**: semi-plausible (plausibility > 0.2) but ultimately incorrect recipe for a given technology
- **semi-plausible herring**: herring with 0.2 < plausibility < 0.8
- **plausible herring**: a herring with a plausibility >= 0.8
- **rabbit hole**: any increasingly difficult questions which 
- **silly recipe**: any incorrect recipe with a plausibility <= 0.2

## Requirements

- Every technology should ideally define 7 or so crafting definitions:
  - 2+ correct definitions (1 is acceptable for common/simple technologies like "hammer") -- plausibility == 1.0
  - 1+ silly recipe -- plausibility <= 0.2
  - 2+ semi-plausible herrings -- 0.2 < plausibility < 0.8
  - 2+ plausible herrings -- plausibility >= 0.8

## AI Refactor

### Batch 1: Modularization

- [ ] Wrap game logic in a `GameEngine` class to encapsulate states and settings.
- [ ] Separate main functionalities into distinct modules for UI handling, game logic, and data management.

### Batch 2: Data Structure Enhancements

- [ ] Normalize era and crafting JSON to include `year` and `name`.
- [ ] Centralize configuration parameters into a dedicated module.

### Batch 3: Code Consistency and Cleanup

- [ ] Standardize naming conventions across variables, functions, and files.
- [ ] Apply consistent code formatting.

### Batch 4: Error Handling and Logging

- [ ] Implement logging for events and errors.
- [ ] Enhance error handling for robust detection.

### Batch 5: Unit Testing

- [ ] Develop automated test suites for key functionalities.
- [ ] Use AI to generate test cases based on existing functions.

### Batch 6: Documentation Improvement

- [ ] Enhance inline documentation and code comments.
- [ ] Update technical documentation to reflect architecture changes.
