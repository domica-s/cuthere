import axios from "axios";
var params = require("../params/params");

// const API_URL = "http://localhost:8080/api/auth/";
const API_URL = params.baseBackURL + "/api/auth/";
class AuthService {
  login(sid, password) {
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
  }

  register(username, sid, password, repassword) {
    return axios.post(API_URL + "signup", {
      username,
      sid,
      password,
      repassword
    });
  }

  resendVerification(sid) {
    let temp_url = "resendverification/" + sid;
    return axios.get(API_URL + temp_url);
  }

  forgotPassword(sid) {
    let temp_url = "forgotpassword/" + sid;

    return axios.get(API_URL + temp_url);
  }

  changePassword(sid, oldPassword, newPassword) {
    let temp_url = "changepassword";
    // get oldPassword and newPassword from form fields, check forgotPassword for reference
    // get sid from state -> user.sid
    return axios.post(API_URL + temp_url, {
      sid,
      oldPassword,
      newPassword
    });
  }

  resetPassword(sid, token, password, repassword) {
    let temp_url = "passwordreset/" + sid + "/" +  token;
    return axios.post(API_URL + temp_url, {
      password,
      repassword
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }

  updateProfile(currentUser, mobileNumber, interests, about) {
    let sid = currentUser.user.sid;
    
    return axios.post(params.baseBackURL + "/profile/update", {
      sid,
      mobileNumber,
      interests,
      about
    },
    {headers: {
      "x-access-token": currentUser.accessToken
    }})
  }

  
}

export default new AuthService();