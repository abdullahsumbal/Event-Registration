import React, { Component } from "react";
import axios from "axios";

class CreateEvent extends Component {
  state = {
    eventname: "",
    description: "",
    picture: "",
    startdate: "",
    enddate: "",
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

  sendEvent = evt => {
    const data = new FormData(evt.target);
    fetch("http://localhost:5000/api/v1/event", {
      method: "POST",
      body: data
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        alert(json.message);
      })
      // handle fetch Promise error
      .catch(error => {
        console.log(error);
        alert(error.message);
      });
  };

  // Some validaton for fields.
  // Something is wrong update error state
  handleSubmit = evt => {
    evt.preventDefault();
    const {
      eventname,
      description,
      picture,
      startdate,
      enddate,
      error
    } = this.state;

    if (!eventname) {
      return this.setState({ error: "Event Name is required" });
    }

    if (!description) {
      return this.setState({ error: "Description is required" });
    }

    if (!picture) {
      return this.setState({ error: "Picture is required" });
    }

    if (!startdate) {
      return this.setState({ error: "Start Date is required" });
    }

    if (!enddate) {
      return this.setState({ error: "End Date is required" });
    }

    this.setState({ error: "" });
    // send post request
    this.sendEvent(evt);
  };

  onChange = evt => {
    // Because we named the inputs to match their
    // corresponding values in state, it's
    // super easy to update the state
    this.setState({ [evt.target.name]: evt.target.value });
  };

  render() {
    const {
      eventname,
      description,
      picture,
      startdate,
      enddate,
      error
    } = this.state;
    // NOTE: I use data-attributes for easier E2E testing
    // but you don't need to target those (any css-selector will work)
    return (
      <div>
        <h4>Create Event</h4>
        <form onSubmit={this.handleSubmit}>
          {this.state.error && (
            <h3 data-test="error" onClick={this.dismissError}>
              <button onClick={this.dismissError}>✖</button>
              {this.state.error}
            </h3>
          )}
          <label>Name: </label>
          <input
            type="text"
            name="eventname"
            value={eventname}
            onChange={this.onChange}
          />
          <br />
          <label>Description: </label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={this.onChange}
          />
          <br />
          <label> Picture: </label>
          <input
            type="text"
            name="picture"
            value={picture}
            onChange={this.onChange}
          />
          <br />
          <label>Start Date: </label>
          <input
            type="date"
            name="startdate"
            value={startdate}
            onChange={this.onChange}
          />
          <br />
          <label>End Date: </label>
          <input
            type="date"
            name="enddate"
            value={enddate}
            onChange={this.onChange}
          />

          <input type="submit" value="Create Event" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default CreateEvent;
