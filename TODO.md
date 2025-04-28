## To Do

- [ ] Customize `numCoreQuestions` and `exitMidRabbitHole` in `main.js` as desired.
- [ ] Add some info bubbles and wiki links in places (not 100% sure where yet)
  - add `info: str` and `links: list[str]` properties to the craft definitions
- [ ] Mobile responsive branching: visualize multiple dependency branches on desktop and fallback gracefully on mobile
- [ ] Multiplayer challenge mode?
- [ ] Randomized eras: mix questions and tech from different eras
- [ ] Procedurally generated eras: "What if 2000BC suddenly had access to graphene?"
- [ ] Wrap the game in a class (with vars and settings and such) and then wrap *that* in an anonymous function to limit access to any game state stuff
- [ ] Update the era JSON to inclue `year: int` and `name: str` attributes
  - the `year` to be used in determining whether a technology is available. negative = BC, positive = AD/BCE
  - e.g.: `"year": 1500, "name": "1500AD"` or `"year": 1500, "name": "14th Century"`
- [ ] Add more eras and core questions with corresponding crafting definitions
- [ ] Add more humor (with a little sass, some wit, and a lot of charm), especially in responses
- [ ] Make the UI look like more than a barebones minimalistic nothing-burger
- [ ] Move web stuff to a `/docs` directory for GitHub
