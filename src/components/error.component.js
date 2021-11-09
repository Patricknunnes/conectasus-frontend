import React, { Component } from "react";
//import { withRouter } from "react-router";
import './error.scss';
import AuthService from "../services/auth.service";

export default class Error extends Component {
 /* constructor(props) {
    super(props);

  }*/

  logOut() {
    AuthService.logout();
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
           <div className=""></div>
           <i class="bi bi-wrench error-i" style={{"font-size":"80px"}}></i>
           Ops, um erro inesperado ocorreu !
           <a href="/login" className="error-i"  onClick={this.logOut} >Login</a>
        </div>
        

      </div>
    );
  }
}

//const ErrorWithRouter = withRouter(Error);