import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class UserService {

  getFirstPage() {
    return axios.get(API_URL + 'patients/sizedata',{ headers: authHeader() });
  }

  getNextPage(page) {
    return axios.get(API_URL + 'patients/'+page,{ headers: authHeader() });
  }

  uploadFile(file) {

    const formData = new FormData();

    // 'fileimage' é o campo que o 'multer' procura o arquivo de imagem.
    formData.append("vacinas", file);
    let header = authHeader() ;

     header = {...header, "Content-Type": `multipart/form-data; boundary=${formData._boundary}`};

    return axios.post(API_URL +"xlsx/upload", formData, {headers: header});


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
