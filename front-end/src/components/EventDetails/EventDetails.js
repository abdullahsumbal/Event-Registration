import React, { Component } from "react";
class EventDetails extends Component {
  state = { event: {}, users: [] };

  controller = new AbortController();

  componentWillMount() {
    // Frist:
    this.fetchEventDetails();

    // Second Way
    // Promise.all([
    //   fetch(this.props.uri_event, {
    //     signal: this.controller.signal
    //   }),
    //   fetch(this.props.uri_users, {
    //     signal: this.controller.signal
    //   })
    // ])
    //   .then(([res1, res2]) =>
    //     Promise.all([this.handleErrors(res1), this.handleErrors(res2)])
    //   )
    //   .then(([data1, data2]) =>
    //     this.setState({
    //       event: data1.event[0],
    //       users: data2.users
    //     })
    //   );
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  handleErrors = response => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  };

  fetchRegisteredUsers = () => {
    fetch(this.props.uri_users, {
      signal: this.controller.signal
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        this.setState({ users: json.users });
      })
      // handle fetch Promise error
      .catch(error => {
        console.log(error);
        // alert(error.message);
      });
  };

  fetchEventDetails = () => {
    fetch(this.props.uri_event, {
      signal: this.controller.signal
    })
      // handle network err/success
      .then(this.handleErrors)
      // use response of network on fetch Promise resolve
      .then(json => {
        this.setState({ event: json.event[0] });
        this.fetchRegisteredUsers();
      })
      // handle fetch Promise error
      .catch(error => {
        console.log(error);
        // alert(error.message);
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
    return (
      <div>
        <hr />
        Name: {eventname} <br />
        Description: {description} <br />
        Start Date: {startdate} <br />
        End Date: {enddate}
        <br />
        Picture: {picture} <br />
        Users:
        {this.state.users.map(user => (
          <div key={user.userid}>{user.firstname + " " + user.lastname}</div>
        ))}
        <hr />
      </div>
    );
  }
}

export default EventDetails;
