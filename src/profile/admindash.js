import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import * as ACTIONS from "../store/actions/actions";

import { Link } from "react-router-dom";
import history from "../utils/history"

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

import Paper from "@material-ui/core/Paper"

import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"

import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

import Button from "@material-ui/core/Button"

import "../App.css"

const localizer = momentLocalizer(moment)

const bus_open_time = new Date('12/12/2019 9:00 am')
const bus_close_time = new Date('12/12/2019 5:00 pm')

let allViews = ['month', 'week', 'day']

class AdminDash extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            events: [],
            format_events: [],
            start_display: null,
            start_slot: null,
            end_slot: null
        }

    }
    componentDidMount() {
        axios.get('/api/get/allappointments')
            .then(res => this.props.events_success(res.data))
            .catch(err => console.log(err))
            .then(() => this.setState({ events: this.props.db_appointments }))
            .then(() => this.dateStringtoObject())
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }
    handleClickClose = () => {
        this.setState({ open: false })
    }

    dateStringtoObject = () => {
        this.state.events.map(appointment => this.setState({
            format_events: [...this.state.format_events,
            {
                id: appointment.aid,
                title: appointment.title,
                start: new Date(appointment.start_time),
                end: new Date(appointment.end_time),
            }]
        }))
    }

    handelAppointmentConfirm = () => {
        const time_start = this.state.start_slot
        const time_end = this.state.end_slot
        const data = { title: 'booked', start_time: time_start, end_time: time_end }

        axios.post('/api/post/appointment', data)
            .then((res) => console.log(res))
            .catch(err => console.log(err))
            .then(setTimeout(() => history.replace('/'), 700))
            .then(alert('Booking Confirmed'))
    }

    showTodos = (props) => (
        <div className="FlexRow">
            <p>{props.appointment.start.toLocaleString()}</p>
        </div>
    )

    Calendar = () => (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                selectable
                events={this.state.format_events}
                min={bus_open_time}
                max={bus_close_time}
                // defaultView={Calendar.Views.MONTH}
                views={allViews}
                defaultDate={new Date('12/12/2019')}
                onSelectEvent={event => alert(event.start)}
                onSelectSlot={slotInfo => {
                    this.setState({
                        start_slot: slotInfo.start,
                        end_slot: slotInfo.end,
                        start_display: slotInfo.start.toLocaleString()
                    })
                    this.handleClickOpen()
                }}
            />
        </div>
    )

    render() {
        return (
            <div>
                <h4> Appointments : </h4>
                <div className="FlexRow">
                    <Paper>
                        {this.state.format_events
                            ? this.state.format_events.map(appointment =>
                                <this.showTodos key={appointment.id} appointment={appointment} />)
                            : null}
                    </Paper>
                    <br />
                    <br />
                    <div className="FlexRow">
                        {this.state.format_events ?
                            <this.Calendar /> : null}
                    </div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClickClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-discription"
                    >
                        <DialogTitle id="alert-dialog-title"> Confirm Appointment ? </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-discription"> Appointment Time : {this.state.start_display} </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.handelAppointmentConfirm()}>Confirm</Button>
                            <Button onClick={() => this.handleClickClose()}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        db_appointments: state.user_reducer.db_appointments
    }
}
const mapDispatchToProps = dispatch => {
    return {
        events_success: appointments => dispatch(ACTIONS.get_appointments_success(appointments))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDash)