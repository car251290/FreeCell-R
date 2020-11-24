import React, { Component } from 'react';
import './VictoryBanner.css';

class VictoryBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            extraClasses: ''
        }
        this.onClickBanner = this.onClickBanner.bind(this);
    }

    onClickBanner(e) {
        this.setState({ extraClasses: 'disappear' });
    }

    render() {
        return ( < div className = { `VictoryBanner ${this.state.extraClasses}` }
            onClick = { this.onClickBanner } > You WIN!!! < /div>
        );
    }
}

export default VictoryBanner;