// The program is for the admin service functions
// PROGRAMMER: Domica Santoso
// The program is called when the admin dashboard is opened
// Revised on 5/5/2022

import axios from "axios";
var params = require("../params/params");

const ADMIN_URL = params.baseBackURL + "/admin/";

class AdminService {
                                          /*
        This is a class component related to the admin services
    */
    querySID(currentUser, sid) {
                                                  /*
        This function aims to query the user based on SID 
        Requirements(Parameters): The 1) current user's data stored in object structure is passed as currentUser and 2) the sid of the user to query is passed as sid
        This function is called when the user presses the button in the query user by SID
    */
        let temp_url = "query/sid/" + sid;
        return axios.get(ADMIN_URL + temp_url,  {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
    }

    queryEventId(currentUser, eventId) {
                                                          /*
        This function aims to query the event based on event id 
        Requirements(Parameters): The 1) current user's data stored in object structure is passed as currentUser and 2) the id of the event to query is passed as eventId
        This function is called when the user presses the button in the query event by id
    */
        let temp_url = "query/event/" + eventId;
        return axios.get(ADMIN_URL + temp_url,  {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
    }

    loadRecentUsersAndEvents(currentUser) {
                                                   /*
        This function aims to load all the recent users and event
        Requirements(Parameters): The current user's data stored in object structure is passed as currentUser
        This function is called when the admin dashboard is loaded
    */
        let temp_url = "query/recent";
        return axios.get(ADMIN_URL + temp_url,  {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
    }
    
    deleteSelectedEvent(currentUser, eventId, password) {
                                                           /*
        This function aims to delete a selected event
        Requirements(Parameters): 1) The current user's data stored in object structure is passed as currentUser, 2) The id of the event to be deleted is passed as eventId and 3) The password of the admin is passed as password
        This function is called when the admin presses the delete event button
    */
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
                                            /*
        This function aims to delete a selected user
        Requirements(Parameters): 1) The current user's data stored in object structure is passed as currentUser, 2) The sid of the user to be deleted is passed as sid and 3) The password of the admin is passed as password
        This function is called when the admin presses the delete user button
    */
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
                                                    /*
        This function aims to change the password of a selected user
        Requirements(Parameters): 1) The current user's data stored in object structure is passed as currentUser, 2) The sid of the user to have their password changed is passed as sid and 3) The password of the admin is passed as password, 4) THe new password for the user is passed as newUserPass
        This function is called when the admin presses the change user password button
    */
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
                                                    /*
        This function aims to delete a specific user rating 
        Requirements(Parameters): 1) The current user's data stored in object structure is passed as currentUser, 2) The sid of the user to have a rating in their page deleted is passed as targetSID and 3) The password of the admin is passed as password, 4) THe commentor's sid is passed as commenterSID
        This function is called when the admin presses the delete rating button
    */
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
                                                /*
        This function aims to delete a specific comment in a specific event
        Requirements(Parameters): 1) The current user's data stored in object structure is passed as currentUser, 2) The id of the event to have a rating deleted is passed as targetEventId and 3) The password of the admin is passed as password, 4) THe comment id to be deleted is passed as commentId
        This function is called when the admin presses the delete comment button
    */
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