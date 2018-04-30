import React from 'react';
import { render } from 'react-dom';

import { Router, Route, browserHistory } from 'react-router';
import './bootstrap/css/bootstrap.min.css';
import './bootstrap/css/bootstrap-theme.min.css';
import HomePage from './components/HomePage';
import CreateEventPage from './components/CreateEventPage';
import UserFormFillingPage from './components/UserFormFillingPage';
import PollResultPage from './components/PollResultPage';
import JumpPage from './components/JumpPage';
import UserJumpPage from './components/UserJumpPage';
import UserUpdateFormPage from './components/UserUpdateFormPage';
import InvalidUrlPage from './components/InvalidUrlPage';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

injectTapEventPlugin();

const validateUrl = async (nextState, replace, callback) => {
  let res;
  let code;
  try {
    const url = `/api${nextState.location.pathname}`;
    res = await fetch(url);
    code = res.status;
    if (code === 404) {
      replace({ pathname: '/invalidUrl' });
    }
    callback();
  } catch (err) {
    callback(err);
  }
};

const App = () => (
  <MuiThemeProvider>
    <div>
      <AppBar
        title="iMeeting"
        showMenuIconButton={false}
      />
      <Router history={browserHistory}>
        <Route path="/" component={HomePage} />
        <Route path="/invalidUrl" component={InvalidUrlPage} />
        <Route path="/create" component={CreateEventPage} />
        <Route path="/form/:eventUrl" component={UserFormFillingPage} onEnter={validateUrl} />
        <Route path="/form/:eventUrl/links/:adminUrl" component={JumpPage} onEnter={validateUrl} />
        <Route path="/form/:eventUrl/thanks/:userUrl" component={UserJumpPage} onEnter={validateUrl} />
        <Route path="/form/:eventUrl/update/:userUrl" component={UserUpdateFormPage} onEnter={validateUrl} />
        <Route path="/result/:eventUrl" component={PollResultPage} />
      </Router>
    </div>
  </MuiThemeProvider>
);

render(
  <App />,
  document.getElementById('root'),
);
