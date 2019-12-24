import React, { Component } from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import * as ACTIONS from "../store/actions/actions";
import axios from "axios";
import history from "../utils/history"

import moment from "moment";

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      post_id: null
    };
  }
  componentDidMount() {
    axios
      .get("/api/get/allposts")
      .then(res => {
        console.log(res.data);
        this.props.set_posts(res.data);
        console.log("current store state", this.props.posts);
      })
      .catch(err => console.log(err));
  }

  handleClickOpen = (pid) => {
    this.setState({ open: true, post_id: pid })
  }
  handleClickClose = () => {
    this.setState({ open: false, post_id: null })
  }

  handleSearch = event => {
    const search_query = event.target.value;

    axios
      .get("/api/get/searchpost", {
        params: { search_query: search_query }
      })
      .then(res => this.props.posts_success(res.data))
      .catch(err => console.log(err));
  };

  deletePost = () => {
    const post_id = this.state.post_id

    axios.delete("/api/delete/postcomments", { data: { post_id: post_id } })
      .then(() => {
        axios.delete("/api/delete/post", { data: { post_id: post_id } }).then(res => console.log(res))
      })
      .catch(err => console.log(err))
      .then(() => this.handleClickClose())
      .then(() => history.replace("/"))
  }

  RenderPosts = post => {
    return (
      <TableRow>
        <TableCell>
          <Link to={{ pathname: "/post/" + post.post.pid, state: { post } }}>
            <h3>{post.post.title}</h3>
          </Link>
          <p>{post.post.body}</p>
          <small>{post.post.date_created}</small>
          <p> By : {post.post.author}</p>
          <button>
            <Link to={{ pathname: "/editpost/" + post.post.pid, state: { post } }}> Edit </Link>
          </button>
          <button onClick={() => this.handleClickOpen(post.post.pid)}>
            Delete
            </button>
        </TableCell>
      </TableRow>
    );
  };

  render() {
    console.log(this.props.posts);
    return (
      <div>
        <div
          style={{ opacity: this.state.opacity, transition: "opacity 2s ease" }}>
          <br />
          <Link to="/addpost">
            <Button color="primary" variant="contained">
              Add Post
              </Button>
          </Link>
        </div>

        <div>
          <TextField
            id="search"
            label="Search"
            margin="normal"
            onChange={this.handleSearch}
          />
        </div>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Search Results :
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.search_posts ? (
                [
                  this.props.search_posts.map(post => (
                    <this.RenderPosts key={post.pid} post={post} />
                  ))
                ]
              ) : null}
            </TableBody>
          </Table>
        </div>
        <h1>All Posts</h1>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Search Results :
                  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.posts ? (
              [this.props.posts.map(post => (
                <this.RenderPosts key={post.pid} post={post} />
              ))]
            ) : null}
          </TableBody>
        </Table>
        <Dialog
          open={this.state.open}
          onClose={this.handleClickClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-discription"
        >
          <DialogTitle id="alert-dialog-title"> Confirm Delete ? </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-discription"> Deleting Post </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.deletePost()}>Agree</Button>
            <Button onClick={() => this.handleClickClose()}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts_reducer.posts,
    is_authenticated: state.auth_reducer.is_authenticated,
    search_posts: state.posts_reducer.search_posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    set_posts: posts => dispatch(ACTIONS.fetch_db_posts(posts)),
    // for search functionality
    posts_success: posts => dispatch(ACTIONS.fetch_search_posts(posts)),
    posts_failure: () => dispatch(ACTIONS.remove_search_posts())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts);



// <Card
// style={{
//   width: "500px",
//   height: "200px",
//   marginBottom: "10px",
//   paddingBottom: "80px"
// }}
// >
// <CardHeader
//   title={
//     <Link
//       to={{ pathname: "/post/" + post.post.pid, state: { post } }}
//     >
//       {post.post.title}
//     </Link>
//   }
//   subheader={
//     <div className="FlexColumn">
//       <div className="FlexRow">
//         {moment(post.post.date_created).format(
//           "MMM DD, YYYY | h:mm a"
//         )}
//         <br />
//         <Link
//           style={{ paddingLeft: "5px", textDecoration: "none" }}
//           to={{
//             pathname: "/user/" + post.post.author,
//             state: { post }
//           }}
//         >
//           By : {post.post.author}
//         </Link>
//       </div>
//       <div className="FlexRow">
//         <i className="material-icons">thumb_up</i>
//         <div className="notification-num-posts">
//           {post.post.likes}
//         </div>
//       </div>
//     </div>
//   }
// />
// {/* <br /> */}
// <CardContent>
//   <span style={{ overflow: "hidden" }}>{post.post.body}</span>
// </CardContent>
// </Card>