import React, { Component, forwardRef } from "react"
import { Button } from "react-bootstrap"
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Logo from '../assets/logo-idor.svg'
import AuthService from "../services/auth.service"
import UserService from "../services/user.service"
import './home.scss'

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  <i className="bi bi-calendar text-info" onClick={onClick} ref={ref}></i>
))

const estados = [

  { id: "", name: "Selecione" },
  { id: "AC", name: "Acre" },
  { id: "AL", name: "Alagoas" },
  { id: "AP", name: "Amapá" },
  { id: "AM", name: "Amazonas" },
  { id: "BA", name: "Bahia" },
  { id: "CE", name: "Ceará" },
  { id: "DF", name: "Distrito Federal" },
  { id: "ES", name: "Espirito Santo" },
  { id: "GO", name: "Goiás" },
  { id: "MA", name: "Maranhão" },
  { id: "MS", name: "Mato Grosso do Sul" },
  { id: "MT", name: "Mato Grosso" },
  { id: "MG", name: "Minas Gerais" },
  { id: "PA", name: "Pará" },
  { id: "PB", name: "Paraíba" },
  { id: "PR", name: "Paraná" },
  { id: "PE", name: "Pernambuco" },
  { id: "PI", name: "Piauí" },
  { id: "RJ", name: "Rio de Janeiro" },
  { id: "RN", name: "Rio Grande do Norte" },
  { id: "RS", name: "Rio Grande do Sul" },
  { id: "RO", name: "Rondônia" },
  { id: "RR", name: "Roraima" },
  { id: "SC", name: "Santa Catarina" },
  { id: "SP", name: "São Paulo" },
  { id: "SE", name: "Sergipe" },
  { id: "TO", name: "Tocantins" }


]

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
    id: 'NE',
    name: "Não enviado"
  },
  {
    id: 'E',
    name: "Autorizado email"
  }
]

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
]


export default class Home extends Component {
  constructor(props) {
    super(props)

    this.inputFile = React.createRef()

    this.state = {
      content: "",
      items: Array.from({ length: 0 }),
      countReg: 0,
      hasMore: true,
      page: 1,
      showDialog: false,
      loadedRegisters: Array.from({ length: 0 }),
      authorizationStatus: null,//status da autorização
      authorizationDate: null, //data da autorização
      transmissionStatus: null, //Status da transmissão
      transmissionDate: null, //data da transmissão
      searchText: null,
      state: null, //estado
      showDetailsTransmission: false,
      detailsTransmission: Array.from({ length: 0 })
    }

  }

  /**
   * 
   */
  clearLoadedRegisters = () => {
    this.setState({
      loadedRegisters: Array.from({ length: 0 })
    })
  }

  /**
   * 
   */
  handleClose = () => {
    this.setState({
      showDialog: false,
      loadedRegisters: Array.from({ length: 0 })
    })
    this.configureGrid()
  }

  handleCloseTransmissionDetail = () => {
    this.setState({
      detailsTransmission: Array.from({ length: 0 }),
      showDetailsTransmission: false
    })
    
  }
  openTransmissionDetail = (cpf) => {
    var that = this;
    UserService.getDetailStatusRIAR(cpf).then(
      response => {
        that.setState({
            showDetailsTransmission: true,
            detailsTransmission: response.data
        });
      }
    );
  }
  /***
   * 
   */
  enviarSolicitacao = () => {

    //envia os dados pro server
    UserService.requestAutorizathion(this.state.loadedRegisters).then(
      response => {
        this.configureGrid()
      })

    this.setState({
      showDialog: false,
      loadedRegisters: Array.from({ length: 0 })
    })
  }

  /**
   * 
   */
  openDialog() {
    this.setState({
      showDialog: true
    })
  }

  /**
   * 
   * @param {*} e 
   */
  handleFileSelect = (e) => {
    e.preventDefault()
    this.inputFile.current.click()
  }

  /***
   * 
   */
  onScrollTable = (e) => {
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
      this.fetchMoreData()
    }
  }


  atualizarQuery() {
    this.setState({
      page: 1,
      items: Array.from({ length: 0 }),
      countReg: 0,
      hasMore: true
    })

    var copy = { ...this.state }
    copy.page = 1
    copy.items = Array.from({ length: 0 })
    copy.countReg = 0
    this.configureGrid(copy)

  }

  /***
   * 
   */
  configureGrid(data) {

    if (!data) {
      data = this.state
    }
    //busca quantidade de registros e a primeira pagina
    UserService.getFirstPage(
      data.page,
      data.searchText,
      data.authorizationStatus,//status da autorização
      data.authorizationDate, //data da autorização
      data.transmissionStatus, //Status da transmissão
      data.transmissionDate, //data da transmissão
      data.state
    ).then(
      response => {
        this.setState({
          items: response.data.registers,
          countReg: response.data.qt_registros,
          hasMore: response.data.qt_registros > response.data.registers.length,
          page: 1
        })

      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString()
        })
      }
    )

  }

  /**
   * 
   */
  creteFileSelector() {
    var that = this

    this.inputFile.current.onchange = function (e) {
      UserService.uploadFile(e.target.files[0]).then(
        response => {
          console.log(response)
          UserService.loadFile(response.data.file).then(
            response2 => {
              that.setState({ loadedRegisters: response2.data.registers })
              that.configureGrid()
              that.openDialog()
              e.target.value = null
            }
          )
        },
        error => {
          console.log(error)
          e.target.value = null
        }
      )
    }
  }

  /**
   * 
   */
  componentDidMount() {
    this.creteFileSelector()
    this.configureGrid()
    //
    UserService.setProps(this.props)
  }


  /**
   * 
   */
  fetchMoreData = () => {
    let pageNumber = this.state.page + 1
    var data = this.state
    data.page = pageNumber

    UserService.getNextPage(
      data.page,
      data.searchText,
      data.authorizationStatus,//status da autorização
      data.authorizationDate, //data da autorização
      data.transmissionStatus, //Status da transmissão
      data.transmissionDate, //data da transmissão
      data.state

    ).then(
      response => {

        let tempItems = this.state.items.concat(response.data)

        this.setState({
          items: tempItems,
          hasMore: this.state.countReg > tempItems.length,
          page: pageNumber
        })

      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data && error.response.data.message) ||
            error.message || error.toString()
        })
      }
    )


  }

  componentDidUpdate() {
    // console.log('vai atualizar')
  }

  /**
   * 
   * @param {*} evt 
   */
  doSearch = (evt) => {
    var that = this

    var searchText = evt.target.value // this is the search text
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      that.setState({ searchText: searchText })
      var copy = { ...this.state }
      copy.searchText = searchText
      this.configureGrid(copy)

    }, 300)
  }

  /**
   * 
   * @param {*} evt 
   * @param {*} eventKey 
   */
  handleAuthorization = (evt, eventKey) => {
    evt.preventDefault()
    this.setState({ authorizationStatus: eventKey })

    var copy = { ...this.state }
    copy.authorizationStatus = eventKey
    this.configureGrid(copy)
  }

  /**
   * 
   * @param {*} date 
   */
  handleAuthorizationDate = (date) => {
    this.setState({ authorizationDate: date })
    var copy = { ...this.state }
    copy.authorizationDate = date
    this.configureGrid(copy)
  }

  /**
   * 
   * @param {*} date 
   */
  handleTransmissionDate = (date) => {
    this.setState({ transmissionDate: date })
    var copy = { ...this.state }
    copy.authorizationDate = date
    this.configureGrid(copy)
  }


  /**
   * 
   * @param {*} evt 
   * @param {*} eventKey 
   */
  handleTransmission = (evt, eventKey) => {
    evt.preventDefault()
    this.setState({ transmissionStatus: eventKey })

    var copy = { ...this.state }
    copy.transmissionStatus = eventKey
    this.configureGrid(copy)
  }

  /**
   * 
   * @param {*} evt 
   * @param {*} eventKey 
   */
  handleState = (evt, eventKey) => {
    evt.preventDefault()
    this.setState({ state: eventKey })

    var copy = { ...this.state }
    copy.state = eventKey
    this.configureGrid(copy)
  }


  filterCPF() {
    return this.state.items
      .map(p => p['DS_CPF'])
  }

  sendWhatsApp() {
    //envia os dados pro server
    UserService.requestAutorizathionByCPF(this.filterCPF()).then(
      response => {
        this.configureGrid()
      })

  }

  sendRIAR() {
    // aaa

    //envia os dados pro server
    UserService.sendRIARByCPF(this.filterCPF()).then(
      response => {
        this.configureGrid()
      })

  }


  /**
   * 
   * @returns 
   */
  renderHeader = () => {
    return (

      <header>

        <div className="navbar">
          <div className="container">

            <img
              src={Logo}
              width="200"
              height="70"
              className="d-inline-block align-top"
              alt="Instituto"
            />

            <div className="row">
              <div className="user-name">
                <strong>
                  {AuthService.getCurrentUser().nm_pessoa}
                </strong>
              </div>
              <div>
                <a href="/login" className="error-i d-flex gap-2" onClick={() => AuthService.logout()} >
                  <i className="bi bi-box-arrow-left"></i>
                  Sair
                </a>
              </div>
            </div>
a
          </div>
        </div>
      </header>

    )
  }

  /**
   * 
   * @returns 
   */
  renderFilters = () => {

    return (
      <div className="p-3">
        <Row className="align-items-center row">
          <div className="mb-2 col-12 col-sm-6 col-lg-4 col-xl-3">
            <div className="input">
              <i className="bi bi-search"></i>
              <input size="sm" name="foo" placeholder="Pesquise pelo nome ou CPF" onChange={this.doSearch} />
            </div>
          </div>

          <div className="mb-2 col-12 col-sm-6 col-lg-4 col-xl-2">
            <div className="select">
              {/* TODO: MUDAR PARA SELECT */}
              {/* <select name="" id="">
              <option>Status da autorização</option>
              {statusWhats.map((i, index) => (
                <option value={i.id} onClick={(evt) => this.handleAuthorization(evt, i.id)} key={index}>{i.name}</option>
              ))}
            </select> */}

              <Dropdown >
                <Dropdown.Toggle variant="default" id="dropdown-basic">
                  Status da autorização
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {statusWhats.map((i, index) => (
                    <Dropdown.Item href={i.id} onClick={(evt) => this.handleAuthorization(evt, i.id)} key={index} eventKey={i.id}>{i.name}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>


          <div className="mb-2 col-12 col-sm-6 col-lg-4 col-xl-2">
            <div className="date">
              Data da resposta
              <DatePicker
                selected={this.state.authorizationDate}
                onChange={this.handleAuthorizationDate}
                customInput={<ExampleCustomInput />} />
            </div >
          </div>

          <div className="mb-2 col-12 col-sm-6 col-lg-4 col-xl-2">
            <div className="select">
              {/* TODO: MUDAR PARA SELECT */}
              {/* <select name="" id="">
              <option>Status da trasmissão</option>
              {statusTransmission.map((i, index) => (
                <option value={i.id} onClick={(evt) => this.handleTransmission(evt, i.id)} key={index}>{i.name}</option>
              ))}
            </select> */}
              <Dropdown>
                <Dropdown.Toggle variant="default" id="dropdown-basic">
                  Status da trasmissão
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {statusTransmission.map((i, index) => (
                    <Dropdown.Item href={i.id} onClick={(evt) => this.handleTransmission(evt, i.id)} key={index} eventKey={i.id}     >{i.name}</Dropdown.Item>
                  ))}

                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="mb-2 col-12 col-sm-6 col-lg-4 col-xl-2">
            <div className="date">
              Data da transmissão
              <DatePicker
                selected={this.state.transmissionDate}
                onChange={this.handleTransmissionDate}
                customInput={<ExampleCustomInput />} />
            </div >
          </div>

          <div className="mb-2 col-12 col-sm-6 col-lg-4 col-xl-1">
            <div className="select">
              {/* TODO: MUDAR PARA SELECT */}
              {/* <select name="" id="">
              <option>UF</option>
              {estados.map((i, index) => (
                <option value={i.id} onClick={(evt) => this.handleState(evt, i.id)} key={index}>{i.name}</option>
              ))}
            </select> */}
              <Dropdown>
                <Dropdown.Toggle variant="default" id="dropdown-basic">
                  UF
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {estados.map((i, index) => (
                    <Dropdown.Item href={i.id} onClick={(evt) => this.handleState(evt, i.id)} key={index} eventKey={i.id}     >{i.name}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Row>
      </div>

    )
  }

  /**
   * 
   * @returns 
   */
  renderTable = () => {

    return (

      this.state.items  && this.state.items.length <= 0 ? null :

      <div id="scrollTable" onScroll={this.onScrollTable.bind(this)} style={{ height: 300, overflowY: "scroll" }}>
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
              <tr key={index}>
                <td>{index}</td>
                <td>{i['NM_PACIENTE']}</td>
                <td>{i['DS_CPF']}</td>
                <td>{i['DS_UF']}</td>
                <td>{i['DS_AUTORIZADO']}</td>
                <td>{i['DT_RESPOSTA']}</td>
                <td>
              
                
                  { i['DS_STATUS_TRANSMISSAO'].startsWith("Aguardando") ?
                    i['DS_STATUS_TRANSMISSAO']
                  :
                  <Button variant="link"  onClick={()=> this.openTransmissionDetail(i['DS_CPF'])}>
                    {this.renderIconTransmission(i['DS_STATUS_TRANSMISSAO'])} { i['DS_STATUS_TRANSMISSAO']}
                  </Button>
                    
                }
                </td>
                <td>{i['DT_ENVIO_GOVERNO']}</td>

              </tr>
            ))}
          </tbody>
        </Table>
      </div>

    )
  }

  renderIconTransmission = (status) => {

    if (status === "Erro") {
      return (
        <i className="bi bi-send-x-fill error-transmission"></i>
              
      )
    } else if (status === "Transmitido") {
      return (
        <i className="bi bi-send-fill"></i>

      )
    } else if (status === "Parcial") {
      return (
        <i className="bi bi-send-exclamation"></i>

      )
    } else {
      return (
        <div></div>
      )
    }


  }

  /**
   * 
   * @returns 
   */
  renderEmptyRegisters = () => {
    return (
      this.state.items && this.state.items.length > 0 ? null : <div>Você não possui nenhum item na lista. Faça uma nova busca ou upload de arquivos.</div>
    )
  }

  renderModalLoadedFields = () => {
    return (
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
    )
  }
  aaaa

  renderModalTransmissionDetails = () => {


  //  : false,
  //  detailsTransmission: Array.from({ length: 0 })
    return (
      <Modal show={this.state.showDetailsTransmission} onHide={this.handleCloseTransmissionDetail}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da transmissão</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <div id="scrollTable" onScroll={this.onScrollTable.bind(this)} style={{ height: 300, overflowY: "scroll" }}>
      
        <Table striped bordered hover >
          <thead>
            <tr>
              <th>#</th>
             {/*   <th>Status</th>*/}
              <th>Dose</th>
              {/*  <th>Conteúdo</th>*/}
              <th>Retorno</th>
              <th>Data/Hora do envio</th>
              
            </tr>
          </thead>
          <tbody>
            {this.state.detailsTransmission.map((i, index) => (
              <tr key={index}>
                <td>{index}</td>
                {/* <td>{i['IE_STATUS_ENVIO']}</td>*/}
                <td>{i['NR_DOSE']}</td>
                {/* <td>{i['DS_CONTEUDO_HL7']}</td>*/}
               <td>{i['DS_RETORNO_GOVERNO']}</td>
                <td>{i['DT_ENVIO_GOVERNO']}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>


        

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseTransmissionDetail}>
            OK
          </Button>
         
        </Modal.Footer>
      </Modal>
    )
  }

  /**
   * 
   * @returns 
   */
  render() {
    return (
      <div className="home">
        {this.renderHeader()}
        <main className="p-5">
          <div className="container">
            {this.renderFilters()}
            <div className="container">
              <div>
                <h1>
                  <strong>
                    Lista de pessoas vacinadas
                  </strong>
                </h1>
              </div>
              <div className="actions">
                <Button variant="link" onClick={this.sendWhatsApp.bind(this)} title="Enviar whatsapp"><i className="bi bi-whatsapp"></i></Button>
                <Button variant="link" onClick={this.atualizarQuery.bind(this)} title="Atualizar"><i className="bi bi-arrow-repeat"></i></Button>
                <Button variant="link" onClick={this.sendRIAR.bind(this)} title="Enviar para governo"><i className="bi bi-send"></i></Button>
              </div>
              <button onClick={this.handleFileSelect.bind(this)} id="importFile" title="Go to top">+ Importar Arquivo</button>
              <input type='file' id='file' ref={this.inputFile} style={{ display: 'none' }} />

              {this.renderTable()}

              {this.renderEmptyRegisters()}

              {/* TODO: carregando
          */}

              {this.renderModalLoadedFields()}
              {this.renderModalTransmissionDetails()}
              
            </div>
          </div>
        </main>
      </div>
    )
  }
}


//file update
//https://www.geeksforgeeks.org/file-uploading-in-react-js/

//https://codepen.io/rkotze/pen/zjRXYr


//outra opção de scroll
/** https://stackoverflow.com/questions/39325581/how-to-add-scroll-event-in-react-component/39326139 */


//https://reactdatepicker.com/