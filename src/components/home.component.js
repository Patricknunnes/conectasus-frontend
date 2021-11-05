import React, { Component ,  forwardRef  } from "react";
import { Form } from "react-bootstrap";
import { Button } from 'react-bootstrap';

import UserService from "../services/user.service";
//import EventBus from "../common/EventBus";
import Dropdown from 'react-bootstrap/Dropdown'

import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../services/auth.service";

import './home.scss';

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <i className="bi bi-calendar text-info"   onClick={onClick} ref={ref}></i>
));

const estados =[

  {id: "" , name: "Selecione" },
  {id: "AC" , name: "Acre" },
  {id: "AL" , name: "Alagoas" },
  {id: "AP" , name: "Amapá" },
  {id: "AM" , name: "Amazonas" },
  {id: "BA" , name: "Bahia" },
  {id: "CE" , name: "Ceará" },
  {id: "DF" , name: "Distrito Federal" },
  {id: "ES" , name: "Espirito Santo" },
  {id: "GO" , name: "Goiás" },
  {id: "MA" , name: "Maranhão" },
  {id: "MS" , name: "Mato Grosso do Sul" },
  {id: "MT" , name: "Mato Grosso" },
  {id: "MG" , name: "Minas Gerais" },
  {id: "PA" , name: "Pará" },
  {id: "PB" , name: "Paraíba" },
  {id: "PR" , name: "Paraná" },
  {id: "PE" , name: "Pernambuco" },
  {id: "PI" , name: "Piauí" },
  {id: "RJ" , name: "Rio de Janeiro" },
  {id: "RN" , name: "Rio Grande do Norte" },
  {id: "RS" , name: "Rio Grande do Sul" },
  {id: "RO" , name: "Rondônia" },
  {id: "RR" , name: "Roraima" },
  {id: "SC" , name: "Santa Catarina" },
  {id: "SP" , name: "São Paulo" },
  {id: "SE" , name: "Sergipe" },
  {id: "TO" , name: "Tocantins" }


];

const statusWhats = [
  {
    id: 'A',
    name: "Autorizado"
  },
  {
    id: 'W',
    name: "Enviado"
  },
  {
    id: 'N',
    name: "Não autorizado"
  },
  {
    id: '',
    name: "Não enviado"
  },
  {
    id: 'E',
    name: "Autorizado email"
  }
];

const statusTransmission = [
  {
    id: 'T',
    name: "Transmitido"
  },
  {
    id: 'A',
    name: "Aguardando transmissão"
  },
  {
    id: 'P',
    name: "Parcial"
  },
  {
    id: 'E',
    name: "Erro"
  },
  {
    id: '',
    name: ""
  }
];


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.inputFile = React.createRef();

    this.state = {
      content: "",
      items: Array.from({ length: 0 }),
      countReg: 0,
      hasMore: true,
      page: 1,
      showDialog: false,
      loadedRegisters: Array.from({ length: 0 }),
      currentDate: new Date(),
      transmissionDate : null
    };

  }

  

  clearLoadedRegisters = () =>{
    this.setState({
      loadedRegisters: Array.from({ length: 0 })
    });
  }

  handleClose = () =>{
    this.setState({
      showDialog: false,
      loadedRegisters: Array.from({ length: 0 })
    });
    this.configureGrid();
  }

  enviarSolicitacao = () =>{

    //envia os dados pro server
    UserService.requestAutorizathion(this.state.loadedRegisters).then(
      response => {
        this.configureGrid();
      });

    this.setState({
      showDialog: false,
      loadedRegisters: Array.from({ length: 0 })
    });
  }

  openDialog (){
    this.setState({
      showDialog: true
    });
  }
  

  handleFileSelect = (e) => {
    e.preventDefault();
    this.inputFile.current.click();
  }


  onScrollTable= (e) => {
   
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
      console.log("Scroll = "+e);
      this.fetchMoreData();
    }
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

  creteFileSelector() {
  var that = this;

  this.inputFile.current.onchange = function (e) {  
    UserService.uploadFile(e.target.files[0]).then(
      response => {
        console.log(response);
        UserService.loadFile(response.data.file).then(
          response2 => {
            that.setState({loadedRegisters: response2.data.registers});
            that.configureGrid();
            that.openDialog();
            e.target.value = null;
          }
        );
      },
      error => {
        console.log(error);
        e.target.value = null;
      }
    )};
 }

  componentDidMount() {
    this.creteFileSelector();
    this.configureGrid();

    //
    UserService.setProps(this.props);
  }
 

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

  handleDateSelect = () => {

  }

  handleDateChange = () => {

  }

  setStartDate = (data) =>{

  }


  


  render() {
    return (
      
      
      <div  id="homeDiv">

<header>
      
      <div className="navbar navbar-dark bg-dark box-shadow">
        <div className="container d-flex justify-content-between">
        
          <img
            src="../assets/logo-idor.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
           // alt="React Bootstrap logo"
          />
          <div className="navbar-brand d-flex align-items-center">
              <row>{ AuthService.getCurrentUser().nm_pessoa}</row>
              <a href="/login" className="error-i"  onClick={()=> AuthService.logout()} >Sair</a>
          </div>
        </div>
      </div>
    </header>



          <div id="filters">



            <Row className="mx-0">
              <Col >
                <Form.Control size="sm" name="foo" placeholder="Pesquise pelo nome ou CPF" />
              </Col>
              <Col >
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Status da autorização
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                  {statusWhats.map((i, index) => (
                    <Dropdown.Item href={'#/action-'+i.id}>{i.name}</Dropdown.Item>
                  ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

         
              <Col >
                <DatePicker
                  selected={this.state.currentDate}
                  onChange={(date) => this.setStartDate(date)}
                  customInput={<ExampleCustomInput />}/>
              </Col >

              <Col >
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Status da trasmissão
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                  {statusTransmission.map((i, index) => (
                    <Dropdown.Item href={'#/action-'+i.id}>{i.name}</Dropdown.Item>
                  ))}
                  
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col >
                <DatePicker
                  selected={this.state.transmissionDate}
                  onChange={(date) =>  this.setState({transmissionDate: date}) }
                  customInput={<ExampleCustomInput />}/>
              </Col >
              <Col >
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                  UF
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {estados.map((i, index) => (
                      <Dropdown.Item href={'#/action-'+i.id}>{i.name}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>




            
           

          

           

           

          

          
            

          </div>
        <div>Lista de pessoas vacinadas</div>
        <button  onClick={this.handleFileSelect.bind(this)}  id="importFile" title="Go to top">+ Importar Arquivo</button>
        <input type='file' id='file' ref={this.inputFile} style={{display: 'none'}}/>

        <div id="scrollTable"  onScroll={this.onScrollTable.bind(this)} style={{ height: 300, overflowY: "scroll" }}>
        <Table striped bordered hover >
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>UF</th>
            <th>Autorização</th>
            <th>Data/Hora da resposta</th>
            <th>Transmitido</th>
            <th>Data/Hora da trasmissão</th>
          </tr>
        </thead>
        <tbody>
          {this.state.items.map((i, index) => (
              <tr  key={index}>
                <td>{index}</td>
                <td>{i['DS_CPF']}</td>
                <td>{i['NM_PACIENTE']}</td>
                <td>{i['UF']}</td>
                <td>{i['DS_AUTORIZADO']}</td>
                <td>{i['DT_RESPOSTA']}</td>
                <td>{i['DS_ENVIO_GOVERNO']}</td>
                <td>{i['DT_ENVIO_GOVERNO']}</td>
                
              </tr>
            ))}
        </tbody>
      </Table>
      </div>

      {  this.state.items &&  this.state.items.length  >0 ? null : <div>Você não possui nenhum item na lista. Faça uma nova busca ou upload de arquivos.</div> }


       {/* TODO: carregando
          */}

        <Modal show={this.state.showDialog} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pacientes carregados</Modal.Title>
        </Modal.Header>
        <Modal.Body>Foram carregados {this.state.loadedRegisters.length} registros. Deseja enviar solicitação de autorização para os pacientes carregados?</Modal.Body>
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


//outra opção de scroll
/** https://stackoverflow.com/questions/39325581/how-to-add-scroll-event-in-react-component/39326139 */


//https://reactdatepicker.com/