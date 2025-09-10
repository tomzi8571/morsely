# AI Sentence Generation & Enhancement Prompt

## Objective

Create or enhance sentences for Morse code learning progressions, following these requirements:

## Requirements

- Sentences must use only the allowed letters for the current progression.
- Each sentence should start with a different word whenever possible.
- Avoid starting all sentences with the same word (e.g., 'A', 'The', 'It', 'Music', etc.).
- Vocabulary should be varied and not repetitive.
- Sentences should be inspired by interesting facts, records, astronomy, technology, or other real-world contexts (e.g.,
  Guinness Book of Records, funfacts.json).
- Sentences should be naturally capitalized and concise.
- Sentences should be suitable for incremental learning (Koch method).
- Vary sentence structure and vocabulary for engagement.
- Use examples about the biggest, smallest, longest, heaviest, highest, etc.
- Ensure each sentence only uses the allowed letters for the current progression.

## Inspiration Sources

- Astronomy (e.g., "The sun is a star.")
- Technology
- Guinness Book of Records
- Fun facts from funfacts.json

## Output

- For each progression, generate sentences that:
    - Use only the allowed letters
    - Start with different words
    - Are inspired by facts or records
    - Are naturally capitalized
    - Are concise and engaging

---

This prompt is designed for use with an AI that generates or enhances sentences for Morse code learning, ensuring
variety, relevance, and incremental difficulty.

## AI Sentences 2

Generate at least 30 original, meaningful sentences using only the letters E, T, I, M, A, N. Each sentence should be 3
to 7 words long, and must contain real words that are semantically valid and grammatically correct. Be creative with
names, places, and nouns—use inventive combinations and minimalist storytelling. Make the sentences funny, poetic, or
surprising, and include factual insights where possible. For example, if a sentence mentions ants or manatees, include a
short fact about them.

## AI Prompt for Names

Using only the letters in this sequence:
E T I M A N S O R D L W J P K X C Y G Z Q H V F U I B
build a progressive list of valid names.

Rules:
Begin with the first letter (E) and attempt to find at least 3 real names that use only that letter. If fewer than 3
exist, skip that step.

Add one letter at a time in the given sequence (E → ET → ETI → ETIM → …) and at each step find exactly 6 real names that
can be formed using only the letters available so far.

At each step:
- 2 names must be of European origin (from any part of Europe). 
- 4 names must be from the rest of the world (Africa, Asia, the Americas, Oceania). 
- Names must be real, meaningful, and between 3–10 letters long. 
- Letters may repeat, but no letters outside the current set may be used. 
- Avoid starting all names with the same letter; vary them. 
- If no new names can be found at a step, skip that step.

Output format:
- The output must be in valid JSON. 
- The JSON should be an array of objects, one per step. 
- Each step object must have:
  - "step": the step number (integer)
  - "letters": the letters available at that step (string)
  - "names": an array of name objects, each containing:
    - "name": the name (string)
    - "origin": the cultural/geographic origin of the name (string)
    - "meaning": a complete sentence explaining the origin of the name and including an interesting cultural or historical
fact (string)

Example JSON structure:
```
[
  {
    "step": 3,
    "letters": "ETI",
    "names": [
      {
        "name": "Ettie",
        "origin": "English",
        "meaning": "Diminutive of Esther or Henrietta, popular in Victorian Britain."
      },
      {
        "name": "Etti",
        "origin": "German",
        "meaning": "Diminutive of Henriette or Elisabet."
      }
    ]
  }
]
```

Important:
Ensure all names are authentic and culturally accurate.
Provide variety in starting letters and cultural backgrounds.
Keep the JSON clean, valid, and ready to parse.
