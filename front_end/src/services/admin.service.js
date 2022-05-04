// The program is for the admin service functions
// PROGRAMMER: Domica Santoso
// The program is called from the admin user page
// Revised on 5/5/2022

import axios from "axios";
var params = require("../params/params");

const ADMIN_URL = params.baseBackURL + "/admin/";

class AdminService {

    querySID(currentUser, sid) {
        let temp_url = "query/sid/" + sid;
        return axios.get(ADMIN_URL + temp_url,  {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
    }

    queryEventId(currentUser, eventId) {
        let temp_url = "query/event/" + eventId;
        return axios.get(ADMIN_URL + temp_url,  {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
    }

    loadRecentUsersAndEvents(currentUser) {
        // console.log("Load called");
        let temp_url = "query/recent";
        return axios.get(ADMIN_URL + temp_url,  {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
    }
    
    deleteSelectedEvent(currentUser, eventId, password) {
        let temp_url = "event/" + eventId + "/delete";
        let adminReqSID = currentUser.sid;
        let adminReqPassword = password;

        return axios.post(ADMIN_URL + temp_url, {
            adminReqSID,
            adminReqPassword
          }, 
          {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    deleteSelectedUser(currentUser, sid, password) {
        let temp_url = "user/" + sid + "/delete";
        let adminReqSID = currentUser.sid;
        let adminReqPassword = password;
        
        return axios.post(ADMIN_URL + temp_url, {
            adminReqSID,
            adminReqPassword
          }, 
          {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    changeUserPass(currentUser, sid, password, newUserPass) {
        let temp_url = "user/" + sid + "/updatepassword";
        let adminReqSID = currentUser.sid;
        let adminReqPassword = password;
        
        return axios.post(ADMIN_URL + temp_url, {
            adminReqSID,
            adminReqPassword,
            newUserPass
          }, 
          {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    deleteRating(currentUser, targetSID, password, commenterSID) {
        let temp_url = "user/" + targetSID + "/removerating";
        let adminReqSID = currentUser.sid;
        let adminReqPassword = password;

        return axios.post(ADMIN_URL + temp_url, {
            adminReqSID,
            adminReqPassword,
            commenterSID
          }, 
          {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    deleteEventComment(currentUser, targetEventId, password, commentId) {
        let temp_url = "event/" + targetEventId + "/removecomment";
        let adminReqSID = currentUser.sid;
        let adminReqPassword = password;

        return axios.post(ADMIN_URL + temp_url, {
            adminReqSID,
            adminReqPassword,
            commentId
          }, 
          {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }
}

export default new AdminService();