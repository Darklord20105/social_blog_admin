import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import * as ACTIONS from "../store/actions/actions";

import { Link } from "react-router-dom";
import history from "../utils/history"

import Button from "@material-ui/core/Button"

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import Paper from '@material-ui/core/Paper'

import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

class Users extends Component {
    componentDidMount() {
        axios.get('/api/get/allusers')
            .then(res => this.props.users_success(res.data))
            .catch(err => console.log(err))

    }
    state = {
        open: false,
        uid: null
    }
    handleClickOpen = (user_id) => {
        this.setState({ open: true, uid: user_id })
    }
    handleClickClose = () => {
        this.setState({ open: false, uid: null })
    }
    /* deletes users */
    handleDeleteUser = () => {
        const user_id = this.state.uid
        /* first we delete all the user comments */
        axios.delete("/api/delete/usercomments", { data: { uid: user_id } })
            .then(() => axios.get('/api/get/user_postid', { data: { uid: user_id } })
                .then(res => res.data.map(post => axios.delete('/api/delete/userpostcomments', { data: { uid: user_id } }))
                )
            )
            .then(() => axios.delete('/api/delete/userposts', { data: { uid: user_id } })
                .then(() => axios.delete('/api/delete/user', { data: { uid: user_id } })
                )
            )
            .catch(err => console.log(err))
            .then(setTimeout(() => history.replace('/'), 700))
    }

    RenderUsers = user => (
        <TableRow>
            <TableCell>
                <br />
                <p>{user.user.username}</p>
                <p>{user.user.email}</p>
                <br />
                <button onClick={() => this.handleClickOpen(user.user.uid)}>
                    Delete User
                </button>
            </TableCell>
        </TableRow>
    )

    render() {
        return (
            <div>
                <h3>Users : </h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                User
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.users ? (
                            [
                                this.props.users.map(user => (
                                    <this.RenderUsers key={user.uid} user={user} />
                                ))
                            ]
                        ) : null}
                    </TableBody>
                </Table>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClickClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-discription"
                >
                    <DialogTitle id="alert-dialog-title"> Delete User ? </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-discription">
                            Deleting A user will delete all posts and comments made by the user
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleDeleteUser()}>Delete</Button>
                        <Button onClick={() => this.handleClickClose()}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        users: state.user_reducer.all_users
    }
}

const mapDispatchToProps = dispatch => {
    return {
        users_success: users => dispatch(ACTIONS.get_all_users(users))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);


