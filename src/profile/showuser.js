import React, { Component } from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import * as ACTIONS from "../store/actions/actions";
import axios from "axios";
import moment from "moment";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

class ShowUser extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const username = this.props.location.state.post.post.author;
    console.log(username);

    axios
      .get("/api/get/otheruserprofilefromdb", {
        params: { username: username }
      })
      .then(res => this.props.set_profile(res.data))
      .catch(err => console.log(err));
    axios
      .get("/api/get/otheruserposts", { params: { username: username } })
      .then(res => this.props.set_db_posts(res.data))
      .catch(err => console.log(err));
    window.scrollTo({ top: 0, left: 0 });
  }
  RenderPosts = post => {
    return (
      <div className="CardStyles">
        <Card
          style={{
            width: "500px",
            height: "200px",
            marginBottom: "10px",
            paddingBottom: "80px"
          }}
        >
          <CardHeader
            title={
              <Link
                to={{ pathname: "/post/" + post.post.pid, state: { post } }}
              >
                {post.post.title}
              </Link>
            }
            subheader={
              <div className="FlexColumn">
                <div className="FlexRow">
                  {moment(post.post.date_created).format(
                    "MMM DD, YYYY | h:mm a"
                  )}
                  <br />
                  By : {post.post.author}
                </div>
                <div className="FlexRow">
                  <i className="material-icons">thumb_up</i>
                  <div className="notification-num-posts">
                    {post.post.likes}
                  </div>
                </div>
              </div>
            }
          />
          {/* <br /> */}
          <CardContent>
            <span style={{ overflow: "hidden" }}>{post.post.body}</span>
          </CardContent>
        </Card>
      </div>
    );
  };

  RenderProfile = profile => {
    console.log(profile);
    return (
      <div>
        <div className="FlexRow">
          <h1>{profile.profile.username}</h1>
        </div>
        <div>
          <Link to={{ pathname: "/sendmessage/", state: { profile } }}>
            <Button variant="contained" color="primary" type="submit">
              Send Message
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <div className="FlexRow">
          {this.props.user_profile ? (
            <this.RenderProfile profile={this.props.user_profile[0]} />
          ) : (
            null
          )}
        </div>
        <div>
          <h3>Latest activity</h3>
          <div>
            {this.props.user_posts
              ? this.props.user_posts.map(post => {
                  return (
                    <div>
                      <this.RenderPosts key={post.pid} post={post} />
                      <br />
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user_profile: state.user_reducer.OtherUserDBProfile,
    user_posts: state.user_reducer.db_other_user_posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    set_profile: profile =>
      dispatch(ACTIONS.set_other_user_db_profile(profile)),
    set_db_posts: posts => dispatch(ACTIONS.get_other_user_db_posts(posts))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowUser);
