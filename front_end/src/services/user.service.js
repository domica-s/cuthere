// The program is for the User Services / load user profile functionalities
// PROGRAMMER: Domica and Pierson
// The program is called when the user profile is opened
// Revised on 5/5/2022

import axios from "axios";
var params = require("../params/params");
const USER_URL = params.baseBackURL + "/user/";

class UserService {
                                          /*
        This is a class component related to the user services
    */
    getProfile(currentUser, targetSID) {
                                        /*
        This function aims to go to a specific user's page
        Requirements(Parameters): The 1) current user's data stored in object structure is passed as currentUser and 2) the sid of the target user to be passed as targetSID
        This function is called when a user loads the profile of another
    */
        let temp_url = targetSID;
        
        return axios.get(USER_URL + temp_url, {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        }) 
    }

    comment(currentUser, targetSID, type, content) {
                                                /*
        This function aims to handle the commenting / leaving a rating in another user's page
        Requirements(Parameters): The 1) current user's data stored in object structure is passed as currentUser and 2) the sid of the target user to be passed as targetSID, 3) the type of comment is passed as type, 4) the content of the comment is passed as content
        This function is called when a user presses the leave a rating button in another's profile
    */
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
                                                /*
        This function aims to handle the updating the rating / comment in another user's profile
        Requirements(Parameters): The 1) current user's data stored in object structure is passed as currentUser and 2) the sid of the target user to be passed as targetSID, 3) the type of comment is passed as newType, 4) the content of the comment is passed as newContent
        This function is called when a user presses the changes a rating and presses the update rating button in another user's profile
    */
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
                                                        /*
        This function aims to handle the recommending of a friend based on college
        Requirements(Parameters): The current user's data stored in object structure is passed as currentUser
        This function is called immediately when the user's profile is loaded up
    */
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

    getFolls(currentUser, targetSID) {
                                                                /*
        This function aims to handle fetching data on the followers of the specific user from the back end
        Requirements(Parameters): 1) The current user's data stored in object structure is passed as currentUser, 2) the sid of the target user to be passed as targetSID
        This function is called immediately when the user's profile is loaded up
    */
        let temp_url = "folls";
        
        return axios.post(USER_URL + temp_url, {
            sid: targetSID
        },
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        }) 
    }
}

export default new UserService();