// entry page for event creator
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class HomePage extends Component {
    render() {
        return ( <
            div className = "container" >
            <
            div className = "row" >
            <
            div className = "col-md-12 text-center" >
            <
            h1 > 歡迎來到iMeeting! < /h1> <
            /div> <
            /div> <
            div className = "row" >
            <
            div className = "col-md-12 text-center" >
            <
            RaisedButton href = "/create"
            label = "建立事件"
            primary /
            >
            <
            /div> <
            /div> <
            /div>
        );
    }
}

export default HomePage;