import { ALL_SUITS, ALL_NUMBERS } from './Common.js';

// A sorted deck of cards
const SORTED_DECK = (function() {
    let arr = [];
    ALL_SUITS.forEach(suit => {
        ALL_NUMBERS.forEach(number => {
            arr.push({ 'suit': suit, 'number': number })
        })
    });
    return arr;
})();

export function getRandomCardDeal() {
    let newDeck = SORTED_DECK.slice();
    newDeck = shuffleArray(newDeck);
    let cardTableaux = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    let tableau = 0;
    while (newDeck.length > 0) {
        cardTableaux[tableau].push(newDeck.pop());
        tableau = (tableau >= 7) ? 0 : tableau + 1;
    }
    return cardTableaux;
}

function shuffleArray(array) {
    let counter = array.length;


    while (counter > 0) {

        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
export function isValidMoveToTableau(state, position, newTableauNumber) {
    let parsedPosition = parsePosition(position);

    if (isValidMoveFromPosition(state, parsedPosition, false)) {
        let cardToMove = getCardForPosition(state, parsedPosition);

        let landTableau = state.cardTableaux[newTableauNumber];
        if (landTableau.length === 0) {
            if (parsedPosition.stack === "FOUNDATION" || parsedPosition.stack === "OPEN") {
                return true;
            } else {
                let maxMoveableCards = calculateMaxMoveableCardsToEmptyTableau(state.cardTableaux, state.openCells);
                let cardDepth = state.cardTableaux[parsedPosition.stackIndex].length - parsedPosition.itemIndex;
                return cardDepth <= maxMoveableCards;
            }
        } else {
            let cardToLand = landTableau[landTableau.length - 1];

            return areCardsStackable(cardToLand, cardToMove);
        }
    }
    return false;
}


export function executeMoveToTableau(state, position, newTableauNumber, makeStateCopy = true) {
    let newState = (makeStateCopy) ? Object.assign({}, state) : state;
    let cardsToMove = removeCardsAtPosition(newState, position);


    newState.cardTableaux[newTableauNumber].push(...cardsToMove);

    return newState;
}

export function isValidMoveToFoundation(state, position, foundationNumber) {
    let parsedPosition = parsePosition(position);

    if (isValidMoveFromPosition(state, parsedPosition, true)) {
        let cardToMove = getCardForPosition(state, parsedPosition);
        let foundationCard = state.foundationCells[foundationNumber];

        if (cardToMove.suit === ALL_SUITS[foundationNumber]) {
            if (foundationCard === null) {
                return cardToMove.number === 'A';
            } else {
                return areNumbersStackable(cardToMove.number, foundationCard.number);
            }
        }
    }
    return false;
}


export function executeMoveToFoundation(state, position, foundationNumber, makeStateCopy = true) {
    let newState = (makeStateCopy) ? Object.assign({}, state) : state;
    let cardsToMove = removeCardsAtPosition(newState, position);

    newState.foundationCells[foundationNumber] = cardsToMove[0];

    return newState;
}


export function isValidMoveToOpenCell(state, position, openCellNumber) {
    let parsedPosition = parsePosition(position);

    if (isValidMoveFromPosition(state, parsedPosition, true)) {
        let openCellCard = state.openCells[openCellNumber];


        return openCellCard === null;
    }
    return false;
}


export function executeMoveToOpenCell(state, position, openCellNumber, makeStateCopy = true) {
    let newState = (makeStateCopy) ? Object.assign({}, state) : state;
    let cardsToMove = removeCardsAtPosition(newState, position);


    newState.openCells[openCellNumber] = cardsToMove[0];

    return newState;
}

export function moveAllPossibleCardsToFoundation(state) {
    let newState = Object.assign({}, state);

    let uncheckedCards = getPositionsOfAllTopCards(newState);
    let checkedCards = [];


    while (true) {
        if (uncheckedCards.length === 0) {
            return newState;
        }

        let cardPosition = uncheckedCards.pop()
        let cardToCheck = getCardForPosition(newState, cardPosition);
        let foundationNumber = ALL_SUITS.indexOf(cardToCheck.suit);


        if (isValidMoveToFoundation(newState, cardPosition, foundationNumber)) {

            executeMoveToFoundation(newState, cardPosition, foundationNumber, false);


            if (cardPosition.stack === 'TABLEAU' && cardPosition.itemIndex !== 0) {
                cardPosition.itemIndex--;
                uncheckedCards.push(cardPosition);
            }


            uncheckedCards = checkedCards.concat(uncheckedCards);
            checkedCards = [];

        } else {
            checkedCards.push(cardPosition);
        }
    }
}

function getPositionsOfAllTopCards(state) {
    let cardPositions = [];
    state.cardTableaux.forEach((tableau, tableauIndex) => {
        if (tableau.length !== 0)
            cardPositions.push({
                'stack': 'TABLEAU',
                'stackIndex': tableauIndex,
                'itemIndex': tableau.length - 1
            })
    });

    state.openCells.forEach((openCell, openCellIndex) => {
        if (openCell !== null)
            cardPositions.push({
                'stack': 'OPEN',
                'stackIndex': openCellIndex
            })
    });

    return cardPositions;
}


function parsePosition(position) {

    if (typeof(position) === 'object' && position.hasOwnProperty('stack')) {
        return position;
    }

    let [stack, stackIndex] = position.split(':');
    if (stack === 'TABLEAU') {
        let [tableauNumber, index] = stackIndex.split('/');
        return {
            'stack': 'TABLEAU',
            'stackIndex': parseInt(tableauNumber, 10),
            'itemIndex': parseInt(index, 10)
        }
    } else {
        return {
            'stack': stack,
            'stackIndex': parseInt(stackIndex, 10)
        }
    }
}

function isValidMoveFromPosition(state, position, topCardOnly = false) {
    switch (position.stack) {
        case 'TABLEAU':
            let moveTableau = state.cardTableaux[position.stackIndex];
            let maxMoveableCards = calculateMaxMoveableCards(state.cardTableaux, state.openCells);


            if (topCardOnly) {
                return position.itemIndex === moveTableau.length - 1;
            }

            return areTableauCardsMoveable(moveTableau, maxMoveableCards, position);


        case 'FOUNDATION':
            return false;


        case "OPEN":
            return state.openCells[position.stackIndex] !== null;

        default:
            console.error(`Invalid stack type: ${position.stack}`);
            return false;
    }
}


function areTableauCardsMoveable(tableau, maxMoveableCards, position) {
    let cardDepth = tableau.length - position.itemIndex;

    if (cardDepth > maxMoveableCards) {
        return false;
    }


    for (var i = position.itemIndex; i < tableau.length - 1; i++) {
        let cardAbove = tableau[i];
        let cardBelow = tableau[i + 1];
        if (!areCardsStackable(cardAbove, cardBelow)) {
            return false;
        }
    }
    return true;
}

function getCardForPosition(state, position) {
    switch (position.stack) {
        case 'TABLEAU':
            return state.cardTableaux[position.stackIndex][position.itemIndex];

        case 'FOUNDATION':
            return state.foundationCells[position.stackIndex];
        case "OPEN":
            return state.openCells[position.stackIndex];
        default:
            console.error(`Invalid stack type: ${position.stack}`);
            return null;
    }
}


function removeCardsAtPosition(state, position) {
    let parsedPosition = parsePosition(position);
    let cardToMove = getCardForPosition(state, parsedPosition);

    switch (parsedPosition.stack) {

        case 'TABLEAU':
            let allCardsToMove = [];
            do {
                var currentCard = state.cardTableaux[parsedPosition.stackIndex].pop();
                allCardsToMove.push(currentCard);
            } while (currentCard !== cardToMove);

            return allCardsToMove.reverse();

        case 'FOUNDATION':
            state.foundationCells[parsedPosition.stackIndex] = null;
            return [cardToMove];

        case "OPEN":
            state.openCells[parsedPosition.stackIndex] = null;
            return [cardToMove];

        default:
            console.error(`Invalid stack type: ${parsedPosition.stack}`);
            return [null];
    }
}
export function areSuitsStackable(suit1, suit2) {
    switch (suit1) {
        case 'h':
        case 'd':
            return suit2 === 's' || suit2 === 'c';
        case 's':
        case 'c':
            return suit2 === 'h' || suit2 === 'd';
        default:
            console.error(`Invalid suit types suit1: ${suit1}, suit2: ${suit2}`);
            return false;
    }
}
export function areNumbersStackable(numberHigher, numberLower) {
    return ALL_NUMBERS.indexOf(numberLower) !== 12 &&
        ALL_NUMBERS.indexOf(numberLower) === ALL_NUMBERS.indexOf(numberHigher) - 1;
}
export function areCardsStackable(baseCard, cardToStack) {
    if (baseCard == null) {
        return true;
    }

    return areSuitsStackable(baseCard.suit, cardToStack.suit) &&
        areNumbersStackable(baseCard.number, cardToStack.number);
}

export function calculateMaxMoveableCards(cardTableaux, openCells) {
    let numEmptyTableaux = cardTableaux
        .map(tableau => tableau.length)
        .filter(length => length === 0)
        .length;
    let numEmptyOpenCells = openCells
        .filter(openCell => openCell === null)
        .length;

    return (1 + numEmptyOpenCells) * (2 ** numEmptyTableaux);
}

function calculateMaxMoveableCardsToEmptyTableau(cardTableaux, openCells) {
    let numEmptyTableaux = cardTableaux
        .map(tableau => tableau.length)
        .filter(length => length === 0)
        .length;
    let numEmptyOpenCells = openCells
        .filter(openCell => openCell === null)
        .length;

    return (1 + numEmptyOpenCells) * (2 ** Math.max(0, numEmptyTableaux - 1));
}

export function checkIfVictorious(foundationCells) {
    return foundationCells.every(card => card && card.number === 'K');
}