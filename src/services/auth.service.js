import axios from "axios";

const API_URL = "http://localhost:8080/";

class AuthService {
  login(username, password, onSucess,onFail) {
    const params = { login: username, password:password };
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    return axios
      .post(API_URL + "login", params, {"Access-Control-Allow-Origin": "*"})
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        onSucess(response.data);
      })
      .catch(error => {
        onFail(error);
     //  console.error('There was an error!', error);
     //   throw new Error(error);
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
   getCurrentUser() {

    console.log("---------------------------------------getCurrentUser")
    return  JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
