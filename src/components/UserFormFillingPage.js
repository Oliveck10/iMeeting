import React, { Component, PropTypes } from 'react';
import EventTimeBlock from './EventTimeBlock';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class UserFormFillingPage extends Component {

  constructor() {
    super();
    this.state = {
      eventUrl: '',
      startDate: '',
      endDate: '',
      startHour: '',
      endHour: '',
      blockEnabled: {},
      blockChecked: {},
      userName: ''
    };
  }

  componentDidMount = async () => {
    let res;
    let json;
    try {
      res = await fetch(`/api/form/${this.props.params.eventUrl}`);
      json = await res.json();
    } catch (err) {
      console.log(err);
    }
    this.setState({
      eventUrl: json.eventUrl,
      startDate: json.startDate,
      endDate: json.endDate,
      startHour: json.startHour,
      endHour: json.endHour,
      blockEnabled: json.eventTime,
      blockChecked: {},
      errorText: ''
    });
  }


  handleUserNameChange = (event, newValue) => {
    this.setState({ userName: newValue });
  }


  handleBlockChange = event => {
    const newBlockChecked = this.state.blockChecked;
    newBlockChecked[event.target.id] = !newBlockChecked[event.target.id];
    this.setState({ blockChecked: newBlockChecked });
  }

  handleEmptyUserName = event => {
    const errorText = event.target.value === '' ? 'Required' : '';
    this.setState({ errorText });
  }

  handleSubmit = async e => {
    if (this.state.userName === '') {
      this.setState({ errorText: 'Required' });
      return;
    }

    const data = {
      userName: this.state.userName,
      availableTime: this.state.blockChecked
    };

    e.preventDefault();
    const myHeaders = new Headers();
    console.log(data);
    myHeaders.append('Content-Type', 'application/json');
    let res;
    let json;
    try {
      res = await fetch(`/api/form/${this.state.eventUrl}`,
        {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data),
        });
      json = await res.json();
    } catch (err) {
      console.log(err);
    }
    const userUrl = json.userUrl;
    window.location.href = `${this.state.eventUrl}/thanks/${userUrl}`;
  }

  render() {
    return (
      <div className="container col-md-12">
        <TextField
          onChange={this.handleUserNameChange}
          onBlur={this.handleEmptyUserName}
          id="userName"
          hintText="Enter User Name"
          floatingLabelText="User Name"
          errorText={this.state.errorText}
          value={this.state.userName}
        />
        <EventTimeBlock
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          startHour={this.state.startHour}
          endHour={this.state.endHour}
          blockChecked={this.state.blockChecked}
          blockEnabled={this.state.blockEnabled}
          handleBlockChange={this.handleBlockChange}
          checkable
        />
        <RaisedButton
          label="Submit"
          primary
          disabled={this.state.errorText === 'Required'}
          onClick={this.handleSubmit}
        />
      </div>
    );
  }
}

export default UserFormFillingPage;
