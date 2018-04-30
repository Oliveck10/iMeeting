import React, { Component } from 'react';
import 'babel-polyfill';
import EventTimeBlock from './EventTimeBlock';
import FlatButton from 'material-ui/FlatButton';
// import fetch from 'isomorphic-fetch';
import rd3 from 'rd3';

// const peopleCount = (userdata.available = true) . length
// const totalCount = usedata.length

const PollChart = rd3.PieChart;

class PollResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0, // count = (userdata.available = true) . length
      total: 10, // total = usedata.length
      bgColor: 'white',
      open: false,
      mouseTimeBlock: '',
      userData: []
    };
  }

  // Need to fix to fit db schema
  componentDidMount() {
    fetch(`/api/form/${this.props.params.eventUrl}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          eventUrl: json.eventUrl,
          startDate: json.startDate,
          endDate: json.endDate,
          startHour: parseInt(json.startHour, 10),
          endHour: parseInt(json.endHour, 10),
          blockEnabled: json.eventTime,
          userData: json.userData
        });
      });
  }

  handleCountChange = e => {
    this.setState({
      count: e.target.value,
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleBlockMouseOver = timeBlock => {
    this.setState({ mouseTimeBlock: timeBlock });
  };

  handleBlockMouseLeave = () => {
    console.log("blockMouseLeave");
    this.setState({ mouseTimeBlock: '' });
  };

  count2color = (count, total) => {
    const colorPcg = count / total;

    const redPcg = Math.round(255 * (((1 - colorPcg) * 10) / 10));
    const greenPcg = Math.round(255 * ((colorPcg * 10) / 10));

    let redResult = redPcg.toString(16);
    let greenResult = greenPcg.toString(16);

    if (redResult === '0') {
      redResult = '00';
    }
    if (greenResult === '0') {
      greenResult = '00';
    }

    const colorResult = `#${redResult}${greenResult}00`;
    return colorResult;
  };


  render() {
// Color change section
    const colorPcg = this.state.count / this.state.total;

    // Math.round usage: To turn float into restricted float
    const redPcg = Math.round(255 * (((1 - colorPcg) * 10) / 10));
    const greenPcg = Math.round(255 * ((colorPcg * 10) / 10));

    let redResult = redPcg.toString(16);
    let greenResult = greenPcg.toString(16);

    if (redResult === '0') {
      redResult = '00';
    }
    if (greenResult === '0') {
      greenResult = '00';
    }

// TODO: filter: brightness(1~100%)

// To concatanate the color schema
    const colorResult = `#${redResult}${greenResult}00`;


// testing color code
/*
    console.log(redResult);
    console.log(greenResult);
    console.log(colorResult);
*/
    const btnstyle = {
      backgroundColor: colorResult,
    };


// Chart section
    const chartData = [
      { label: 'Come', value: colorPcg * 100 },
      { label: 'Not Come', value: 100 - (colorPcg * 100) },
    ];

    return (
      <div className="pollResult container">
        <h1>Results</h1>
        <div className="row">
          <div className="col col-md-2">
            {this.state.userData.map(user => {
              let available = !user.availableTime[this.state.mouseTimeBlock];
              if (this.state.mouseTimeBlock === '') {
                available = true;
              }
              return (
                <FlatButton
                  label={user.userName}
                  disabled={available}
                />);
            })}
          </div>
          <div className="col col-md-10">
            <EventTimeBlock
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              startHour={this.state.startHour}
              endHour={this.state.endHour}
              blockEnabled={this.state.blockEnabled}
              handleBlockChange={this.handleBlockChange}
              open={this.state.open}
              handleOpen={this.handleOpen}
              handleClose={this.handleClose}
              handleMouseOver={this.handleBlockMouseOver}
              handleMouseLeave={this.handleBlockMouseLeave}
              userData={this.state.userData}
            />
          </div>
        </div>
        <hr />
      </div>
    );
  }

}


export default PollResultPage;
