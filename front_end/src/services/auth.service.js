import axios from "axios";
var params = require("../params/params");

// const API_URL = "http://localhost:8080/api/auth/";
const API_URL = params.baseBackURL + "/api/auth/";
class AuthService {
  login(sid, password) {
      // console.log("Called login in Authservice");
    return axios
        .post(API_URL + "signin", 
            {
                sid,
                password
            })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("isAuthenticated", "true");
        }
        return response.data;
      })
      // .catch((error) => {
      //     console.log(error);
      // });
  }

  register(username, sid, password) {
    return axios.post(API_URL + "signup", {
      username,
      sid,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }

  
}

export default new AuthService();