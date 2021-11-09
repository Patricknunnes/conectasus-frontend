import React, { Component } from "react";
import { Switch, Route,  Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Error from "./components/error.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.logOut = this.logOut.bind(this);

  }

  componentDidMount() {
    EventBus.on("logout", () => {
      this.logOut();
    });

    EventBus.on("error", () => {
      this.props.history.push("/error");
    });

   
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
  }

  /*
  getUser(){
    const user = AuthService.getCurrentUser();
    return user;
  }*/

  render() {
 
    const currentUser =  AuthService.getCurrentUser();
   
    return (
      <div>
        <div className="">
          <Switch>
          <Redirect exact from="/" to="/home" />
            <Route exact path="/login" component={Login} />
            <Route exact path="/error" component={Error} />
            <ProtectedRoute exact path={[ "/home"]}  loggedIn={currentUser} component={Home} />
            <ProtectedRoute exact path="/profile" loggedIn={currentUser} component={Profile} />
          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}


const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        loggedIn = AuthService.getCurrentUser();
        return loggedIn && loggedIn.auth ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                prevLocation: path,
                error: "You need to login first!",
              },
            }}
          />
        );
      }}
    />
  );
};

export default App;