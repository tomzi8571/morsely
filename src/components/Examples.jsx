import PropTypes from "prop-types";

export const ProgressionPropType = PropTypes.shape({
    introduced: PropTypes.string.isRequired,
    words: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    sentences: PropTypes.arrayOf(PropTypes.string.isRequired)
});

export const SessionPropType = PropTypes.shape({
    description: PropTypes.string.isRequired,
    progressions: PropTypes.arrayOf(ProgressionPropType.isRequired).isRequired
});

// The top-level Examples() return value: keys like "1", "2", ... mapping to sessions
export const ExamplesPropType = PropTypes.objectOf(SessionPropType);

export function Examples() {
    return {
        "1": {
            "description": "Foundations (single + symmetric)",
            "subtitle": "E, T, I, M, A, N",
            "progressions": [
                {"introduced": "E + T", "words": ["E", "T", "TE", "ET", "TEE", "TET"]},
                {
                    "introduced": "I",
                    "words": ["I", "IT", "TI", "TIE", "ITE"],
                    "sentences": [
                        "i tie it.",
                        "i tie it in it.",
                        "i tie it, i tie it."
                    ]
                },
                {
                    "introduced": "M",
                    "words": ["M", "ME", "EM", "MET", "MEET", "TIME", "EMIT"],
                    "sentences": [
                        "i met it.",
                        "i time it.",
                        "i emit it in time.",
                        "i meet it."
                    ]
                },
                {
                    "introduced": "A",
                    "words": ["A", "AM", "MA", "ATE", "EAT", "TEA", "MEAT", "MATE", "TAME"],
                    "sentences": [
                        "i am at a tea.",
                        "i eat at a tea.",
                        "i am at a team meet.",
                        "i am a mate."
                    ]
                },
                {
                    "introduced": "N",
                    "words": ["N", "AN", "NA", "ANT", "TAN", "TEN", "NET", "NEAT", "ANTE", "MEAN"],
                    "sentences": [
                        "i am in an inn.",
                        "i mean it at ten.",
                        "a neat man ate at ten.",
                        "at ten i eat meat."
                    ]
                }
            ]
        },
        "2": {
            "description": "2–3 symbol core families",
            "subtitle": "S, O, R, D",
            "progressions": [
                {
                    "introduced": "S",
                    "words": ["S", "AS", "SA", "SAT", "SET", "SIT", "SANE", "SEAT", "SENT"],
                    "sentences": [
                        "i sit.",
                        "i set a seat.",
                        "i sit as i set a seat.",
                        "i sit as i see it."
                    ]
                },
                {
                    "introduced": "O",
                    "words": ["O", "TO", "ON", "ONE", "SOS", "TONE", "NOTE", "MOON", "STONE", "SOME"],
                    "sentences": [
                        "one note to one.",
                        "i see one stone.",
                        "one note on one stone to one.",
                        "one stone is on one."
                    ]
                },
                {
                    "introduced": "R",
                    "words": ["R", "AR", "RA", "EAR", "ERA", "EARN", "NEAR", "ORATE"],
                    "sentences": [
                        "a rose is near.",
                        "i earn a seat.",
                        "a rare rose is near one area.",
                        "a rare rose is near."
                    ]
                },
                {
                    "introduced": "D",
                    "words": ["D", "AD", "DA", "DEAR", "READ", "TREAD", "SENDER"],
                    "sentences": [
                        "i read a note.",
                        "i read and send a note.",
                        "i tread on a road and read a note.",
                        "i read and reread."
                    ]
                }
            ]
        },
        "3": {
            "description": "A-family (.- prefix)",
            "subtitle": "L, W, J, P",
            "progressions": [
                {
                    "introduced": "L",
                    "words": ["L", "AL", "LA", "LATE", "TALE", "LEARN", "LANE", "LEAN", "LEND", "ALONE"],
                    "sentences": [
                        "i learn a tale.",
                        "a lane is near a wall.",
                        "i lean on a lane and learn a tale.",
                        "i learn as i lean."
                    ]
                },
                {
                    "introduced": "W",
                    "words": ["W", "AW", "WA", "WET", "WANE", "WEAR", "WORN", "WATER"],
                    "sentences": [
                        "we are well.",
                        "we wear a warm wrap.",
                        "we water a lane as we walk.",
                        "we write a note."
                    ]
                },
                {
                    "introduced": "J",
                    "words": ["J", "JA", "JO", "JET", "JOT", "JAM", "JAR", "JANET"],
                    "sentences": [
                        "jo and jan jot.",
                        "janet jots a note.",
                        "jo and jan jot as janet jots a note.",
                        "janet and jo join."
                    ]
                },
                {
                    "introduced": "P",
                    "words": ["P", "PA", "AP", "PEAR", "PEARL", "LEAP", "TAPE", "SPARE", "PARSE", "PROSE"],
                    "sentences": [
                        "we plan a step.",
                        "we tape a page and prep a plan.",
                        "we plan a trip and tape a spare page.",
                        "we prep a plan."
                    ]
                }
            ]
        },
        "4": {
            "description": "N/K-family (-. prefix)",
            "subtitle": "K, X, C, Y",
            "progressions": [
                {
                    "introduced": "K",
                    "words": ["K", "AK", "KA", "AKE", "TAKE", "MAKER", "TOKEN", "OAKEN", "WORK", "YOKE"],
                    "sentences": [
                        "we take a seat.",
                        "we make a token.",
                        "we take a token and make a work plan.",
                        "we take a walk."
                    ]
                },
                {
                    "introduced": "X",
                    "words": ["X", "AX", "OX", "TAX", "AXE", "AXON", "ANNEX", "EXTRA"],
                    "sentences": [
                        "we tax a taxi.",
                        "we axe an oak at six.",
                        "we annex a zone next to a taxi.",
                        "an annex is next."
                    ]
                },
                {
                    "introduced": "C",
                    "words": ["C", "AC", "CA", "ACE", "CONE", "CANE", "CAME", "CRANE", "SCAR", "SCONE", "CORN"],
                    "sentences": [
                        "we can act.",
                        "we scan a scene and set a cone.",
                        "we can set a cone on a cart near a crane.",
                        "we cart a cone."
                    ]
                },
                {
                    "introduced": "Y",
                    "words": ["Y", "AY", "YA", "YEA", "YORE", "YEAR", "YARN", "YEARN", "YOKE", "YON"],
                    "sentences": [
                        "we say yes.",
                        "we stay one year.",
                        "we say yes and stay one year at a cozy yard.",
                        "we enjoy an easy year."
                    ]
                }
            ]
        },
        "5": {
            "description": "M/G/O-family (-- prefix)",
            "subtitle": "G, Z, Q (O review)",
            "progressions": [
                {
                    "introduced": "G",
                    "words": ["G", "AG", "GA", "AGE", "GORE", "GEAR", "ORGAN", "ARGON"],
                    "sentences": [
                        "we go on a road.",
                        "we get a goal and a gear.",
                        "we go along a long road and gather gear.",
                        "we go along and agree."
                    ]
                },
                {
                    "introduced": "Z",
                    "words": ["Z", "AZ", "ZA", "ZOO", "ZONA", "ZING", "ZONER", "AMAZE"],
                    "sentences": [
                        "we see a zoo.",
                        "a zone is near a rose.",
                        "we gaze at a zoo in a safe zone.",
                        "we gaze at a zone."
                    ]
                },
                {
                    "introduced": "Q",
                    "words": ["Q", "QA", "QAT", "QANAT"],
                    "sentences": [
                        "a qat is rare.",
                        "a qanat at a zone.",
                        "a qanat at an oasis zone is near.",
                        "a q is on a note."
                    ]
                }
            ]
        },
        "6": {
            "description": "S/H/V/F-family (dot-heavy)",
            "subtitle": "H, V, F (S review)",
            "progressions": [
                {
                    "introduced": "H",
                    "words": ["H", "AH", "HA", "HEAT", "HATE", "HINT", "HORN", "HONOR", "HEART"],
                    "sentences": [
                        "he is here.",
                        "he has a hat at noon.",
                        "he hears a horn and has a hot tea.",
                        "he hears a horn."
                    ]
                },
                {
                    "introduced": "V",
                    "words": ["V", "AV", "VA", "VIA", "VINE", "VEIN", "OVEN", "RIVEN", "NERVE", "RIVET"],
                    "sentences": [
                        "we have a view.",
                        "a vine is over a wall.",
                        "we save a vase and revive a service.",
                        "we save a view."
                    ]
                },
                {
                    "introduced": "F",
                    "words": ["F", "AF", "FA", "FAN", "FAR", "FINE", "FATE", "FAIR", "FAVOR"],
                    "sentences": [
                        "we find a safe site.",
                        "we favor a fine idea.",
                        "we finish a fast task and favor a fair plan.",
                        "we find a fine fit."
                    ]
                }
            ]
        },
        "7": {
            "description": "I/U-family + singles review",
            "subtitle": "U (I review)",
            "progressions": [
                {
                    "introduced": "U",
                    "words": ["U", "AU", "UA", "UT", "TUN", "TUNE", "UNIT", "AUNT", "UNDO"],
                    "sentences": [
                        "we tune a unit.",
                        "you and i unite at noon.",
                        "we tune a unit and undo an issue.",
                        "we use a unit at noon."
                    ]
                }
            ]
        },
        "8": {
            "description": "Tricky contrasts",
            "subtitle": "B",
            "progressions": [
                {
                    "introduced": "B",
                    "words": ["B", "AB", "BA", "BAN", "BEAN", "BEAR", "BARN", "BAND", "BOARD", "ABROAD", "BRAND"],
                    "sentences": [
                        "a big bag is on a van.",
                        "a barn is by a road and a bay.",
                        "a brave band brings a board aboard a boat.",
                        "a big blue bus is by a bay."
                    ]
                }
            ]
        }
    }
}