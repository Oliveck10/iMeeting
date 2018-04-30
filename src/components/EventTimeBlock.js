import React, { Component, PropTypes } from 'react';
import 'babel-polyfill';
import '../css/EventTimeBlock.css';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn } from 'material-ui/Table';

class EventTimeBlock extends Component {
  static propTypes = {
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    startHour: PropTypes.number.isRequired,
    endHour: PropTypes.number.isRequired,
    handleBlockChange: PropTypes.func,
    blockEnabled: PropTypes.object,
    blockChecked: PropTypes.object,
    daysSelected: PropTypes.array,
    checkable: PropTypes.bool,
    open: PropTypes.bool,
    handleOpen: PropTypes.func,
    handleClose: PropTypes.func,
    handleMouseOver: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    userData: PropTypes.array
  };

  getAllDays = (startDate, endDate) => {
    const s = new Date(startDate);
  // Temp variable for updating a[]
    let nS = new Date(startDate);
    const e = new Date(endDate);
    const a = [];

    while (s <= e) {
      a.push(nS);
      nS = new Date(s.setDate(
        s.getDate() + 1
      ));
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

  yyyymmdd = date => {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    return [date.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd,
    ].join('-');
  };

  hh = hour => ((hour > 9 ? '' : '0') + hour);

  render() {
    const dateRange = this.getAllDays(this.props.startDate, this.props.endDate);
    const hourRange = this.getAllHours(this.props.startHour, this.props.endHour);



    const count2color = (count, total) => {
      const colorPcg = count / total;
      let labelColor = '#ffffff';
      const redPcg = Math.round(255 * (((1 - colorPcg) * 10) / 10));

      if (redPcg > 128) labelColor = '#000000';

      let redResult = redPcg.toString(16);

      if (redResult === '0') {
        redResult = '00';
      }

      const bgColor = `#${redResult}${redResult}${redResult}`;
      return { bgColor, labelColor };
    };


    const element = timeBlock => {
      const userTimeTable = (timeBlock, userData) => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {userData.map(user => {
              const status = user.availableTime[timeBlock];
              return (
                <TableRow key={user.userUrl}>
                  <TableRowColumn>{user.userName}</TableRowColumn>
                  <TableRowColumn>{(status === true ? 'available' : 'not available')}</TableRowColumn>
                </TableRow>);
            }
            )}
          </TableBody>
        </Table>
      );
      const actions = [
        <FlatButton
          label="Ok"
          primary
          keyboardFocused
          onTouchTap={this.props.handleClose}
        />,
      ];
      const count = this.props.userData.filter(user => (
        user.availableTime[timeBlock])).length;
      return (this.props.checkable ?
      (<Checkbox
        id={timeBlock}
        label={timeBlock}
        type="checkbox"
        checked={this.props.blockChecked[timeBlock] || false}
        onCheck={e => this.props.handleBlockChange(e)}
      />) :
      (<div>
        <RaisedButton
          label={timeBlock}
          onTouchTap={() => this.props.handleOpen()}
          labelColor={count2color(count, this.props.userData.length).labelColor}
          backgroundColor={count2color(count, this.props.userData.length).bgColor}          
        />
      </div>));
    };

    return (
      <table className="time-table">
        <tbody>{
          hourRange.map(hour => (
            <tr
              key={hour}
              className="spaceUnder"
            >{dateRange.filter(date => (this.props.daysSelected[date.getDay()]))
              .map(date => {
                const timeBlock = `${this.yyyymmdd(date)}-${this.hh(hour)}`;
                const hourable = this.props.blockEnabled[timeBlock];
                return (hourable ?
                  (<td
                    key={date}
                    onMouseOver={() => this.props.handleMouseOver(timeBlock)}
                    onMouseLeave={() => this.props.handleMouseLeave()}
                    className="slot no-line-break space-at-right"
                  >{element(timeBlock)}
                  </td>) : (
                    <td
                      key={date}
                      className="slot no-line-break space-at-right"
                    >&nbsp;
                    </td>)
                );
              })}</tr>
            ))
        }</tbody>
      </table>
    );
  }
}

EventTimeBlock.defaultProps = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'],
  daysSelected: [1, 2, 3, 4, 5, 6, 7],
  open: false,
  handleOpen: () => {},
  handleClose: () => {},
  userData: [],
  handleMouseOver: () => {},
  handleMouseLeave: () => {}
};

export default EventTimeBlock;
