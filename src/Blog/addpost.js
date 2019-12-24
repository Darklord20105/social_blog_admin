import React, { Component } from "react"
import axios from "axios"

import history from '../utils/history'
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";


class AddPost extends Component {
    handleSubmit = (event) => {
        event.preventDefault()
        const user_id = this.props.db_profile[0].uid
        const username = this.props.db_profile[0].username
        const data = {
            title: event.target.title.value,
            body: event.target.body.value,
            username: username,
            uid: user_id
        }
        axios.post("/api/post/posttodb", data)
            .then(res => console.log(res))
            .catch((err) => console.log(err))
            .then(setTimeout(() => history.replace("/posts"), 700))
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        id="title"
                        label="title"
                        margin="normal"
                    />
                    <br />
                    <TextField
                        id="body"
                        label="Body"
                        multiline
                        rows="4"
                        margin="normal"
                    />
                    <button type="submit"> Submit </button>
                </form>
                <br />
                <button onClick={() => history.replace("/posts")}> Cancel </button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        db_profile: state.auth_reducer.db_profile
    }
}

export default connect(mapStateToProps)(AddPost);