import React, { useState, useEffect, Component } from "react";
import AuthService from "../services/auth.service";
import {Button, Container} from "react-bootstrap";
import "./myProfile.css"
import authService from "../services/auth.service";
import userService from "../services/user.service";
var params = require("../params/params");


//change user.user.attr into user.attr
//change friend/activities placeholder


function Profile()  {


  const API = params.baseBackURL + "/file/upload";
  const API_DELETE = params.baseBackURL + "/file/delete";
  const API_Query = params.baseBackURL + "/file/";
  const initialUser = authService.getCurrentUser();

  const onLoadPic = async(e) => {
    const img = document.querySelector("#profile-pic");

    let api = API_Query + "user-" + initialUser.sid;
    const loadResult = await fetch(api, {
        method: "GET",
        headers: new Headers({
          "x-access-token": initialUser.accessToken,
        }),
    })

    const resultBlob = await loadResult.blob();
    img.crossOrigin = 'anonymous';
    img.src = await URL.createObjectURL(resultBlob);
  }

    
    const INITIAL_STATE = {
      username: initialUser.username,
      name: initialUser.name,
      email: initialUser.email,
      mobileNumber: initialUser.mobileNumber,
      about: initialUser.about,
      country: initialUser.country,
      interests: initialUser.interests,
      friends: initialUser.friends,
      college: initialUser.college, 
      rating: initialUser.rating,
    };
    const [user, setUser] = useState(INITIAL_STATE);

    useEffect(() => {
        (async () => {
        try {
            const user = authService.getCurrentUser();
            let userFromDB;
            userService.getProfile(user, user.sid)
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
              });

    
            },
            error => {
             
              setUser({
                username: user.username,
                email: user.email,
                mobileNumber: user.mobileNumber,
                name: user.name,
                about: user.about,
                country: user.country,
                interests: user.interests,
                friends: user.friends,
                college: user.college, 
                rating: user.rating,
              });
            })
            // setUser(user.data);
            
        } catch (error) {
            console.log(error);
        }
        })();
    }, []);
    
    return (
      <Container className="myContainer">
        {/* <div className="container">
		<div className="main-body"> */}
			<div className="row">


				<div className="col-lg-4">
					<div className="card mt-3">
						<div className="card-body">
							<div className="d-flex flex-column align-items-center text-center">
								<img src="https://bootdey.com/img/Content/avatar/avatar6.png" id="profile-pic" alt="profile-pic" className="rounded-circle p-1 bg-primary" width="110" onLoad={onLoadPic}/>
								<div className="mt-3">
									<h4>@{user.username}</h4>
									<p className="text-secondary mb-1">{user.about || ""}</p>
									<Button className="btn btn-primary" style={{marginRight:"5px"}}>Add Friend</Button>
									<Button className="btn btn-outline-primary">Message</Button>
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
									<span className="text-secondary">{user.interests || ""}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 7.20,12.00 C 9.52,12.00 11.40,10.12 11.40,7.80 11.40,5.48 9.52,3.60 7.20,3.60 4.88,3.60 3.00,5.48 3.00,7.80 3.00,10.12 4.88,12.00 7.20,12.00 Z M 10.08,13.20 C 10.08,13.20 9.77,13.20 9.77,13.20 8.99,13.57 8.12,13.80 7.20,13.80 6.28,13.80 5.42,13.57 4.63,13.20 4.63,13.20 4.32,13.20 4.32,13.20 1.94,13.20 0.00,15.14 0.00,17.52 0.00,17.52 0.00,18.60 0.00,18.60 0.00,19.59 0.81,20.40 1.80,20.40 1.80,20.40 12.60,20.40 12.60,20.40 13.59,20.40 14.40,19.59 14.40,18.60 14.40,18.60 14.40,17.52 14.40,17.52 14.40,15.13 12.46,13.20 10.08,13.20 Z M 18.00,12.00 C 19.99,12.00 21.60,10.39 21.60,8.40 21.60,6.41 19.99,4.80 18.00,4.80 16.01,4.80 14.40,6.41 14.40,8.40 14.40,10.39 16.01,12.00 18.00,12.00 Z M 19.80,13.20 C 19.80,13.20 19.66,13.20 19.66,13.20 19.14,13.38 18.59,13.50 18.00,13.50 17.42,13.50 16.86,13.38 16.34,13.20 16.34,13.20 16.20,13.20 16.20,13.20 15.44,13.20 14.73,13.42 14.11,13.78 15.03,14.76 15.60,16.07 15.60,17.52 15.60,17.52 15.60,18.96 15.60,18.96 15.60,19.04 15.58,19.12 15.58,19.20 15.58,19.20 22.20,19.20 22.20,19.20 23.19,19.20 24.00,18.39 24.00,17.40 24.00,15.08 22.12,13.20 19.80,13.20 19.80,13.20 19.80,13.20 19.80,13.20 Z" /></svg> Friends</h6>
									<span className="text-secondary">{user.friends || ""}</span>
								</li>
                				<li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
									<h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="0.266667in" height="0.266667in" viewBox="0 0 24 24"><path id="Imported Path" fill="black" fillOpacity="1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M 17.98,9.32 C 17.98,9.32 14.52,8.82 14.52,8.82 14.52,8.82 12.98,5.69 12.98,5.69 12.79,5.32 12.42,5.08 12.00,5.08 11.58,5.08 11.21,5.32 11.02,5.69 11.02,5.69 9.48,8.82 9.48,8.82 9.48,8.82 6.02,9.32 6.02,9.32 5.61,9.38 5.27,9.67 5.14,10.07 5.02,10.46 5.12,10.89 5.42,11.18 5.42,11.18 7.92,13.62 7.92,13.62 7.92,13.62 7.33,17.06 7.33,17.06 7.26,17.47 7.43,17.88 7.76,18.13 8.10,18.37 8.54,18.40 8.91,18.21 8.91,18.21 12.00,16.58 12.00,16.58 12.00,16.58 15.09,18.21 15.09,18.21 15.25,18.29 15.42,18.33 15.60,18.33 15.60,18.33 15.60,18.33 15.60,18.33 16.20,18.33 16.69,17.84 16.69,17.24 16.69,17.16 16.68,17.08 16.66,17.00 16.66,17.00 16.08,13.62 16.08,13.62 16.08,13.62 18.58,11.18 18.58,11.18 18.88,10.89 18.98,10.46 18.86,10.07 18.73,9.67 18.39,9.38 17.98,9.32 Z M 12.00,0.00 C 5.38,0.00 0.00,5.38 0.00,12.00 0.00,18.62 5.38,24.00 12.00,24.00 18.62,24.00 24.00,18.62 24.00,12.00 24.00,5.38 18.62,0.00 12.00,0.00 Z M 12.00,21.82 C 6.59,21.82 2.18,17.41 2.18,12.00 2.18,6.59 6.59,2.18 12.00,2.18 17.41,2.18 21.82,6.59 21.82,12.00 21.82,17.41 17.41,21.82 12.00,21.82 Z M 218.00,32.00" /></svg> Rating</h6>
									<span className="text-secondary">{user.rating || ""}</span>
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
                    </div>
                  </div>
                </div>
              </div>
						</div>
					</div>
				</div>
			</div>
		{/* </div>
	</div> */}
  </Container>
    );
  }

export default Profile;