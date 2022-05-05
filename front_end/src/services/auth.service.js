// The program is for the Authorization services and functionalities
// PROGRAMMER: Domica and Pierson
// The program is called whenever any authorization function is required
// Revised on 5/5/2022

import axios from "axios";
var params = require("../params/params");

const API_URL = params.baseBackURL + "/api/auth/";
class AuthService {
                                                /*
        This is a class component which deals with all the authorization services required
    */
  login(sid, password) {
                                            /*
        This function aims to handle the authorization related to logging in the web applciation
        Requirements(Parameters): The 1) sid is passed as sid and 2) password is passed as password
        This function is called when a user tries to log in the app / presses the log in button
    */
    return axios
      .post(API_URL + "signin", 
        {
            sid,
            password
        })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(response.data);
          localStorage.setItem("isAuthenticated", "true");
        }
        return response.data;
      })
  }

  register(username, sid, password, repassword, college, interests) {
                                                /*
        This function aims to handle the authorization related to registering with the app
        Requirements(Parameters): The 1) sid is passed as sid and 2) password is passed as password. 3)username is passed as username, 4) retype password is passed as repassword, 5) User's college is passed as college, and 6) The list of interests is passed as interests
        This function is called when a user tries to log in the app / presses the log in button
    */
    return axios.post(API_URL + "signup", {
      username,
      sid,
      password,
      repassword,
      college,
      interests,
    });
  }

  resendVerification(sid) {
                                    /*
        This function aims to handle the authorization related to resending the verification in the app
        Requirements(Parameters): The sid is passed as sid
        This function is called when a user presses the resend verification button / link
    */
    let temp_url = "resendverification/" + sid;
    return axios.get(API_URL + temp_url);
  }

  forgotPassword(sid) {
    let temp_url = "forgotpassword/" + sid;

    return axios.get(API_URL + temp_url);
  }

  changePassword(currentUser, oldPassword, newPassword, newRepassword) {
                                        /*
        This function aims to handle the authorization related to changing password
        Requirements(Parameters): 1) The current user's object data is passed as currentUser, 2) the user's old password is passed as oldPassword, 3) the user's new password is passed as newPassword and 4) the retype new password is passed as newRepassword
        This function is called when a user presses the change password button
    */
    let temp_url = "changepassword";
    let sid = currentUser.sid;

    return axios.post(API_URL + temp_url, {
      sid,
      oldPassword,
      newPassword,
      newRepassword
    },
    {headers: {
      "x-access-token": currentUser.accessToken
    }});
  }

  resetPassword(sid, token, password, repassword) {
                                            /*
        This function aims to handle the authorization related to resetting the password
        Requirements(Parameters): 1) The sid of the user to reset pw is passed as sid, 2) the token related to the authorization is passed as token, 3) the user's new password is passed as password and 4) the retype password is passed as repassword
        This function is called when a user presses reset password
    */
    let temp_url = "passwordreset/" + sid + "/" +  token;
    return axios.post(API_URL + temp_url, {
      password,
      repassword
    });
  }

  getCurrentUser() { 
                            /*
        This function aims to get the current user
    */
    return JSON.parse(localStorage.getItem('user'));;
  }

  updateProfile(currentUser, mobileNumber, interests, about, name, country) {
                          /*
        This function aims to handle the authorization related to updating the profile
        Requirements(Parameters): 1) The current user's object data is passed as currentUser, 2) the user's mobile number as mobileNumber, 3) the user's interests as interests, 4) contents for the about as about, 5) name as name, and 6) country as country
        This function is called when a user presses the update profile button
    */
    let sid = currentUser.sid;
    
    return axios.post(params.baseBackURL + "/profile/update", {
      sid,
      mobileNumber,
      interests,
      about,
      name,
      country,
    },
    {headers: {
      "x-access-token": currentUser.accessToken
    }})
  }

  
}

export default new AuthService();