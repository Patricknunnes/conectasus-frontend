import axios from 'axios';
import authHeader from './auth-header';
import EventBus from "../common/EventBus";
import { useHistory } from 'react-router-dom';

const API_URL = 'http://localhost:8080/';

class UserService {


  constructor(){
    this.props = null;
    this.configureInterceptor();
   
  }

  setProps(props){
    this.props = props;
  }

  getProps(){
    return   this.props;
  }

  configureInterceptor() {
   
    let props = this.props;
    axios.interceptors.response.use(function (response) {

      if (response && response.headers && response.headers['x-acess-token']) {

        let user = JSON.parse(localStorage.getItem("user"))
        user.accessToken = response.headers['x-acess-token'];
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response;
  }, function (error) {
    console.log('Pelo interceptor');
    if ((error.response && (error.response.status === 401 || error.response.status === 500 )) ) {
          EventBus.dispatch("logout");
      } else {
        EventBus.dispatch("error");
    //    props.history.push("/error");
      //  this.context.history.push('/path')

    //    const history = useHistory();
     //   history.push("/error");
        //  return Promise.reject(error);
      }
  });

  }


  getFirstPage() {
    return axios.get(API_URL + 'patients/sizedata',{ headers: authHeader() });
  }

  getNextPage(page) {
    return axios.get(API_URL + 'patients/'+page,{ headers: authHeader() });
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

  requestAutorizathion(data) {
    const body = {registers: data };
    return axios.post(API_URL +"contact/requestAutorizathion", body, { headers: authHeader() }); 
  }

  /*

  getUserBoard() {
    return axios.get(API_URL + 'patients/1', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'patients/1', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'patients/1', { headers: authHeader() });
  }*/
}

export default new UserService();
