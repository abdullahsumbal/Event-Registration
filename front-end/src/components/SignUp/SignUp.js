import React, { Component } from "react";
import axios from "axios";

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    error: ""
  };

  dismissError = () => {
    this.setState({ error: "" });
  };

  handleErrors = response => {
    console.log(response);
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  fetchEvents = evt => {
    const data = new FormData(evt.target);
    fetch("http://localhost:5000/api/v1/user", {
      method: "POST",
      body: data
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        // this.setState({ events: json.events });
      })
      // handle fetch Promise error
      .catch(error => {
        console.log(error);
        alert(error.message);
      });
  };

  handleSubmit = evt => {
    evt.preventDefault();

    if (!this.state.email) {
      return this.setState({ error: "Email is required" });
    }

    if (!this.state.password) {
      return this.setState({ error: "Password is required" });
    }

    if (!this.state.lastname) {
      return this.setState({ error: "Last Name is required" });
    }

    if (!this.state.firstname) {
      return this.setState({ error: "First Name is required" });
    }

    this.setState({ error: "" });
    // send post request
    this.fetchEvents(evt);
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
    const { email, password, firstname, lastname, error } = this.state;
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
            name="email"
            value={email}
            onChange={this.onChange}
          />
          <br />
          <label>Password</label>
          <input
            type="text"
            name="password"
            value={password}
            onChange={this.onChange}
          />
          <br />
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            value={lastname}
            onChange={this.onChange}
          />
          <br />
          <label>First Name</label>
          <input
            type="text"
            name="firstname"
            value={firstname}
            onChange={this.onChange}
          />

          <input type="submit" value="Log In" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default SignUp;
