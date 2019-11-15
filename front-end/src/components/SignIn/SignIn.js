import React, { Component } from "react";
import Cookie from "js-cookie";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  handleErrors = response => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  logInUser = evt => {
    const data = new FormData(evt.target);
    console.log(data);
    fetch("http://localhost:5000/api/v1/login", {
      method: "POST",
      body: data
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        alert(json.message);
        Cookie.set("access-token", json.access_token);
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

  onChange = evt => {
    /*
      Because we named the inputs to match their
      corresponding values in state, it's
      super easy to update the state
    */
    this.setState({ [evt.target.name]: evt.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    return (
      <div>
        <h4>Login</h4>
        <form onSubmit={this.handleSubmit}>
          {error && (
            <h3 data-test="error" onClick={this.dismissError}>
              <button onClick={this.dismissError}>✖</button>
              {error}
            </h3>
          )}
          <label>Email </label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={this.onChange}
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.onChange}
          />

          <input type="submit" value="Log In" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default SignIn;
