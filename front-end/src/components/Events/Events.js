import React, { Component } from "react";
import EventDetails from "../EventDetails/EventDetails";
import Cookie from "js-cookie";

class Event extends Component {
  state = { showDetails: false };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  handleErrors = response => {
    // console.log(response);
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  registerUser = () => {
    const token = Cookie.get("access-token")
      ? Cookie.get("access-token")
      : null;
    fetch(this.props.event.uri_register, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      }
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

  render() {
    const { eventname, uri_event, uri_users } = this.props.event;
    let renderEventDetails = this.state.showDetails ? (
      <EventDetails uri_event={uri_event} uri_users={uri_users} />
    ) : null;

    // render EventDetails only when user clicks on the event
    return (
      <div style={{ marginBottom: 10 }}>
        <div onClick={this.toggleDetails}>
          {this.props.index + 1 + ". " + eventname}
        </div>
        <button onClick={this.registerUser}> Register</button>
        {renderEventDetails}
        <hr />
      </div>
    );
  }
}

class Events extends Component {
  state = { events: [], showEvent: -1 };
  controller = new AbortController();

  // better practice to handle async code in
  // in this function
  componentDidMount() {
    // fetch return promises
    this.fetchEvents();
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  handleErrors = response => {
    // console.log(response);
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  fetchEvents = () => {
    fetch("http://localhost:5000/api/v1/event", {
      signal: this.controller.signal
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        this.setState({ events: json.events });
      })
      // handle fetch Promise error
      .catch(error => {
        alert(error.message);
      });
  };

  render() {
    return (
      <div>
        <h4>Event Listing</h4>
        {this.state.events.map((event, index) => (
          <Event key={index} index={index} event={event} />
        ))}
      </div>
    );
  }
}

export default Events;
