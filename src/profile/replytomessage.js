import React, { Component } from "react";
import axios from "axios";

import history from "../utils/history";
import { connect } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class ReplyToMessage extends Component {
  handleSubmit = event => {
    event.preventDefault();
    const message_to_username = this.props.location.state.props.message
      .message_sender;
    const message_from_username = this.props.db_profile[0].username;
    const message_title = event.target.title.value;
    const message_body = event.target.body.value;

    const data = {
      message_sender: message_from_username,
      message_to: message_to_username,
      title: message_title,
      body: message_body
    };
    axios
      .post("/api/post/messagetodb", data)
      .then(res => console.log(res))
      .catch(err => console.log(err))
      .then(
        setTimeout(() => {
          history.replace("/");
        }, 400)
      );
  };
  render() {
    return (
      <div>
        <h2>Message : </h2>
        <div className="FlexColumn">
          <div>
            <p>{this.props.location.state.props.message.message_title}</p>
          </div>
          <div>
            <p>{this.props.location.state.props.message.message_body}</p>
          </div>
          <div>
            <p>By : {this.props.location.state.props.message.message_sender}</p>
          </div>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <TextField id="title" label="title" margin="normal" />
            <br />
            <TextField id="body" multiline rows="4" margin="normal" />
            <br />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <button onClick={() => history.replace("/")}>Cancel</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    db_profile: state.auth_reducer.db_profile
  };
};

export default connect(mapStateToProps)(ReplyToMessage);
