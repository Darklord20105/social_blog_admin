import React, { Component } from "react"
import { connect } from "react-redux"

import * as ACTIONS from "../store/actions/actions"
import axios from "axios"
import history from "../utils/history"

import { Link } from "react-router-dom"

import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"

class ShowPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            comment: "",
            cid: "",
            //styling
            opacity: 0,
            comments_arr: [],
            comments_motion: [],
            delete_comment_id: 0,
            // likes
            likes: this.props.location.state.post.post.likes,
            like_user_id: this.props.location.state.post.post.like_user_id,
            like_post: true
        }
    }
    componentDidMount() {
        console.log(this.props)
        axios.get("/api/get/allpostcomments", {
            params: {
                post_id: this.props.location.state.post.post.pid
            }
        })
            .then(res => {
                console.log(res)
                this.props.set_comments(res.data)
            })
            .then(() => this.add_comments_to_state(this.props.comments))
            .catch(err => console.log(err))
        this.handleTransition();
    }

    handleClickOpen = (cid, comment) => {
        this.setState({ open: true, comment: comment, cid: cid })
    }
    handleClose = () => {
        this.setState({ open: false, comment: "", cid: "" })
    }
    handleCommentChange = (event) => {
        this.setState({ comment: event.target.value })
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({ comment: "" })
        const comment = event.target.comment.value
        const user_id = this.props.db_profile[0].uid
        const post_id = this.props.location.state.post.post.pid
        const username = this.props.db_profile[0].username
        //temprarley
        const temp_cid = 65166
        const justnow = "Just Now"

        const data = {
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            username: username
        }

        const submitted_comment = {
            cid: temp_cid,
            comment: comment,
            user_id: user_id,
            author: username,
            date_created: justnow
        }

        axios.post("/api/post/commenttodb", data)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        window.scroll({ top: 0, left: 0, behavior: "smooth" })
        this.handleCommentSubmit(submitted_comment)
    }

    handleUpdate = () => {
        const comment = this.state.comment
        const cid = this.state.cid
        const user_id = this.props.location.state.post.post.uid
        const post_id = this.props.location.state.post.post.pid
        const username = this.props.location.state.post.post.author

        const justnow = "Just Now"
        const data = {
            cid: cid,
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            username: username
        }
        const editedComment = {
            cid,
            comment,
            post_id,
            user_id,
            author: username,
            date_created: justnow,
            isEdited: true
        }

        axios.put("/api/put/commenttodb", data)
            .then(res => console.log(res, "added"))
            .catch(err => console.log(err))
        this.handleCommentUpdate(editedComment)
    }

    handleDelete = () => {
        const cid = this.state.cid
        axios.delete("/api/delete/comment", { data: { cid: cid } })
            .then(res => console.log(res))
            .catch(err => console.log(err))
        this.handleCommentDelete(cid)
        this.setState({ open: false })
    }

    RenderComments = (comment) => {
        console.log("coomment", comment)
        return (
            <div className={this.state.delete_comment_id === comment.comment.cid ? "FadeOutComment" : "CommentStyle"}>
                <h3>{comment.comment.comment}</h3>
                <small>
                    {comment.comment.date_created === "Just Now" ?
                        <div>{comment.comment.isEdited ? <span>Edited</span> : <span>Just Now</span>}</div>
                        : comment.comment.date_created
                    }</small>
                <p>By : {comment.comment.author}</p>
                <Button onClick={() => this.handleClickOpen(comment.comment.cid, comment.comment.comment)}>
                    Edit
                </Button>
            </div>
        )
    }

    //styling functions
    // a helper function to apply transitiion
    handleTransition = () => {
        setTimeout(() => this.setState({ opacity: 1 }), 400)
    }
    // a helper function to add posts to the state
    add_comments_to_state = (comments) => {
        this.setState({ comments_arr: [...comments] })
        this.animate_comments()

    }
    // animate each comment
    animate_comments = () => {
        let i = 1
        this.state.comments_arr.map(comment => {
            setTimeout(() => {
                this.setState({ comments_motion: [...this.state.comments_motion, comment] })
            }, 400 * i)
            i++;
        })
    }
    // the following functions deals only with front end styling only
    handleCommentSubmit = (submitted_comment) => {
        setTimeout(() => {
            this.setState({ comments_motion: [submitted_comment, ...this.state.comments_motion] })
        }, 50)
    }
    handleCommentUpdate = (comment) => {
        const commentIndex = this.state.comments_motion.findIndex(com => com.cid === comment.cid)
        let newArray = [...this.state.comments_motion]
        newArray[commentIndex] = comment
        this.setState({
            comments_motion: newArray
        })
    }
    handleCommentDelete = (cid) => {
        this.setState({ delete_comment_id: cid })
        const newArr = this.state.comments_motion.filter(com => com.cid !== cid)
        setTimeout(() => this.setState({ comments_motion: newArr }), 2000)
    }

    handleLikes = () => {
        const user_id = this.props.db_profile[0].uid
        const post_id = this.props.location.state.post.post.pid
        const data = { uid: user_id, post_id: post_id }

        axios.put("/api/put/likes", data)
            .then(!this.state.like_user_id.includes(user_id) && this.state.like_post
                ? this.setState({ likes: this.state.likes + 1 }) : null)
            .then(this.setState({ like_post: false }))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <div>
                    <h2>Post</h2>
                    <h4>{this.props.location.state.post.post.title}</h4>
                    <p>{this.props.location.state.post.post.body}</p>
                    <p>{this.props.location.state.post.post.author}</p>
                    <a style={{ cursor: "pointer" }} onClick={this.props.isAuthenticated
                        ? () => (this.handleLikes()) : () => history.replace("/signup")
                    }>
                        <i className="material-icons">thumb_up</i>
                        <small className="notification-num-showpost">{this.state.likes}</small>
                    </a>
                </div>
                <div style={{ opacity: this.state.opacity, transition: "ease-out 2s" }}>
                    <h2>Comments :</h2>
                    {this.props.comments
                        ? this.state.comments_motion.map(comment =>
                            <this.RenderComments
                                comment={comment}
                                cur_user_id={this.props.db_profile[0].uid}
                                key={comment.cid}
                            />) : null}
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            id="comment"
                            label="Comment"
                            margin="normal"
                        />
                        <br />
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Edit Comment</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <input type="text" value={this.state.comment} onChange={this.handleCommentChange} />
                            </DialogContentText>
                            <DialogActions>
                                <Button onClick={() => {
                                    this.handleUpdate()
                                    this.setState({ open: false })
                                }}>
                                    Agree
                                </Button>
                                <Button onClick={() => this.handleClose()}>
                                    Cancel
                                </Button>
                                <Button onClick={() => this.handleDelete()}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        comments: state.posts_reducer.comments,
        db_profile: state.auth_reducer.db_profile,
        isAuthenticated: state.auth_reducer.is_authenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set_comments: (comments) => dispatch(ACTIONS.fetch_post_comments(comments))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowPost);
