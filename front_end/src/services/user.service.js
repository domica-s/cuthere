import axios from "axios";
var params = require("../params/params");

// const API_URL = "http://localhost:8080/api/auth/";
const USER_URL = params.baseBackURL + "/user/";

class UserService {

    getProfile(currentUser, targetSID) {
        let temp_url = targetSID;
        
        return axios.get(USER_URL + temp_url, {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        }) 
    }

    comment(currentUser, targetSID, type, content) {
        let temp_url = targetSID + "/comment";
        let sourceSID =  currentUser.sid;

        return axios.post(USER_URL + temp_url, {
            sid: sourceSID,
            type,
            content
        }, 
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    updateComment(currentUser, targetSID, newType, newContent) {
        let temp_url = targetSID + "/comment/update";
        let sourceSID =  currentUser.sid;

        return axios.post(USER_URL + temp_url, {
            sid: sourceSID,
            newType,
            newContent
        }, 
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        })
    }

    async recommendFriends(currentUser) {
        let temp_url1 = "/recommendfriends/college";
        let temp_url2 = "/recommendfriends/interests";
        let sid = currentUser.sid;
        let college = currentUser.college;

        try {
            const fromCollege = await axios.post(USER_URL + temp_url1, {
                college,
                sid
            },
            {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            })

            const fromInterests = await axios.post(USER_URL + temp_url2, {
                sid
            },
            {
                headers: {
                    "x-access-token": currentUser.accessToken
                }
            })
            let result = {fromCollege, fromInterests};
            // console.log(result);
            return result;
        }
        catch (err) {
            return {message: "Failed loading recommendations"};
        }
    }
}

export default new UserService();