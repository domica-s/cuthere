import React, { useState, useEffect } from "react";
import Input from "./Input";
import axios from "axios";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import authService from "../services/auth.service";
import Container, { FloatingLabel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './editProfileStyles.css'


const INITIAL_STATE = {
  username: "",
  name: "",
  email: "",
  mobileNumber: 0,
  about: "",
  interests: "",
};
export default function ProfileState() {
  const [user, setUser] = useState(INITIAL_STATE);
  const [userRequest, setUserRequest] = useState({
    successful: false,
    message: "",
});

  useEffect(() => {
    (async () => {
      try {
        // const user = await axios.get(
        //   "https://jsonplaceholder.typicode.com/users/1"
        // );
        const user = authService.getCurrentUser();

        setUser({
          username: user.user.username,
          email: user.user.email,
          mobileNumber: user.user.mobileNumber,
          about: user.user.about,
          interests: user.user.interests,
          
        })
        // console.log(user);
        // setUser(user.data);
        
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleInput = (e) => {
    // console.log(e.target.name, " : ", e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = authService.getCurrentUser();
    authService.updateProfile(currentUser, user.mobileNumber, user.interests, user.about) 
    .then(response => {
      setUserRequest({ successful: true, message: response.data.message });
    },
    error => {
      setUserRequest({ successful: false, message: error.response.data.message });
    }) 
  };
  const { successful, message } = userRequest;

  return (
    <div className="ProfileState">
      <div className="formbg-outer">
          <div className="formbg paddin-in">
            <div className="formbg-inner padding-horizontal--20"></div>  
      <h1>Edit Profile</h1>
      
      <Form onSubmit={handleSubmit}>
        <div className="field padding-bottom--24">
          <label htmlFor="username">Username:</label> <br />
          <Input
            name="username"
            type="text"
            value={user.username || ""}
            placeholder={"Your names"}
            handleInput={handleInput}
          />
        </div>
        <div className="field padding-bottom--24">
          <label htmlFor="email">Email:</label><br />
          <Input
            name="email"
            type="email"
            value={user.email || ""}
            placeholder={"Your email"}
            handleInput={handleInput}
          />
        </div>
        <div className="field padding-bottom--24">
        <label htmlFor="mobileNumber">Mobile Number:</label><br />
        <Input
          name="mobileNumber"
          type="number"
          value={user.mobileNumber || ""}
          placeholder={"Your mobile number"}
          handleInput={handleInput}
        />
        </div>
        <div className="field padding-bottom--24">
        <label htmlFor="interests">Interests:</label><br />
        <Input
          name="interests"
          type="textarea"
          value={user.interests || ""}
          placeholder={"Your interests"}
          handleInput={handleInput}
        />
        </div>
        <div className="field padding-bottom--24">
        <label htmlFor="about">About:</label><br />
        <Input
          name="about"
          type="text"
          value={user.about || ""}
          placeholder={"write something about you"}
          handleInput={handleInput}
        />
        </div>
        {message && (
          <div className="form-group">
            <div
            className={successful? "alert alert-success": "alert alert-danger"}
            role="alert">
            {message}
            </div>
          </div>
        )}
        <Button type="submit" value="Update">Update</Button>
      </Form>
    </div>
    </div>
    </div>
    
  );
}


