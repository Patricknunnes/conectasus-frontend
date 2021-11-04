import React, { Component } from "react";
import { Switch, Route,  Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Home from "./components/home.component";
import UserService from "./services/user.service";
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

    UserService.setProps(this.props);
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
  }

  getUser(){
    const user = AuthService.getCurrentUser();
    return user;
  }

  render() {
 
    const currentUser =  AuthService.getCurrentUser();
   
    return (
      <div>
        {/*<nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
           Logo idor
          </Link>
          

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Sair
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
            </div>
          )}
        </nav>
          */}


        <div className="">
          <Switch>
          <Redirect exact from="/" to="/home" />
            <Route exact path="/login" component={Login} />
            <Route exact path="/error" component={Login} />
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

        console.log(loggedIn +" - "+path+" - "+AuthService.getCurrentUser());
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