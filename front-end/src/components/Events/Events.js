import React, { Component } from "react";
import EventDetails from "../EventDetails/EventDetails";

class Event extends Component {
  state = { showDetails: false };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  registerUser = () => {
    fetch(this.props.event.uri_register + "/3", {
      method: "POST"
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {})
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
      <>
        <div onClick={this.toggleDetails}>{eventname}</div>
        <button onClick={this.registerUser}> Register</button>
        {renderEventDetails}
      </>
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
        console.log(error);
        alert(error.message);
      });
  };

  render() {
    // Ask user to select an event to show details
    // by default I am not showing any details.
    let showDetail = <div>No Event</div>;
    if (this.state.showEvent < 0) {
      showDetail = <div>Select an Event to Show Detail</div>;
    } else {
      showDetail = <div>Showing Details for {this.state.showEvent}</div>;
    }
    return (
      <div>
        {this.state.events.map(event => (
          <Event key={event.eventid} event={event} />
        ))}
        {showDetail}
      </div>
    );
  }
}

export default Events;
