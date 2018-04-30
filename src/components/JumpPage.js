import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class JumpPage extends Component {
    constructor() {
        super();
        this.state = {
            eventUrl: '',
            adminUrl: '',
        };
    }

    componentDidMount = async() => {
        // fetch `/api/users/${id}` to get article and then set state...
        this.setState({
            eventUrl: this.props.params.eventUrl,
            adminUrl: this.props.params.adminUrl
        });
    }

    render() {
        const style = {
            textAlign: 'center',
            paddingTop: 100
        };
        return ( <
            div style = { style } >
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
            h2 > Send this link to your invitees: < /h2> <
            div className = "col-md-12 text-center" >
            <
            RaisedButton href = { `/form/${this.state.eventUrl}` }
            label = "link"
            primary /
            >
            <
            /div> <
            /div> <
            div className = "row" >
            <
            h2 > View your event results here: < /h2> <
            div className = "col-md-12 text-center" >
            <
            RaisedButton href = { `/result/${this.state.eventUrl}` }
            label = "link"
            primary /
            >
            <
            /div> <
            /div> <
            /div>
        );
    }
}

export default JumpPage;