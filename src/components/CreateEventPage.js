import React, { Component, PropTypes } from 'react';
import 'babel-polyfill';
import EventTimeBlock from './EventTimeBlock';
import fetch from 'isomorphic-fetch';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import clone from '../utils/utils';

const optionsStyle = {
  maxWidth: 255,
  marginRight: 'auto',
};


class CreateEventPage extends Component {
  static propTypes = {
    days: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super();
    const defaultDaysSelected = [];
    props.days.forEach((day, idx) => {
      defaultDaysSelected[idx] = true;
    });
    const startDate = new Date();
    let endDate = new Date();
    const startHour = 8;
    const endHour = 21;

    this.state = {
      eventName: '',
      daysSelected: defaultDaysSelected,
      startDate,
      endDate,
      startHour,
      endHour,
      errorText: '',
      blockChecked: {}
    };
  }

  getAllDays = (startDate, endDate) => {
    const s = clone(startDate);
  // Temp variable for updating a[]
    let nS = clone(startDate);
    const e = clone(endDate);
    const a = [];

    a.push(nS);

    while (s <= e) {
      console.log(nS);
      nS = new Date(s.setDate(
        s.getDate() + 1
      ));
      a.push(nS);
    }

    return a;
  };


  getAllHours = (startHour, endHour) => {
    let sh = +startHour;
    const eh = +endHour;
    const a = [];
    while (sh <= eh) {
      a.push(sh);
      sh += 1;
    }
    return a;
  };


  getBlockEnabled = () => {
    const blockEnabled = {};
    const dateRange = this.getAllDays(this.state.startDate, this.state.endDate);
    const hourRange = this.getAllHours(this.state.startHour, this.state.endHour);
    hourRange.forEach(hour => {
      dateRange.filter(date => (this.state.daysSelected[date.getDay()]))
      .forEach(date => {
        const timeBlock = `${this.yyyymmdd(date)}-${this.hh(hour)}`;
        blockEnabled[timeBlock] = true;
      });
    });
    return blockEnabled;
  }


  hh = hour => ((hour > 9 ? '' : '0') + hour);


  yyyymmdd = date => {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    return [date.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('-');
  };


  handleEventNameChange = (event, newValue) => {
    this.setState({ eventName: newValue });
  }


  handleDayChange = event => {
    const newDaysSelected = this.state.daysSelected;
    const day = parseInt(event.target.id, 10);
    newDaysSelected[day] = !newDaysSelected[day];
    this.setState({ daysSelected: newDaysSelected });
  }

  handleStartDateChange = (event, date) => {
    this.setState({ startDate: date });
  }

  handleEndDateChange = (event, date) => {
    this.setState({ endDate: date });
  }

  handleBlockChange = event => {
    const newBlockChecked = this.state.blockChecked;
    newBlockChecked[event.target.id] = !newBlockChecked[event.target.id];
    this.setState({ blockChecked: newBlockChecked });
  }

  handleEmptyEventName = event => {
    const errorText = event.target.value === '' ? 'Required' : '';
    this.setState({ errorText });
  }

  handleSubmit = async () => {
    const blockEnabled = this.getBlockEnabled();
    const eventTime = {};
    let empty = true;
    Object.getOwnPropertyNames(blockEnabled).forEach(key => {
      const available = this.state.blockChecked[key];
      if (available) {
        eventTime[key] = this.state.blockChecked[key];
        empty = false;
      }
    });
    if (this.state.eventName === '') {
      this.setState({ errorText: 'Required' });
      return;
    }
    const data = {
      eventName: this.state.eventName,
      startDate: this.yyyymmdd(this.state.startDate),
      endDate: this.yyyymmdd(this.state.endDate),
      startHour: this.state.startHour,
      endHour: this.state.endHour,
      eventTime,
      userData: []
    };
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let res;
    let json;
    try {
      res = await fetch(`/api/form`,
        {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data),
        });
      json = await res.json();
    } catch (err) {
      console.log(err);
    }

    const eventUrl = json.eventUrl;
    const adminUrl = json.adminUrl;
    window.location.href = `form/${eventUrl}/links/${adminUrl}`;
  }

  render() {
    return (
      <div className="container col-md-12">
        <div>
          <TextField
            onChange={this.handleEventNameChange}
            onBlur={this.handleEmptyEventName}
            id="eventName"
            hintText="Enter Event Name"
            floatingLabelText="Event Name"
            errorText={this.state.errorText}
            value={this.state.eventName}
          />
        </div>
        <div style={optionsStyle}>
          <DatePicker
            onChange={this.handleStartDateChange}
            floatingLabelText="Start Date"
            defaultDate={this.state.startDate}
          />
          <DatePicker
            onChange={this.handleEndDateChange}
            floatingLabelText="End Date"
            defaultDate={this.state.endDate}
          />
        </div>
        <div className="form-group">
          <label htmlFor="day">Select Days</label>
          {this.props.days.map((day, idx) => (
            <div className="form-check" key={idx}>
              <Checkbox
                id={idx}
                label={day}
                checked={this.state.daysSelected[idx]}
                onCheck={this.handleDayChange}
              />
            </div>)
          )}
        </div>
        <EventTimeBlock
          startDate={this.yyyymmdd(this.state.startDate)}
          endDate={this.yyyymmdd(this.state.endDate)}
          startHour={this.state.startHour}
          endHour={this.state.endHour}
          daysSelected={this.state.daysSelected}
          blockChecked={this.state.blockChecked}
          blockEnabled={this.getBlockEnabled()}
          handleBlockChange={this.handleBlockChange}
          checkable
        />
        <div className="row">
          <RaisedButton
            label="Submit"
            primary
            onClick={this.handleSubmit}
            disabled={this.state.errorText === 'Required'}
          />
        </div>
        <br />
      </div>
    );
  }
}

CreateEventPage.defaultProps = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday']
};

export default CreateEventPage;
