export function Alphabet() {
    const letters = [
        // Letters
        {text: 'A', morse: '.-', type: 'letter'},
        {text: 'B', morse: '-...', type: 'letter'},
        {text: 'C', morse: '-.-.', type: 'letter'},
        {text: 'D', morse: '-..', type: 'letter'},
        {text: 'E', morse: '.', type: 'letter'},
        {text: 'F', morse: '..-.', type: 'letter'},
        {text: 'G', morse: '--.', type: 'letter'},
        {text: 'H', morse: '....', type: 'letter'},
        {text: 'I', morse: '..', type: 'letter'},
        {text: 'J', morse: '.---', type: 'letter'},
        {text: 'K', morse: '-.-', type: 'letter'},
        {text: 'L', morse: '.-..', type: 'letter'},
        {text: 'M', morse: '--', type: 'letter'},
        {text: 'N', morse: '-.', type: 'letter'},
        {text: 'O', morse: '---', type: 'letter'},
        {text: 'P', morse: '.--.', type: 'letter'},
        {text: 'Q', morse: '--.-', type: 'letter'},
        {text: 'R', morse: '.-.', type: 'letter'},
        {text: 'S', morse: '...', type: 'letter'},
        {text: 'T', morse: '-', type: 'letter'},
        {text: 'U', morse: '..-', type: 'letter'},
        {text: 'V', morse: '...-', type: 'letter'},
        {text: 'W', morse: '.--', type: 'letter'},
        {text: 'X', morse: '-..-', type: 'letter'},
        {text: 'Y', morse: '-.--', type: 'letter'},
        {text: 'Z', morse: '--..', type: 'letter'},

        // Digits
        {text: '0', morse: '-----', type: 'digit'},
        {text: '1', morse: '.----', type: 'digit'},
        {text: '2', morse: '..---', type: 'digit'},
        {text: '3', morse: '...--', type: 'digit'},
        {text: '4', morse: '....-', type: 'digit'},
        {text: '5', morse: '.....', type: 'digit'},
        {text: '6', morse: '-....', type: 'digit'},
        {text: '7', morse: '--...', type: 'digit'},
        {text: '8', morse: '---..', type: 'digit'},
        {text: '9', morse: '----.', type: 'digit'},

        // Common punctuation
        {text: '.', morse: '.-.-.-', type: 'punctuation'},
        {text: ',', morse: '--..--', type: 'punctuation'},
        {text: '?', morse: '..--..', type: 'punctuation'},
        {text: "'", morse: '.----.', type: 'punctuation'},
        {text: '!', morse: '-.-.--', type: 'punctuation'},
        {text: '/', morse: '-..-.', type: 'punctuation'},
        {text: '(', morse: '-.--.', type: 'punctuation'},
        {text: ')', morse: '-.--.-', type: 'punctuation'},
        {text: '&', morse: '.-...', type: 'punctuation'},
        {text: ':', morse: '---...', type: 'punctuation'},
        {text: ';', morse: '-.-.-.', type: 'punctuation'},
        {text: '=', morse: '-...-', type: 'punctuation'},
        {text: '+', morse: '.-.-.', type: 'punctuation'},
        {text: '-', morse: '-....-', type: 'punctuation'},
        {text: '_', morse: '..--.-', type: 'punctuation'},
        {text: '"', morse: '.-..-.', type: 'punctuation'},
        {text: '$', morse: '...-..-', type: 'punctuation'},
        {text: '@', morse: '.--.-.', type: 'punctuation'},

        // Space (word separator conventionally shown as "/")
        {text: ' ', morse: '/', type: 'punctuation'}
    ];

    return {letters}
}