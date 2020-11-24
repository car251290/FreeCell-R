import React, { Component } from 'react';
import Card from '../Card/Card.js';
import './Cell.css';
import './OpenCell.css';

class OpenCell extends Component {
    constructor(props) {
        super(props);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    onDragOver(e) {
        e.preventDefault();
    }
    onDrop(e) {
        e.preventDefault();
        var position = e.dataTransfer.getData("text");
        this.props.onAttemptMoveCard(position, this.props.openCellNumber);
    }

    render() {
        return ( <
            div className = "OpenCell"
            onDragOver = { this.onDragOver }
            onDrop = { this.onDrop } > {
                this.props.card ? ( <
                    Card position = { `OPEN:${this.props.openCellNumber}` }
                    suit = { this.props.card.suit }
                    number = { this.props.card.number }
                    isSelectable = { true } >
                    <
                    /Card>
                ) : ( <
                    div className = "empty-cell" > < /div>
                )
            } <
            /div>
        );
    }
}

export default OpenCell;