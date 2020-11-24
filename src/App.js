import React, { Component } from 'react';
import GameBoard from './GameBoard.js';
import './App.css';

class App extends Component {
    render() {
        return ( < div className = "App" >
            <
            h1 style = {
                { color: "red" }
            } > Free Cell Let Play < /h1> <
            GameBoard > < /GameBoard> < /
            div >
        );
    }
}

export default App;