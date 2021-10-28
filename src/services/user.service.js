import axios from 'axios';
import authHeader from './auth-header';
import EventBus from "../common/EventBus";

const API_URL = 'http://localhost:8080/';

class UserService {

  constructor(){
    this.configureInterceptor();
  }

  configureInterceptor() {

    axios.interceptors.response.use(function (response) {
      return response;
  }, function (error) {
    console.log('Pelo interceptor');
    if (error.response && (error.response.status === 401 || error.response.status === 500 )) {
       
        if (error.response && (error.response.status === 401 || error.response.status === 500 )) {
          EventBus.dispatch("logout");
        }
      } else {
          return Promise.reject(error);
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
