import React, { Component, PropTypes } from 'react';
import EventTimeBlock from './EventTimeBlock';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class UserUpdateFormPage extends Component {

  constructor() {
    super();
    this.state = {
      eventUrl: '',
      startDate: '',
      endDate: '',
      startHour: '',
      endHour: '',
      blockChecked: {},
      blockEnabled: {},
      userName: '',
      userUrl: '',
      errorText: ''
    };
  }

  componentDidMount = async () => {
    let res;
    let json;
    try {
      res = await fetch(`/api/form/${this.props.params.eventUrl}`);
      json = await res.json();
      this.setState({
        eventUrl: json.eventUrl,
        startDate: json.startDate,
        endDate: json.endDate,
        startHour: parseInt(json.startHour, 10),
        endHour: parseInt(json.endHour, 10),
        blockEnabled: json.eventTime
      });
    } catch (err) {
      console.log(err);
    }
    const userUrl = this.props.params.userUrl;
    const data = json.userData.find(user => user.userUrl === userUrl);
    console.log(data);
    const blockChecked = (data.availableTime === null) ? {} : data.availableTime;
    this.setState({
      userName: data.userName,
      userUrl,
      blockChecked,
    });
  }

  handleUserNameChange = (event, newValue) => {
    this.setState({ userName: newValue });
  }


  handleEmptyUserName = event => {
    const errorText = event.target.value === '' ? 'Required' : '';
    this.setState({ errorText });
  }


  handleBlockChange = event => {
    const newBlockChecked = this.state.blockChecked;
    newBlockChecked[event.target.id] = !newBlockChecked[event.target.id];
    this.setState({ blockChecked: newBlockChecked });
  }

  handleSubmit = async e => {
    if (this.state.userName === '') {
      this.setState({ errorText: 'Required' });
      return;
    }

    const data = {
      userName: this.state.userName,
      userUrl: this.state.userUrl,
      availableTime: this.state.blockChecked
    };
    console.log(data);
    e.preventDefault();
    const myHeaders = new Headers();
    console.log(data);
    myHeaders.append('Content-Type', 'application/json');
    let res;
    let json;
    try {
      res = await fetch(`/api/form/${this.state.eventUrl}`,
        {
          method: 'PUT',
          headers: myHeaders,
          body: JSON.stringify(data),
        });
      json = await res.json();
    } catch (err) {
      console.log(err);
    }
    window.location.href = `/form/${this.state.eventUrl}/thanks/${this.state.userUrl}`;
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

export default UserUpdateFormPage;
