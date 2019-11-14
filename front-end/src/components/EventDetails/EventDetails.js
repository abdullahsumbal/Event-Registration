import React, { Component } from "react";
class EventDetails extends Component {
  state = { event: {} };

  controller = new AbortController();

  componentWillReceiveProps(nextProps) {
    // fetch return promises
    if (nextProps.showDetails) {
      this.fetchEventDetails();
    }
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  handleErrors = response => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  fetchEventDetails = () => {
    fetch(this.props.uri, { signal: this.controller.signal })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        console.log(json.event);
        this.setState({ event: json.event[0] });
      })
      // handle fetch Promise error
      .catch(error => {
        console.log(error);
        alert(error.message);
      });
  };
  render() {
    const {
      eventname,
      description,
      startdate,
      enddate,
      picture
    } = this.state.event;
    return this.props.showDetails ? (
      <div>
        <hr />
        Name: {eventname} <br />
        Description: {description} <br />
        Start Date: {startdate} <br />
        End Date: {enddate}
        <br />
        Picture: {picture}
        <hr />
      </div>
    ) : (
      <div></div>
    );
  }
}

export default EventDetails;
