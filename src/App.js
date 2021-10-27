import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };

    console.log("Construcotor : "+this.state);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user 
      });
    }
    console.log('componentDidMount'+this.setState);
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined
    });
  }

  getUser(){
    const user = AuthService.getCurrentUser();
    console.log("getuser : "+user);
    return user;
  }

  render() {
    this.getUser();
   // const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

   const currentUser = this.getUser();
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            bezKoder
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
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



        <div className="container mt-3">
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path={["/", "/home"]}  loggedIn={currentUser} component={Home} />
            <ProtectedRoute exact path="/register"  loggedIn={currentUser} component={Register} />
            <ProtectedRoute exact path="/profile" loggedIn={currentUser} component={Profile} />
            <ProtectedRoute path="/user"  loggedIn={currentUser} component={BoardUser} />
            <ProtectedRoute path="/mod"  loggedIn={currentUser} component={BoardModerator} />
            <ProtectedRoute path="/admin" loggedIn={currentUser} component={BoardAdmin} />
            <ProtectedRoute  path="/teste"  loggedIn={currentUser}  component={Profile}/>

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