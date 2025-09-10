# Ideas

## [Learning Method]

### Adopt the Koch method for learning morse code

- **Strategy:** Implement the Koch method by introducing characters one at a time at full speed. Research the method,
  design lesson progression, and update UI to support incremental character introduction. (
  See [Wikipedia - Koch Method](https://en.wikipedia.org/wiki/Koch_curve))
- Next steps for full Koch compliance:
  Implement logic to track user accuracy for the current set of letters.
  Only unlock the next progression when mastery (e.g., 90% accuracy) is achieved.
  Ensure practice is always at full target speed.
- Currently we use this sequence of letters:
  E T I M A N S O R D L W J P K X C Y G Z Q H V F U I B
  The Koch method uses this sequence:
  K, M, U, R, E, S, N, A, P, T, L, W, I, ., J, Z, =, F, O, Y, ,, V, G, 5, /, Q, 9, 2, H, 3, 8, B, ?, 4, 7, C, 1, D, 6, 0, X
- [ ] Planned

### Add sentences

- **Strategy:** Integrate sentence exercises to improve real-world Morse code comprehension. Collect sample sentences,
  add to exercise flow, and provide feedback for sentence decoding.
- [ ] Planned

## [UI/UX]

### Fixing layout issues in mobile view

- **Strategy:** Review mobile layouts, identify problematic components, and adjust CSS for better responsiveness.
- [ ] Planned

## [Other Features]

### Add more exercises

- **Strategy:** Design and implement additional exercise types to diversify learning.
- [ ] Planned

### Add some interesting facts about morse code and history in between lessons

- **Strategy:** Curate facts and display them contextually during lessons to enhance engagement.
- Create a component 'FunFacts'
- Add it to App.jsx
- Make it display after each session, or after a certain number of lessons.
- Make the companent aware of the current state of the game (e.g., mastery, practice speed, etc.)
-
- [ ] Planned

### Add more audio

- **Strategy:** Source or generate more audio samples for practice and variety.
- [ ] Planned

