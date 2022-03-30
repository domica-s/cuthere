import axios from "axios";
var params = require("../params/params");

// const API_URL = "http://localhost:8080/api/auth/";
const USER_URL = params.baseBackURL + "/user/";

class UserService {

    comment(currentUser, targetSID, content) {
        let temp_url = targetSID + "/comment";
        let sourceSID =  currentUser.sid;

        return axios.post(USER_URL + temp_url, {
            sid: sourceSID,
            content
        }, 
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    updateComment(currentUser, targetSID, newContent) {
        let temp_url = targetSID + "/comment/update";
        let sourceSID =  currentUser.sid;

        return axios.post(USER_URL + temp_url, {
            sid: sourceSID,
            newContent
        }, 
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }
}

export default new UserService();