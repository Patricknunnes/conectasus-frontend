import axios from 'axios';
import authHeader from './auth-header';
import EventBus from "../common/EventBus";
const API_URL = 'http://localhost:8080/';

class UserService {

  constructor(){
    this.props = null;
    this.configureInterceptor();
  }

  configureInterceptor() {
   
    let that = this;
    axios.interceptors.response.use(function (response) {
    //  console.log('=====>response'+response);
    //  console.log('=====>response'+response.data);
      console.log(that.props);
      if (response && response.headers && response.headers['x-acess-token']) {
        let user = JSON.parse(localStorage.getItem("user"))
        user.accessToken = response.headers['x-acess-token'];
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response;
    }, function (error) {
   
      if ((error.response && (error.response.status === 401 || error.response.status === 500 )) ) {
      
            EventBus.dispatch("logout");
        } else {
          if(that.props && that.props.history){
            that.props.history.push("/error");
          }else{
            EventBus.dispatch("logout");
          }
        }
    });

  }

  setProps(props){
    this.props = props;
  }

  getFirstPage(pageP, nameP, authStatusP, authDateP, transStatusP, transDataP, stateP) {

    let config = {
      headers: authHeader(),
      params: {
        page: pageP,
        name: nameP, 
        authStatus: authStatusP, 
        authDate: authDateP, 
        transStatus: transStatusP, 
        transData: transDataP, 
        state: stateP
      },
    }

    return axios.get(API_URL + 'patients/sizedata', config);
  }

  /**
   * 
   * @param {*} pageP 
   * @param {*} nameP 
   * @param {*} authStatusP 
   * @param {*} authDateP 
   * @param {*} transStatusP 
   * @param {*} transDataP 
   * @param {*} stateP Estado (país)
   * @returns 
   */
 /* getFilteredData(pageP, nameP, authStatusP, authDateP, transStatusP, transDataP, stateP) {

    let config = {
      headers: authHeader(),
      params: {
        page: pageP,
        name: nameP, 
        authStatus: authStatusP, 
        authDate: authDateP, 
        transStatus: transStatusP, 
        transData: transDataP, 
        state: stateP
      },
    }
    
  //  return axios.get(API_URL + 'patients/filter', config);
 // return axios.get(API_URL + 'patients/'+pageP, config);
  
  }*/

  getNextPage(pageP, nameP, authStatusP, authDateP, transStatusP, transDataP, stateP) {

    let config = {
      headers: authHeader(),
      params: {
        page: pageP,
        name: nameP, 
        authStatus: authStatusP, 
        authDate: authDateP, 
        transStatus: transStatusP, 
        transData: transDataP, 
        state: stateP
      },
    }
    return axios.get(API_URL + 'patients/'+pageP, config);
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append("vacinas", file);
    let header = authHeader() ;
     header = {...header, "Content-Type": `multipart/form-data; boundary=${formData._boundary}`};
    return axios.post(API_URL +"xlsx/upload", formData, {headers: header});
  }

  loadFile(fileToLoad) {
    const body = {file: fileToLoad };
    return axios.post(API_URL +"xlsx/load", body, { headers: authHeader() }); 
  }

  //TODO - unificar tudo com request de baixo, por cpf
  requestAutorizathion(data) {
    const body = {registers: data };
    return axios.post(API_URL +"contact/requestAutorizathion", body, { headers: authHeader() }); 
  }

  requestAutorizathionByCPF(data) {
    const body = {registers: data };
    return axios.post(API_URL +"contact/requestAutorizathionCPF", body, { headers: authHeader() }); 
  }

  sendRIARByCPF(data) {
    const body = {registers: data };
    return axios.post(API_URL +"government/sendRIAR", body, { headers: authHeader() }); 
  }

}

export default new UserService();
