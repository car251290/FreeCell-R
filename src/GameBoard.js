import React, { Component } from 'react';
import Tableau from './Cells/Tableau.js';
import FoundationCell from './Cells/FoundationCell.js';
import OpenCell from './Cells/OpenCell.js';
import VictoryBanner from './VictoryBanner.js';
import { ALL_SUITS } from './Common.js';
import * as gameLogic from './GameLogic.js';
import './GameBoard.css';

class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign(
            this.getNewDealObject()
        );

        this.gameBoard = React.createRef();

        this.onClickDealNewHand = this.onClickDealNewHand.bind(this);
        this.attemptMoveCardToTableau = this.attemptMoveCardToTableau.bind(this);
        this.attemptMoveCardToFoundation = this.attemptMoveCardToFoundation.bind(this);
        this.attemptMoveCardToOpenCell = this.attemptMoveCardToOpenCell.bind(this);
        this.handleDblClickCard = this.handleDblClickCard.bind(this);
        this.handleLeftClickBoard = this.handleLeftClickBoard.bind(this);
    }

    componentDidMount() {
        this.gameBoard.current.addEventListener("double-click-card", this.handleDblClickCard);
    }

    componentWillUnmount() {
        this.gameBoard.current.removeEventListener("double-click-card", this.handleDblClickCard);
    }

    onClickDealNewHand(e) {
        this.setState(this.getNewDealObject());
    }

    getNewDealObject() {
        return {
            cardTableaux: gameLogic.getRandomCardDeal(),
            foundationCells: [null, null, null, null],
            openCells: [null, null, null, null]
        };
    }

    attemptMoveCardToTableau(position, newTableauNumber) {
        if (gameLogic.isValidMoveToTableau(this.state, position, newTableauNumber)) {
            let newState = gameLogic.executeMoveToTableau(this.state, position, newTableauNumber);
            this.setState(newState);
        }
    }

    attemptMoveCardToFoundation(position, foundationNumber) {
        if (gameLogic.isValidMoveToFoundation(this.state, position, foundationNumber)) {
            let newState = gameLogic.executeMoveToFoundation(this.state, position, foundationNumber);
            this.setState(newState);
        }
    }

    attemptMoveCardToOpenCell(position, openCellNumber) {
        if (gameLogic.isValidMoveToOpenCell(this.state, position, openCellNumber)) {
            let newState = gameLogic.executeMoveToOpenCell(this.state, position, openCellNumber);
            this.setState(newState);
        }
    }

    handleDblClickCard(e) {
        let position = e.detail.position;
        let foundationNumber = ALL_SUITS.indexOf(e.detail.suit);
        if (gameLogic.isValidMoveToFoundation(this.state, position, foundationNumber)) {
            let newState = gameLogic.executeMoveToFoundation(this.state, position, foundationNumber);
            this.setState(newState);
        }
    }

    handleLeftClickBoard(e) {
        // This checks if this left click is actually fired from a Card left click
        if (!e.defaultPrevented) {
            e.preventDefault();
            let newState = gameLogic.moveAllPossibleCardsToFoundation(this.state);
            this.setState(newState);
        }
    }

    render() {
        let maxMoveableCards = gameLogic.calculateMaxMoveableCards(this.state.cardTableaux, this.state.openCells);
        let isVictorious = gameLogic.checkIfVictorious(this.state.foundationCells);
        return ( <
            React.Fragment >
            <
            button className = 'btn'
            onClick = { this.onClickDealNewHand } > New hand! < /button> <
            div ref = { this.gameBoard }
            className = "GameBoard"
            onContextMenu = { this.handleLeftClickBoard } >
            <
            div className = "GameBoard-Foundation" > {
                this.state.foundationCells.map((card, index) =>
                    <
                    FoundationCell key = { ALL_SUITS[index] }
                    foundationNumber = { index }
                    card = { card }
                    onAttemptMoveCard = { this.attemptMoveCardToFoundation } >
                    <
                    /FoundationCell>
                )
            } <
            /div>

            <
            div className = "GameBoard-OpenCell" > {
                this.state.openCells.map((card, index) =>
                    <
                    OpenCell key = { ALL_SUITS[index] }
                    openCellNumber = { index }
                    card = { card }
                    onAttemptMoveCard = { this.attemptMoveCardToOpenCell } >
                    <
                    /OpenCell>
                )
            } <
            /div>

            {
                this.state.cardTableaux.map((tableau, index) =>
                    <
                    Tableau key = { index }
                    cards = { tableau }
                    tableauNumber = { index }
                    maxMoveableCards = { maxMoveableCards }
                    onAttemptMoveCard = { this.attemptMoveCardToTableau }
                    attemptMoveToFoundation = { this.attemptMoveToFoundation } >
                    <
                    /Tableau>
                )
            }

            {
                isVictorious &&
                    <
                    VictoryBanner > < /VictoryBanner>
            } <
            /div> < /
            React.Fragment >
        );
    }
}

export default GameBoard;