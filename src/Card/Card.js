import React, { Component } from 'react';
import { suitShortToFullNameMap } from '../Common.js';

import './Card.css';

class Card extends Component {

    constructor(props) {
        super(props);
        this.onDrag = this.onDrag.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    onDrag(e) {
        if (this.props.isSelectable) {
            e.dataTransfer.setData("text", this.props.position);
        } else {

            e.preventDefault();
        }
    }

    onDoubleClick(e) {
        e.preventDefault();
        let customEventInit = {
            bubbles: true,
            detail: {
                position: this.props.position,
                suit: this.props.suit
            }
        }
        e.target.dispatchEvent(new CustomEvent('double-click-card', customEventInit));
    }

    render() {
        let selectableClass = (this.props.isSelectable) ? 'selectable' : '';
        return ( <
            div className = { `Card ${selectableClass}` }
            draggable = "true"
            onDragStart = { this.onDrag }
            onDoubleClick = { this.onDoubleClick }
            onContextMenu = { this.onDoubleClick } >
            <
            div className = "Card-number" > { this.props.number } < /div> <
            div className = { `suit-icon ${suitShortToFullNameMap[this.props.suit]}` } > < /div> < /
            div >
        );
    }
}

export default Card;