import React, { Component } from "react";

// const Event = ({ event }) => {
//   const { setup, punchline } = event;
//   return (
//     <div>
//       {setup} {punchline}
//     </div>
//   );
// };

class Event extends Component {
  state = { showDetails: false };

  toggleDetails = () => {
    // may be I can fetch details here
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    const { id, setup, punchline } = this.props.event;
    let addDetails = this.state.showDetails ? (
      <div>
        <hr />
        Name: {id} <br />
        Event Name: yolo
        <hr />
      </div>
    ) : (
      <div></div>
    );
    return (
      <>
        <div onClick={this.toggleDetails}>
          {setup} {punchline}
        </div>
        {addDetails}
      </>
    );
  }
}

class Events extends Component {
  state = { events: [], showEvent: -1 };

  // better practice to handle async code in
  // in this function
  componentDidMount() {
    // fetch return promises
    this.fetchEvents();
  }

  handleErrors = response => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  fetchEvents = () => {
    fetch("https://official-joke-api.appspot.com/random_ten")
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        console.log(json);
        this.setState({ events: json });
      })
      // handle fetch Promise error
      .catch(error => {
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
          <Event key={event.id} event={event} />
        ))}
        {showDetail}
      </div>
    );
  }
}

export default Events;
