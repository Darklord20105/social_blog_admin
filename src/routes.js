import React, { Component } from "react";
import { connect } from "react-redux";

import Container1 from "./containers/container1";
import Header from "./containers/header";
import Profile from "./containers/profile";
import Form1 from "./containers/form1";
import RenderList from "./containers/renderlist";

import Component1 from "./functional/component1";
import Callback from "./functional/callback";
import PrivateComponent from "./functional/privatecomponent";
import UnauthRedirect from "./functional/unauthredirect";
import Home from "./functional/home";
import RenderListItem from "./functional/renderlistitem";
import SignUp from "./functional/signup";

import ShowUser from "./profile/showuser";
import SendMessage from "./profile/sendmessage";
import ShowMessages from "./profile/showmessages";
import ReplyToMessage from "./profile/replytomessage";
import AdminDash from "./profile/admindash";
import Users from "./profile/users"

import Posts from "./Blog/posts";
import AddPost from "./Blog/addpost";
import EditPost from "./Blog/editpost";
import ShowPost from "./Blog/showpost";

import * as ACTIONS from "./store/actions/actions";

import Auth from "./utils/auth";
import AuthCheck from "./utils/authcheck";
import history from "./utils/history";

import { Router, Route, Switch, Redirect } from "react-router";

export const auth = new Auth();

const handleAuthentication = props => {
  if (props.location.hash) {
    auth.handleAuth();
  }
};

const PrivateRoute = ({ component: Component, auth }) => (
  <Route
    render={props =>
      auth.isAuthenticated() === true ? (
        <Component auth={auth} {...props} />
      ) : (
          <Redirect to={{ pathname: "/signup" }} />
        )
    }
  />
);

class Routes extends Component {
  componentDidMount() {
    if (auth.isAuthenticated()) {
      this.props.login_success();
      auth.getProfile();
      setTimeout(() => {
        this.props.add_profile(auth.userProfile);
      }, 400);
    } else {
      this.props.login_failure();
      this.props.remove_profile();
    }
  }

  render() {
    return (
      <div>
        <Router history={history}>
          <div>
            <Header auth={auth} />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/form1" component={Form1} />
              <Route
                exact
                path="/container1"
                render={() => <Container1 auth={auth} />}
              />
              <Route
                path="/authcheck"
                render={() => <AuthCheck auth={auth} />}
              />
              <Route path="/redirect" component={UnauthRedirect} />
              <Route path="/renderlist" component={RenderList} />
              <Route path="/signup" render={() => <SignUp auth={auth} />} />

              <Route path="/user/:uid" component={ShowUser} />
              <Route path="/users" component={Users} />

              {/* //the user needs to be authenticated to use messages func */}
              <PrivateRoute
                path="/sendmessage"
                auth={auth}
                component={SendMessage}
              />
              <PrivateRoute
                path="/showmessages/:id"
                auth={auth}
                component={ShowMessages}
              />
              <PrivateRoute
                path="/replytomessage"
                auth={auth}
                component={ReplyToMessage}
              />

              <Route path="/posts" component={Posts} />
              <Route path="/post/:pid" component={ShowPost} />
              <Route path="/editpost/:pid" component={EditPost} />
              <Route path="/addpost" component={AddPost} />
              <PrivateRoute path='/admindash' auth={auth} component={AdminDash} />

              <Route
                path="/callback"
                render={props => {
                  handleAuthentication(props);
                  return <Callback />;
                }}
              />
              <Route
                path="/component1"
                render={props => <Component1 {...props} />}
              />

              <Route path="/listitem/:id" component={RenderListItem} />

              <PrivateRoute
                path="/privateroute"
                auth={auth}
                component={PrivateComponent}
              />
              <PrivateRoute path="/profile" auth={auth} component={Profile} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login_success: () => dispatch(ACTIONS.login_success()),
    login_failure: () => dispatch(ACTIONS.login_failure()),
    add_profile: profile => dispatch(ACTIONS.add_profile(profile)),
    remove_profile: () => dispatch(ACTIONS.remove_profile())
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Routes);
