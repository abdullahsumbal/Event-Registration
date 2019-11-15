import React, { Component } from "react";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  logInUser = evt => {
    const data = new FormData(evt.target);
    fetch("http://localhost:5000/api/v1/login", {
      method: "POST",
      body: data
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        // TODO: if okay go something
      })
      // handle fetch Promise error
      .catch(error => {
        alert(error.message);
      });
  };

  dismissError = () => {
    this.setState({ error: "" });
  };

  handleSubmit = evt => {
    evt.preventDefault();

    if (!this.state.email) {
      return this.setState({ error: "Email is required" });
    }

    if (!this.state.password) {
      return this.setState({ error: "Password is required" });
    }

    this.setState({ error: "" });
    this.logInUser(evt);
  };

  handleUserChange = evt => {
    this.setState({
      email: evt.target.value
    });
  };

  handlePassChange = evt => {
    this.setState({
      password: evt.target.value
    });
  };

  render() {
    // NOTE: I use data-attributes for easier E2E testing
    // but you don't need to target those (any css-selector will work)
    return (
      <div>
        <h4>Login</h4>
        <form onSubmit={this.handleSubmit}>
          {this.state.error && (
            <h3 data-test="error" onClick={this.dismissError}>
              <button onClick={this.dismissError}>✖</button>
              {this.state.error}
            </h3>
          )}
          <label>Email </label>
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleUserChange}
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handlePassChange}
          />

          <input type="submit" value="Log In" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default SignIn;
