import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";


import InfiniteScroll from "react-infinite-scroll-component";



const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8
};


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      items: Array.from({ length: 0 }),
      countReg: 0,
      hasMore: true,
      page: 1
    };
  }

  componentDidMount() {

    //busca quantidade de registros e a primeira pagina
    UserService.getFirstPage().then(
      response => {
        this.setState({
          items: response.data.registers,
          countReg: response.data.qt_registros,
          hasMore : response.data.qt_registros >  response.data.registers.length,
          page: 1
        });
        
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString()
        });

        if (error.response && (error.response.status === 401 || error.response.status === 500 )) {
          EventBus.dispatch("logout");
        }

      }
    );
  }


 /* hasMore = () =>{
    console.log("hasMore");
    return this.state.items.length < this.state.countReg;
  }
  */

 

  fetchMoreData = () => {

  let pageNumber =  this.state.page +1;
  
    UserService.getNextPage(pageNumber).then(
      response => {

        let tempItems = this.state.items.concat(response.data);

        this.setState({
          items: tempItems,
          hasMore : this.state.countReg >  tempItems.length,
          page: pageNumber
        });
        
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString()
        });

        if (error.response && (error.response.status === 401 || error.response.status === 500 )) {
          EventBus.dispatch("logout");
        }

      }
    );

  
  };


  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>



        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore= {this.state.hasMore}
          loader={<h4>Carregando...</h4>}
        >
          {this.state.items.map((i, index) => (
            <div style={style} key={index}>
              div - #{index} {i[0]}
            </div>
          ))}
        </InfiniteScroll>

      </div>
    );
  }
}


//file update
//https://www.geeksforgeeks.org/file-uploading-in-react-js/