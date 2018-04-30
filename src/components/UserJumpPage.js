import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class UserJumpPage extends Component {
    constructor() {
        super();
        this.state = {
            eventUrl: '',
            userUrl: '',
        };
    }

    componentDidMount = async() => {
        // fetch `/api/users/${id}` to get article and then set state...
        this.setState({
            eventUrl: this.props.params.eventUrl,
            userUrl: this.props.params.userUrl
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
            h2 > Update your response any time here: < /h2> <
            div className = "col-md-12 text-center" >
            <
            RaisedButton href = { `/form/${this.state.eventUrl}/update/${this.state.userUrl}` }
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

export default UserJumpPage;