import React, { Component } from "react";
import EventDetails from "../EventDetails/EventDetails";

class Event extends Component {
  state = { showDetails: false };

  toggleDetails = () => {
    // may be I can fetch details here
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    const { eventname, uri } = this.props.event;
    return (
      <>
        <div onClick={this.toggleDetails}>{eventname}</div>
        <EventDetails showDetails={this.state.showDetails} uri={uri} />
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
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  fetchEvents = () => {
    fetch("http://localhost:5000/api/events", {
      signal: this.controller.signal
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        console.log(json);
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
          <Event key={event.uri} event={event} />
        ))}
        {showDetail}
      </div>
    );
  }
}

export default Events;
