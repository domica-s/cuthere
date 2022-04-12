import React, { useState, useEffect, Component } from "react";
import AuthService from "../services/auth.service";
import {Button, Container} from "react-bootstrap";
import "./myProfile.css"
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { useParams } from "react-router-dom";
import history from "../history";
import UserRating from "./UserRating";
import Axios from 'axios' 
var params = require("../params/params");
const API_Query = params.baseBackURL + "/file/";


function ViewProfile()  {
  let {sid} = useParams();

  const initialUser = authService.getCurrentUser();

  if (initialUser.sid == sid) {
    console.log("here");
    history.push({
      pathname: '/profile',
    });
    history.go();
  }



  const INITIAL_STATE = {
    username: "USER_NOT_FOUND",
    name: "",
    email: "",
    mobileNumber: "",
    about: "",
    country: "",
    interests: [],
    friends: "",
    college: "", 
    rating: "",
    reviewHistory:[],
    message: "",
    posRating: 0,
    negRating: 0,
    };

    const onLoadPic = async(e) => {
      const img = document.querySelector("#profile-pic");
  
      let api = API_Query + "user-" + sid;
      const loadResult = await fetch(api, {
          method: "GET",
          headers: new Headers({
            "x-access-token": initialUser.accessToken,
          }),
      })
      const resultStatus = await loadResult.clone().status
      const resultBlob = await loadResult.blob();
      if (resultStatus === 200){
        img.crossOrigin = 'anonymous';
        img.src = await URL.createObjectURL(resultBlob);
      }
    }

  const [user, setUser] = useState(INITIAL_STATE);
  const [reviewHistory, setReviewHistory] = useState(INITIAL_STATE.reviewHistory)
  const [message, setMessage] = useState(INITIAL_STATE.message);
  const [fectched, setFetched] = useState(false);
  const [posRating, setPosRating] = useState(INITIAL_STATE.posRating);
  const [negRating, setNegRating] = useState(INITIAL_STATE.negRating);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
        const currentUser = authService.getCurrentUser();
        console.log(sid);
        const response = await Axios.get(`${params.baseBackURL}/user/${sid}`,
        {
            headers: {
                "x-access-token": currentUser.accessToken
            }
        });
        const responseData = await response.data;
        console.log(responseData);
        await setPosRating(responseData.posRating);
        await setNegRating(responseData.negRating);
        await setReviewHistory(responseData.reviewHistory);
        if (responseData) setFetched(true);           
    }
    if (!fectched) {
        fetchData();
    }

    
}, [reviewHistory, user])

  useEffect(() => {
      (async () => {
      try {
          const user = authService.getCurrentUser();
          let userFromDB;
          userService.getProfile(user, sid)
          .then(successResponse => {
            
            userFromDB = successResponse.data;
            setUser({
              username: userFromDB.username,
              email: userFromDB.email,
              mobileNumber: userFromDB.mobileNumber,
              name: userFromDB.name,
              about: userFromDB.about,
              country: userFromDB.country,
              interests: userFromDB.interests,
              friends: userFromDB.friends,
              college: userFromDB.college, 
              rating: userFromDB.rating,
              reviewHistory: userFromDB.reviewHistory,
            });

            setReviewHistory(userFromDB.reviewHistory);
            // setPosRating(userFromDB.posRating);
            // setNegRating(userFromDB.negRating);
            userService.getFolls(user, sid)
            .then(response => {
              // console.log("hello");
              console.log(response.data);
              let followers = (response.data.followers);
              let following = (response.data.following);
              console.log(followers);

              setFollowers(followers.length);
              setFollowing(following.length);

              // setFollowingList(following);
              // setFollowersList(followers);
            },
            error => {
              console.log(error.response.data);
            })

          },
          error => {
           
            console.log("error")
          })
          // setUser(user.data);
          
      } catch (error) {
          console.log(error);
      }
      })();
  }, []);

  async function followUser(){
    let userID = initialUser.sid;
    const request = await Axios.post(`${params.baseBackURL}/user/follow/${sid}`,{sid: userID},         
      {
          headers: {
              "x-access-token": initialUser.accessToken
          }
      })
      console.log(request);
      if (request.status == 202) {
        alert("You have followed this user");
      }
      else if (request.status == 200) {
        alert("User " + sid + " followed");
      }
  }

  async function unfollowUser() {
    let userID = initialUser.sid;
    const request = await Axios.post(
      `${params.baseBackURL}/user/unfollow/${sid}`,
      { sid: userID },
      {
        headers: {
          "x-access-token": initialUser.accessToken,
        },
      }
    );
    console.log(request);
    if (request.status == 202) {
      alert("You have not followed this user");
    } else if (request.status == 200) {
      alert("User " + sid + " unfollowed");
    }
  }

  async function addReview (writer, content, type){
    // Set the request's body
    const body = {
      sid: writer.sid,
      name: writer.name,
      content: content,
      type: type
     }

     // Set the request
    console.log(sid);

    // const request = await Axios.post(`http://localhost:8080/user/${sid}/comment`, body, {
    //   headers: {
    //       "x-access-token": writer.accessToken 
    //   }
    // })

    await Axios.post(`${params.baseBackURL}/user/${sid}/comment`, body, {
      headers: {
          "x-access-token": writer.accessToken // Whose access token is this?
      }
    })
    .then(res => {
      // console.log(res.data.message);
      // console.log(res.data.response);
      // console.log(res.data.response.reviewHistory);
      setReviewHistory(res.data.response.reviewHistory);
      setPosRating(res.data.response.posRating);
      setNegRating(res.data.response.negRating);
    },
    error => {
      // console.log(error.response.data.message);
      setMessage(error.response.data.message);
      alert("You don't have any same events as this guy")
    });
    
    // console.log(request)
    // // Store reviewHistory
    // console.log(request.data)
    // setReviewHistory(request.data.response.reviewHistory)

  }
      return (
        <Container className="myContainer">
              <div className="row">
                  <div className="col-lg-4">
                      <div className="card mt-3">
                          <div className="card-body">
                              <div className="d-flex flex-column align-items-center text-center">
                                  <img id="profile-pic" src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="" className="rounded-circle p-1" width="110" onLoad={onLoadPic}/>
                                  <div className="mt-3">
                                      <h4>@{user.username}</h4>
                                      <p className="text-secondary mb-1">{user.about || ""}</p>
                                      <Button className="btn btn-primary" style={{marginTop:"5px", marginRight: "5px"}} onClick={followUser}>Follow</Button>
                                      <Button className="btn btn-primary" style={{marginTop:"5px",marginLeftt: "5px"}} onClick={unfollowUser}>Unfollow</Button>
                                      <div className="card-body text-center">
                    <div className="row">
                        <div className="col-6 border-end border-light">
                            <p className="text-muted mt-1 mb-2 fw-normal">Followers</p>
                            <p className="mb-0 fw-bold" 
                            // onClick ={() => setModalOpen(true)}
                            >{followers || 0}</p>
                        </div>
                        <div className="col-6 border-dark">
                            <p className="text-muted mt-1 mb-2 fw-normal" style={{whiteSpace: "nowrap"}}>Following</p>
                            <p className="mb-0 fw-bold">{following || 0}</p>
                        </div>
                    </div>
                </div>
                                  </div>
                              </div>
                              <hr className="my-4" />
                              <ul className="list-group list-group-flush">
                                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                      <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 302 302"><path id="Imported Path" fill="black" fillOpacity="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M 242.21,82.23 C 239.59,78.71 239.62,73.99 242.28,70.79 256.48,53.83 271.09,39.92 284.88,28.82 297.03,19.04 281.18,11.91 277.63,10.41 205.28,-20.05 132.99,43.70 60.68,24.29 60.68,24.29 60.68,174.76 60.68,174.76 133.10,194.18 205.52,130.16 277.93,161.02 281.47,162.51 284.69,162.14 286.25,159.80 287.81,157.47 287.42,153.46 285.25,149.53 270.91,123.60 256.56,101.63 242.21,82.23 Z M 42.65,15.02 C 42.65,6.72 35.93,0.00 27.63,0.00 19.34,0.00 12.61,6.72 12.61,15.02 12.61,15.02 12.61,286.98 12.61,286.98 12.61,295.28 19.34,302.00 27.63,302.00 35.93,302.00 42.65,295.28 42.65,286.98 42.65,286.98 42.65,168.10 42.65,168.10 42.65,168.10 42.65,168.10 42.66,168.10 42.66,168.10 42.65,15.02 42.65,15.02 Z" /></svg> Country</h6>
                                      <span className="text-secondary">{user.country || ""}</span>
                                  </li>
                                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                      <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="0.9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 3.38,10.80 C 4.89,10.48 5.86,9.00 5.55,7.48 5.23,5.97 3.75,4.99 2.23,5.31 0.72,5.63 -0.26,7.11 0.06,8.63 0.38,10.14 1.86,11.12 3.38,10.80 Z M 24.00,8.06 C 24.00,9.60 22.75,10.86 21.20,10.86 19.65,10.86 18.40,9.60 18.40,8.06 18.40,6.51 19.65,5.25 21.20,5.25 22.75,5.25 24.00,6.51 24.00,8.06 Z M 21.77,12.08 C 21.77,12.08 19.15,11.54 19.15,11.54 18.26,11.35 17.39,11.76 16.92,12.48 16.47,12.25 15.99,12.05 15.47,11.89 15.47,11.89 15.47,10.33 15.47,10.33 15.47,9.16 14.51,8.20 13.34,8.20 13.34,8.20 10.67,8.20 10.67,8.20 9.49,8.20 8.53,9.16 8.53,10.33 8.53,10.33 8.53,11.89 8.53,11.89 8.02,12.06 7.54,12.26 7.09,12.49 6.62,11.76 5.74,11.35 4.85,11.54 4.85,11.54 2.24,12.08 2.24,12.08 1.09,12.32 0.35,13.46 0.59,14.61 0.59,14.61 1.24,17.75 1.24,17.75 1.48,18.89 2.62,19.64 3.77,19.40 3.77,19.40 4.59,19.23 4.59,19.23 5.01,19.84 5.58,20.40 6.31,20.88 7.84,21.88 9.86,22.43 12.00,22.43 15.28,22.43 18.10,21.11 19.40,19.22 19.40,19.22 20.24,19.40 20.24,19.40 21.39,19.64 22.53,18.89 22.76,17.75 22.76,17.75 23.42,14.61 23.42,14.61 23.66,13.46 22.91,12.32 21.77,12.08 Z M 12.00,21.36 C 10.06,21.36 8.25,20.87 6.90,19.98 6.44,19.68 6.05,19.34 5.74,18.98 5.74,18.98 6.38,18.85 6.38,18.85 7.53,18.61 8.27,17.47 8.03,16.32 8.03,16.32 7.44,13.51 7.44,13.51 7.79,13.32 8.15,13.16 8.53,13.02 8.53,13.02 8.53,13.54 8.53,13.54 8.53,14.71 9.49,15.67 10.67,15.67 10.67,15.67 13.34,15.67 13.34,15.67 14.51,15.67 15.47,14.71 15.47,13.54 15.47,13.54 15.47,12.99 15.47,12.99 15.86,13.13 16.22,13.29 16.56,13.47 16.56,13.47 15.97,16.32 15.97,16.32 15.73,17.47 16.47,18.61 17.62,18.85 17.62,18.85 18.26,18.99 18.26,18.99 17.07,20.40 14.71,21.36 12.00,21.36 Z M 14.76,4.37 C 14.76,5.92 13.50,7.17 11.96,7.17 10.41,7.17 9.15,5.92 9.15,4.37 9.15,2.82 10.41,1.57 11.96,1.57 13.50,1.57 14.76,2.82 14.76,4.37 Z" /></svg> Interests</h6>
                                      <span className="text-secondary">
                                      {user.interests.map((val, index) => {
                                        if (index != user.interests.length - 1) {
                                          return val + ", ";
                                        }
                                        else {
                                          return val;
                                        }
                                      }) || ""} </span>
                                  </li>
                                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                      <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 7.20,12.00 C 9.52,12.00 11.40,10.12 11.40,7.80 11.40,5.48 9.52,3.60 7.20,3.60 4.88,3.60 3.00,5.48 3.00,7.80 3.00,10.12 4.88,12.00 7.20,12.00 Z M 10.08,13.20 C 10.08,13.20 9.77,13.20 9.77,13.20 8.99,13.57 8.12,13.80 7.20,13.80 6.28,13.80 5.42,13.57 4.63,13.20 4.63,13.20 4.32,13.20 4.32,13.20 1.94,13.20 0.00,15.14 0.00,17.52 0.00,17.52 0.00,18.60 0.00,18.60 0.00,19.59 0.81,20.40 1.80,20.40 1.80,20.40 12.60,20.40 12.60,20.40 13.59,20.40 14.40,19.59 14.40,18.60 14.40,18.60 14.40,17.52 14.40,17.52 14.40,15.13 12.46,13.20 10.08,13.20 Z M 18.00,12.00 C 19.99,12.00 21.60,10.39 21.60,8.40 21.60,6.41 19.99,4.80 18.00,4.80 16.01,4.80 14.40,6.41 14.40,8.40 14.40,10.39 16.01,12.00 18.00,12.00 Z M 19.80,13.20 C 19.80,13.20 19.66,13.20 19.66,13.20 19.14,13.38 18.59,13.50 18.00,13.50 17.42,13.50 16.86,13.38 16.34,13.20 16.34,13.20 16.20,13.20 16.20,13.20 15.44,13.20 14.73,13.42 14.11,13.78 15.03,14.76 15.60,16.07 15.60,17.52 15.60,17.52 15.60,18.96 15.60,18.96 15.60,19.04 15.58,19.12 15.58,19.20 15.58,19.20 22.20,19.20 22.20,19.20 23.19,19.20 24.00,18.39 24.00,17.40 24.00,15.08 22.12,13.20 19.80,13.20 19.80,13.20 19.80,13.20 19.80,13.20 Z" /></svg> Friends</h6>
                                      <span className="text-secondary">{followers || 0} Followers  {following || 0} Following</span>
                                  </li>
                                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                      <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 17.98,9.32 C 17.98,9.32 14.52,8.82 14.52,8.82 14.52,8.82 12.98,5.69 12.98,5.69 12.79,5.32 12.42,5.08 12.00,5.08 11.58,5.08 11.21,5.32 11.02,5.69 11.02,5.69 9.48,8.82 9.48,8.82 9.48,8.82 6.02,9.32 6.02,9.32 5.61,9.38 5.27,9.67 5.14,10.07 5.02,10.46 5.12,10.89 5.42,11.18 5.42,11.18 7.92,13.62 7.92,13.62 7.92,13.62 7.33,17.06 7.33,17.06 7.26,17.47 7.43,17.88 7.76,18.13 8.10,18.37 8.54,18.40 8.91,18.21 8.91,18.21 12.00,16.58 12.00,16.58 12.00,16.58 15.09,18.21 15.09,18.21 15.25,18.29 15.42,18.33 15.60,18.33 15.60,18.33 15.60,18.33 15.60,18.33 16.20,18.33 16.69,17.84 16.69,17.24 16.69,17.16 16.68,17.08 16.66,17.00 16.66,17.00 16.08,13.62 16.08,13.62 16.08,13.62 18.58,11.18 18.58,11.18 18.88,10.89 18.98,10.46 18.86,10.07 18.73,9.67 18.39,9.38 17.98,9.32 Z M 12.00,0.00 C 5.38,0.00 0.00,5.38 0.00,12.00 0.00,18.62 5.38,24.00 12.00,24.00 18.62,24.00 24.00,18.62 24.00,12.00 24.00,5.38 18.62,0.00 12.00,0.00 Z M 12.00,21.82 C 6.59,21.82 2.18,17.41 2.18,12.00 2.18,6.59 6.59,2.18 12.00,2.18 17.41,2.18 21.82,6.59 21.82,12.00 21.82,17.41 17.41,21.82 12.00,21.82 Z M 218.00,32.00" /></svg> Rating</h6>
                                      <span className="text-secondary">{posRating || 0} <svg xmlns="http://www.w3.org/2000/svg" width="0.2in" height="0.2in" viewBox="0 0 503 503"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 495.17,235.68 C 479.95,198.73 451.19,179.97 409.66,179.97 409.66,179.97 382.40,179.97 359.88,179.97 368.30,160.95 377.67,133.36 377.67,100.12 377.67,91.01 376.96,81.56 375.23,71.93 368.69,33.29 342.31,12.74 304.82,16.86 289.97,18.57 284.87,32.66 272.57,66.83 262.36,95.16 248.37,133.95 228.08,165.14 213.16,188.06 186.59,206.15 164.27,217.29 164.27,217.29 164.27,214.46 164.27,214.46 164.27,214.46 0.00,214.46 0.00,214.46 0.00,214.46 0.00,458.54 0.00,458.54 0.00,458.54 164.31,458.54 164.31,458.54 164.31,458.54 164.31,445.09 164.31,445.09 190.17,443.81 204.87,444.57 208.33,445.67 208.33,445.67 237.73,462.75 237.73,462.75 237.73,462.75 259.70,476.45 259.70,476.45 281.05,487.96 374.43,489.06 414.48,483.12 465.96,475.61 478.39,433.41 478.91,431.60 482.97,417.61 518.39,292.04 495.17,235.68 Z M 447.89,422.73 C 447.59,423.65 440.10,446.77 409.79,451.11 366.71,457.52 286.79,453.64 274.94,447.98 275.03,448.05 255.45,435.76 255.45,435.76 255.45,435.76 218.52,415.02 218.52,415.02 209.95,412.15 190.52,411.82 164.31,412.99 164.31,412.99 164.31,252.22 164.31,252.22 190.78,241.51 231.77,218.52 255.15,182.75 277.51,148.43 292.23,107.61 302.98,77.76 302.98,77.76 312.46,54.16 314.75,48.70 331.11,48.79 340.13,57.79 343.50,77.28 344.84,84.92 345.36,92.50 345.36,99.82 345.36,148.19 320.51,186.70 320.14,187.18 320.14,187.18 303.76,212.15 303.76,212.15 303.76,212.15 409.66,212.20 409.66,212.20 437.98,212.20 455.12,223.23 465.33,247.96 481.39,286.93 458.08,387.37 447.89,422.73 Z" />
</svg> | {negRating || 0} <svg xmlns="http://www.w3.org/2000/svg" width="0.2in" height="0.2in" viewBox="0 0 503 503"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 478.90,71.44 C 478.40,69.63 465.95,27.45 414.51,19.88 374.50,14.01 281.04,15.06 259.76,26.59 259.76,26.59 237.72,40.27 237.72,40.27 237.72,40.27 208.41,57.35 208.35,57.35 205.02,58.43 190.28,59.22 164.45,57.95 164.45,57.95 164.45,44.48 164.45,44.48 164.45,44.48 0.00,44.48 0.00,44.48 0.00,44.48 0.00,288.55 0.00,288.55 0.00,288.55 164.40,288.55 164.40,288.55 164.40,288.55 164.40,285.70 164.40,285.70 186.64,296.84 213.25,314.93 228.08,337.87 248.45,369.04 262.48,407.82 272.58,436.10 284.88,470.31 290.00,484.45 304.87,486.09 342.34,490.27 368.69,469.71 375.26,431.05 376.94,421.42 377.69,411.99 377.69,402.88 377.69,369.62 368.31,342.06 359.89,323.04 382.42,323.04 409.70,323.04 409.70,323.04 451.19,323.04 479.96,304.24 495.13,267.27 518.40,210.98 483.07,85.43 478.90,71.44 Z M 465.32,255.01 C 455.20,279.74 437.98,290.80 409.75,290.80 409.75,290.80 303.81,290.80 303.81,290.80 303.81,290.80 320.26,315.79 320.26,315.79 320.52,316.24 345.43,354.75 345.43,403.14 345.43,410.43 344.84,417.99 343.57,425.69 340.18,445.16 331.16,454.18 314.78,454.31 312.55,448.75 303.04,425.18 303.04,425.18 292.35,395.35 277.61,354.53 255.25,320.21 231.92,284.47 190.82,261.46 164.45,250.74 164.45,250.74 164.45,89.98 164.45,89.98 190.65,91.21 209.95,90.80 218.56,87.95 218.56,87.95 255.60,67.21 255.60,67.21 255.60,67.21 275.13,54.93 275.00,54.99 286.85,49.32 366.75,45.50 409.90,51.84 440.09,56.24 447.69,79.36 447.97,80.31 458.16,115.71 481.38,216.09 465.32,255.01 Z" /></svg></span>
                                  </li>
                                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                      <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="0.9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" 
          d="M 5.00,15.00 C 4.45,15.00 4.00,15.45 4.00,16.00 4.00,16.55 4.45,17.00 5.00,17.00 5.55,17.00 6.00,16.55 6.00,16.00 6.00,15.45 5.55,15.00 5.00,15.00 Z M 5.00,11.00 C 4.45,11.00 4.00,11.45 4.00,12.00 4.00,12.55 4.45,13.00 5.00,13.00
               5.55,13.00 6.00,12.55 6.00,12.00
               6.00,11.45 5.55,11.00 5.00,11.00 Z
             M 19.00,15.00
             C 18.45,15.00 18.00,15.45 18.00,16.00
               18.00,16.55 18.45,17.00 19.00,17.00
               19.55,17.00 20.00,16.55 20.00,16.00
               20.00,15.45 19.55,15.00 19.00,15.00 Z
             M 19.00,11.00
             C 18.45,11.00 18.00,11.45 18.00,12.00
               18.00,12.55 18.45,13.00 19.00,13.00
               19.55,13.00 20.00,12.55 20.00,12.00
               20.00,11.45 19.55,11.00 19.00,11.00 Z
             M 12.00,17.00
             C 12.55,17.00 13.00,16.55 13.00,16.00
               13.00,15.45 12.55,15.00 12.00,15.00
               11.45,15.00 11.00,15.45 11.00,16.00
               11.00,16.55 11.45,17.00 12.00,17.00 Z
             M 12.00,13.00
             C 12.55,13.00 13.00,12.55 13.00,12.00
               13.00,11.45 12.55,11.00 12.00,11.00
               11.45,11.00 11.00,11.45 11.00,12.00
               11.00,12.55 11.45,13.00 12.00,13.00 Z
             M 12.00,9.00
             C 12.55,9.00 13.00,8.55 13.00,8.00
               13.00,7.45 12.55,7.00 12.00,7.00
               11.45,7.00 11.00,7.45 11.00,8.00
               11.00,8.55 11.45,9.00 12.00,9.00 Z
             M 23.00,8.00
             C 23.00,8.00 21.00,8.00 21.00,8.00
               21.00,8.00 21.00,7.00 21.00,7.00
               21.00,6.45 20.55,6.00 20.00,6.00
               19.45,6.00 19.00,6.45 19.00,7.00
               19.00,7.00 19.00,8.00 19.00,8.00
               19.00,8.00 17.00,8.00 17.00,8.00
               17.00,8.00 17.00,3.00 17.00,3.00
               17.00,2.45 16.55,2.00 16.00,2.00
               16.00,2.00 15.00,2.00 15.00,2.00
               15.00,2.00 15.00,1.00 15.00,1.00
               15.00,0.45 14.55,0.00 14.00,0.00
               13.45,0.00 13.00,0.45 13.00,1.00
               13.00,1.00 13.00,2.00 13.00,2.00
               13.00,2.00 11.00,2.00 11.00,2.00
               11.00,2.00 11.00,1.00 11.00,1.00
               11.00,0.45 10.55,0.00 10.00,0.00
               9.45,0.00 9.00,0.45 9.00,1.00
               9.00,1.00 9.00,2.00 9.00,2.00
               9.00,2.00 8.00,2.00 8.00,2.00
               7.45,2.00 7.00,2.45 7.00,3.00
               7.00,3.00 7.00,8.00 7.00,8.00
               7.00,8.00 5.00,8.00 5.00,8.00
               5.00,8.00 5.00,7.00 5.00,7.00
               5.00,6.45 4.55,6.00 4.00,6.00
               3.45,6.00 3.00,6.45 3.00,7.00
               3.00,7.00 3.00,8.00 3.00,8.00
               3.00,8.00 1.00,8.00 1.00,8.00
               0.45,8.00 0.00,8.45 0.00,9.00
               0.00,9.00 0.00,23.00 0.00,23.00
               0.00,23.55 0.45,24.00 1.00,24.00
               1.00,24.00 8.00,24.00 8.00,24.00
               8.00,24.00 16.00,24.00 16.00,24.00
               16.00,24.00 23.00,24.00 23.00,24.00
               23.55,24.00 24.00,23.55 24.00,23.00
               24.00,23.00 24.00,9.00 24.00,9.00
               24.00,8.45 23.55,8.00 23.00,8.00 Z
             M 2.00,10.00
             C 2.00,10.00 7.00,10.00 7.00,10.00
               7.00,10.00 7.00,22.00 7.00,22.00
               7.00,22.00 2.00,22.00 2.00,22.00
               2.00,22.00 2.00,10.00 2.00,10.00 Z
             M 9.00,9.00
             C 9.00,9.00 9.00,4.00 9.00,4.00
               9.00,4.00 15.00,4.00 15.00,4.00
               15.00,4.00 15.00,9.00 15.00,9.00
               15.00,9.00 15.00,22.00 15.00,22.00
               15.00,22.00 13.00,22.00 13.00,22.00
               13.00,22.00 13.00,20.00 13.00,20.00 13.00,19.45 12.55,19.00 12.00,19.00 11.45,19.00 11.00,19.45 11.00,20.00 11.00,20.00 11.00,22.00 11.00,22.00 11.00,22.00 9.00,22.00 9.00,22.00 9.00,22.00 9.00,9.00 9.00,9.00 Z M 22.00,22.00 C 22.00,22.00 17.00,22.00 17.00,22.00 17.00,22.00 17.00,10.00 17.00,10.00 17.00,10.00 22.00,10.00 22.00,10.00 22.00,10.00 22.00,22.00 22.00,22.00 22.00,22.00 22.00,22.00 22.00,22.00 Z" /></svg> College</h6>
                                      <span className="text-secondary">{user.college || ""}</span>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
  
  
  
                  <div className="col-lg-8">
                      <div className="card mt-3">
                          <div className="card-body">
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <h6 className="mb-0">Full Name</h6>
                                  </div>
                                  <div className="col-sm-9 text-secondary">
                                      <input type="text" className="form-control" value={user.name || ""} disabled
                    readOnly />
                                  </div>
                              </div>
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <h6 className="mb-0">Email</h6>
                                  </div>
                                  <div className="col-sm-9 text-secondary">
                                      <input type="text" className="form-control" value={user.email || ""} disabled
                    readOnly />
                                  </div>
                              </div>
                              <div className="row mb-3">
                                  <div className="col-sm-3">
                                      <h6 className="mb-0">Mobile Number</h6>
                                  </div>
                                  <div className="col-sm-9 text-secondary">
                                      <input type="text" className="form-control" value={user.mobileNumber || ""} disabled
                    readOnly />
                                  </div>
                              </div>
                <div className="row">
                              <div className="col-sm-12">
                                  <div className="card">
                                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">Friends/ Activities placeholder</h5>
                        {/* START HERE FOR CHANGING ACTIVITIES PLACEHOLDER */}
                        <UserRating
                        reviewHistory= {reviewHistory}
                        addReview = {addReview}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                          </div>
                      </div>
                  </div>
              </div>
              
        </Container>
      );
    }

  export default ViewProfile;