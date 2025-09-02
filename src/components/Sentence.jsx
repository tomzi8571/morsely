import {Letter} from "./Letter.jsx";
import {Alphabet} from "./Alphabet.jsx";

export function Sentence({text, highlight, reveal = false, wordSuccessFullyGuessed = false}) {

    let highlightKey = '';

    const wordSuccessfullyGuessedStyle = () => {
        const base = {
            transition: 'color 300ms ease, text-shadow 300ms ease, transform 300ms ease',
            transform: 'scale(1)',
        };
        if (wordSuccessFullyGuessed) {
            return {
                ...base,
                color: 'seagreen',
                textShadow: '0 0 6px rgba(46, 204, 113, 0.8), 0 0 14px rgba(46, 204, 113, 0.6)',
                transform: 'scale(1.1)',
                fontWeight: '800'
            };
        }
        return base;
    }

    return (
        <div className='sentence'>
            <div className='sentence-letters' style={wordSuccessfullyGuessedStyle()}>
                {Array.from(text).map((letter, idx) => {
                    highlightKey = highlightKey + letter;
                    return (
                        <Letter
                            key={idx}
                            letter={letter}
                            alphabet={Alphabet()}
                            highlight={highlight}
                            highlightKey={highlightKey}
                            reveal={reveal}
                        />)
                })}
            </div>
        </div>
    );
}