import React, { Component } from "react";
import axios from "axios";

import * as ACTIONS from "../store/actions/actions";
import history from "../utils/history";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class ShowMessages extends Component {
  state = {
    messages: [],
    delete_message_id: 0
  };
  componentDidMount() {
    const username = this.props.db_profile[0].username;
    axios
      .get("/api/get/usermessages", {
        params: { username: username }
      })
      .then(res => this.props.set_user_messages(res.data))
      .then(() => this.add_message_to_state(this.props.user_messages))
      .catch(err => console.log(err));
  }

  add_message_to_state = messages => {
    console.log(messages);
    this.setState({ messages: [...messages] });
  };

  delete_from_state = mid => {
    this.setState({ delete_message_id: mid });
    const newArr = this.state.messages.filter(com => com.mid !== mid);
    setTimeout(() => this.setState({ messages: newArr }), 2000);
  };

  DeleteMessage = mid => {
    axios
      .delete("/api/delete/usermessage", { params: { mid: mid } })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    this.delete_from_state(mid);
  };

  RenderMessages = props => (
    <TableRow>
      <TableCell>
        <p> From : {props.message.message_sender}</p>
        <p> Title : {props.message.message_title}</p>
        <p> Body : {props.message.message_body}</p>
        <small>{props.message.date_created}</small>
        <p> mid : {props.message.mid}</p>
        <Link to={{ pathname: "/replytomessage/", state: { props } }}>
          <button>Replay</button>
        </Link>

        <button onClick={() => this.DeleteMessage(props.message.mid)}>
          Delete
        </button>
        <br />
        <button onClick={() => history.goBack()}>Cancel</button>
      </TableCell>
    </TableRow>
  );

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div>
        <div className="FlexRow">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Messages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.messages
                ? this.state.messages.map(message => (
                    <this.RenderMessages key={message.mid} message={message} />
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    db_profile: state.auth_reducer.db_profile,
    user_messages: state.user_reducer.UserMessages
  };
};

const mapDispatchToProps = dispatch => {
  return {
    set_user_messages: message => dispatch(ACTIONS.set_user_messages(message))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowMessages);
