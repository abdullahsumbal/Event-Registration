import React, { Component } from "react";
import Events from "./Events/Events";
import ErrorHandler from "./ErrorHandler/ErrorHandler";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";
import Header from "./Header/Header";

class App extends Component {
  render() {
    return (
      <Router history={createHistory()}>
        <Switch>
          <ErrorHandler>
            <Route
              exact
              path="/"
              render={() => (
                <Header>
                  <Events />
                </Header>
              )}
            ></Route>
            <Route
              exact
              path="/create"
              render={() => (
                <Header>
                  <Events />
                </Header>
              )}
            ></Route>
          </ErrorHandler>
        </Switch>
      </Router>
    );
  }
}

export default App;
