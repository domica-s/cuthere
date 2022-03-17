import React from "react";

const API = '../../allevents'

class Event extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
            events: {},
        };
    }

    componentDidMount() {
        fetch(API)
            .then(res => res.json())
            .then(data => {
                console.log('Received events: ', data);
                this.setState( {events: data} )
            });
    }

    render() {
        let e = this.state.events
        return(
            
            <div className="container">
                <h2>Here are the events</h2>
                <p>The events could be seen in reactDOM state</p>
            </div>
        );
    }
}

export {Event}