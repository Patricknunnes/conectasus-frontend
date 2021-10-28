import React, { Component } from "react";
import { Button } from 'react-bootstrap';

import UserService from "../services/user.service";
//import EventBus from "../common/EventBus";
import InfiniteScroll from "react-infinite-scroll-component";

import Modal from 'react-bootstrap/Modal';

/*const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8
};*/

function buildFileSelector(){
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  fileSelector.setAttribute('accept', '.xlsx,.xls');
  return fileSelector;
}

//const [show, setShow] = useState(false);

//const handleClose = () => setShow(false);
//const handleShow = () => setShow(true);

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      items: Array.from({ length: 0 }),
      countReg: 0,
      hasMore: true,
      page: 1,
      showDialog: false
    };
  }


  handleClose = () =>{
    this.setState({
      showDialog: false
    });
  }

  enviarSolicitacao = () =>{
    this.setState({
      showDialog: false
    });
  }

  openDialog (){
    this.setState({
      showDialog: true
    });
  }
  

  handleFileSelect = (e) => {
    e.preventDefault();
    this.fileSelector.click();
  }



  creteFileSelector = ()=> {

    var that = this;

    this.fileSelector = buildFileSelector();
    this.fileSelector.onchange = function (e) {  
      UserService.uploadFile(e.target.files[0]).then(
        response => {
          console.log(response);
          UserService.loadFile(response.data.file);
          that.openDialog();
        },
        error => {
          console.log(error);
        }
      );
    };
  }



  configureGrid() {

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
      }
    );

  }

 

  componentDidMount() {
    this.creteFileSelector();
    this.configureGrid();
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
      }
    );

  
  };


  render() {
    return (
      <div className="container">

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" className="float-right" onClick={this.handleFileSelect} >+ Importar Arquivo</Button>
        </div>
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore= {this.state.hasMore}
          loader={<h4>Carregando...</h4>}
        >
          {this.state.items.map((i, index) => (

            <div className="row" key={index}>
              <div className="col-sm">
                {i['DS_CPF']}
              </div>
              <div className="col-sm">
                {i['NM_PACIENTE']}
              </div>
              <div className="col-sm">
                {i['UF']}
              </div>

              <div className="col-sm">
                Autorizacao
              </div>

              <div className="col-sm">
                Data horas resposta
              </div>

              <div className="col-sm">
                transmitido
              </div>

              <div className="col-sm">
                Data hora transsmissão
              </div>
            </div>

          ))}
        </InfiniteScroll>






        <Modal show={this.state.showDialog} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pacientes carregados</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja enviar solicitação de autorização para os pacientes carregados?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Não
          </Button>
          <Button variant="primary" onClick={this.enviarSolicitacao}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>

      </div>
    );
  }
}


//file update
//https://www.geeksforgeeks.org/file-uploading-in-react-js/

//https://codepen.io/rkotze/pen/zjRXYr