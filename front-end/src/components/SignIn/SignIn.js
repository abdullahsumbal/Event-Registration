import React, { Component } from "react";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: ""
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
    console.log(this.state.error);
    return this.setState({ error: "" });
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
