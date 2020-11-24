import React, { Component } from 'react';
import Card from '../Card/Card.js';
import { ALL_SUITS, suitShortToFullNameMap } from '../Common.js';
import './Cell.css';
import './FoundationCell.css';

class FoundationCell extends Component {
    constructor(props) {
        super(props);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.suit = ALL_SUITS[this.props.foundationNumber];
    }

    onDragOver(e) {
        e.preventDefault();
    }

    onDrop(e) {
        e.preventDefault();
        var position = e.dataTransfer.getData("text");
        this.props.onAttemptMoveCard(position, this.props.foundationNumber);
    }

    render() {
        return ( <
            div className = "FoundationCell"
            onDragOver = { this.onDragOver }
            onDrop = { this.onDrop } > {
                this.props.card ? ( <
                    Card position = { `FOUNDATION:${this.props.foundationNumber}` }
                    suit = { this.props.card.suit }
                    number = { this.props.card.number }
                    isSelectable = { true } >
                    <
                    /Card>
                ) : ( <
                    div className = "empty-cell" >
                    <
                    div className = { `large-suit-icon ${suitShortToFullNameMap[this.suit]}` } > < /div> <
                    /div>
                )
            } <
            /div>
        );
    }
}

export default FoundationCell;