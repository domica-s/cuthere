import React from "react";
import {Container, Tabs, Tab, Form, Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './accountSettingStyles.css'
import {useState, useEffect} from 'react';
import authService from "../services/auth.service";
import userService from "../services/user.service";
import axios from "axios";
var params = require("../params/params");

const currentUser = authService.getCurrentUser();
const API = params.baseBackURL + "/file/upload";
const API_DELETE = params.baseBackURL + "/file/delete/";
const API_Query = params.baseBackURL + "/file/";


const INITIAL_STATE = {
    username: "",
    name: "",
    email: "",
    mobileNumber: 0,
    successful: false,
    message: "",
    about: "",
    country: "",
    interests: "",
    uploadImg: "",
  };

//handle change profile pic
function GeneralInformation() {
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
              });
            })
            // setUser(user.data);
            
        } catch (error) {
            console.log(error);
        }
        })();
    }, []);

    const handleInput = (e) => {
        console.log(e.target.name, " : ", e.target.value);
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleGeneral = async (e) => {
        e.preventDefault();
        let currentUser = authService.getCurrentUser();
        authService.updateProfile(currentUser, user.mobileNumber, user.interests, user.about, user.name, user.country)
        .then(response => {
          currentUser = authService.getCurrentUser();
          let updatedUser;
          userService.getProfile(currentUser, currentUser.sid)
          .then(successResponse => {
            
            updatedUser = successResponse.data;
            // console.log(updatedUser.username);
            setUser({
              username: updatedUser.username,
              email: updatedUser.email,
              mobileNumber: updatedUser.mobileNumber,
              name: updatedUser.name,
              about: updatedUser.about,
              country: updatedUser.country,
              interests: updatedUser.interests,
              successful: true, 
              message: response.data.message
            });
  
          },
          error => {
            updatedUser = currentUser;
            setUser({
              username: updatedUser.username,
              email: updatedUser.email,
              mobileNumber: updatedUser.mobileNumber,
              name: updatedUser.name,
              about: updatedUser.about,
              country: updatedUser.country,
              interests: updatedUser.interests,
              successful: false, 
              message: response.data.message
            });
          })
        },
        error => {
          setUser({successful: false, message: error.response.data.message});
          console.log("fail");
        }
      );
    };

    const onChangeFile = async(e) => {
      try {
        setUser({
          uploadImg: e.target.files[0]
        });        
      } catch (error) {
        console.log(error);
      }
    }

    const onUploadFile = async(e) => {
      e.preventDefault();
      let api_delete = API_DELETE + "user-" + currentUser.sid;
      const deletePrevious = await fetch(api_delete, {
        method: "GET",
        headers: new Headers({
            "x-access-token": currentUser.accessToken,
          }),          
      })
      const ResponseJson = await deletePrevious.json();
      
      if (ResponseJson.message) {
        let data = new FormData();
        data.append("file", user.uploadImg, "user-" + currentUser.sid);
        const uploadResult = await fetch(API, {
          method: "POST",
          headers: new Headers({
            "x-access-token": currentUser.accessToken,
            }),
          body: data          
        });
  
        const resultJson = await uploadResult.json();
        await window.alert(resultJson.message);
      }
    }

    const onLoadPic = async(e) => {
      const img = document.querySelector("#profile-pic");

      let api = API_Query + "user-" + currentUser.sid;
      const loadResult = await fetch(api, {
          method: "GET",
          headers: new Headers({
            "x-access-token": currentUser.accessToken,
          }),
      })
      const resultStatus = await loadResult.clone().status
      const resultBlob = await loadResult.blob();
      if (resultStatus === 200){
        img.crossOrigin = 'anonymous';
        img.src = await URL.createObjectURL(resultBlob);
      }
    }

    return(
        <Form onSubmit={handleGeneral}>
        <div className="tab-content">
            <div className="tab-pane fade active show" id="account-general">

              <div className="card-body media align-items-center">
                <img id="profile-pic" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" className="d-block ui-w-80" onLoad={onLoadPic}/>
                <div className="media-body ml-4">
                  <label className="btn btn-outline-primary">
                    Select new photo
                    <input type="file" className="account-settings-fileinput" onChange={onChangeFile}/>
                  </label> &nbsp;
                  {user.uploadImg && <button type="button" className="btn btn-default md-btn-flat" onClick={onUploadFile}>Upload</button>}
                  {user.uploadImg && <p>{user.uploadImg.name}</p>}
                  <div className="text-light small mt-1">Allowed JPG or PNG.</div>
                  <div className="text-light small mt-1">Click on 'Select New Photo' then 'Upload' to save picture changes.</div>
                </div>
              </div>
              <hr className="border-light m-0" />
            
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <Form.Control 
                  name="username"
                  type="text" 
                  value={user.username || ""}
                  placeholder={"Type in a new username.."}
                  onChange={handleInput} 
                  disabled
                  readOnly    
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <Form.Control 
                  name="email"
                  type="email" 
                  value={user.email || ""}
                  placeholder={"Your e-mail address"}
                  onChange={handleInput} 
                  disabled
                  readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <Form.Control 
                  name="name"
                  type="text" 
                  value={user.name || ""}
                  placeholder={"Your name here.."}
                  onChange={handleInput} />
                </div> 
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <Form.Control 
                  name="mobileNumber"
                  type="number" 
                  value={user.mobileNumber || ""}
                  placeholder={"Add in your mobile number"}
                  onChange={handleInput} />
                </div>
                <div className="form-group">
                  <label className="form-label">About</label>
                  <textarea
                  rows="5"
                  name="about"
                  className="text-area-style"
                  value={user.about || ""}
                  placeholder={"Type in something about yourself.."}
                  onChange={handleInput} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <Form.Control 
                    className="select-style selectpicker countrypicker"
                    as="select"
                    name="country"
                    value={user.country || ""}
                    onChange={handleInput}>
                        <option value="Afganistan">Afghanistan</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="American Samoa">American Samoa</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Anguilla">Anguilla</option>
                        <option value="Antigua & Barbuda">Antigua & Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bonaire">Bonaire</option>
                        <option value="Bosnia & Herzegovina">Bosnia & Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Canary Islands">Canary Islands</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Central African Republic">Central African Republic</option>
                        <option value="Chad">Chad</option>
                        <option value="Channel Islands">Channel Islands</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Christmas Island">Christmas Island</option>
                        <option value="Cocos Island">Cocos Island</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo">Congo</option>
                        <option value="Cook Islands">Cook Islands</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Cote DIvoire">Cote DIvoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Curaco">Curacao</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                        <option value="East Timor">East Timor</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Falkland Islands">Falkland Islands</option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="French Guiana">French Guiana</option>
                        <option value="French Polynesia">French Polynesia</option>
                        <option value="French Southern Ter">French Southern Ter</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Great Britain">Great Britain</option>
                        <option value="Greece">Greece</option>
                        <option value="Greenland">Greenland</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guadeloupe">Guadeloupe</option>
                        <option value="Guam">Guam</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Hawaii">Hawaii</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="India">India</option>
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Isle of Man">Isle of Man</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Korea North">Korea North</option>
                        <option value="Korea Sout">Korea South</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macau">Macau</option>
                        <option value="Macedonia">Macedonia</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">Marshall Islands</option>
                        <option value="Martinique">Martinique</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mayotte">Mayotte</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Midway Islands">Midway Islands</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Nambia">Nambia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherland Antilles">Netherland Antilles</option>
                        <option value="Netherlands">Netherlands (Holland, Europe)</option>
                        <option value="Nevis">Nevis</option>
                        <option value="New Caledonia">New Caledonia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Niue">Niue</option>
                        <option value="Norfolk Island">Norfolk Island</option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau Island">Palau Island</option>
                        <option value="Palestine">Palestine</option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">Papua New Guinea</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Phillipines">Philippines</option>
                        <option value="Pitcairn Island">Pitcairn Island</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Republic of Montenegro">Republic of Montenegro</option>
                        <option value="Republic of Serbia">Republic of Serbia</option>
                        <option value="Reunion">Reunion</option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="St Barthelemy">St Barthelemy</option>
                        <option value="St Eustatius">St Eustatius</option>
                        <option value="St Helena">St Helena</option>
                        <option value="St Kitts-Nevis">St Kitts-Nevis</option>
                        <option value="St Lucia">St Lucia</option>
                        <option value="St Maarten">St Maarten</option>
                        <option value="St Pierre & Miquelon">St Pierre & Miquelon</option>
                        <option value="St Vincent & Grenadines">St Vincent & Grenadines</option>
                        <option value="Saipan">Saipan</option>
                        <option value="Samoa">Samoa</option>
                        <option value="Samoa American">Samoa American</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome & Principe">Sao Tome & Principe</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syria">Syria</option>
                        <option value="Tahiti">Tahiti</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Togo">Togo</option>
                        <option value="Tokelau">Tokelau</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad & Tobago">Trinidad & Tobago</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Turks & Caicos Is">Turks & Caicos Is</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Erimates">United Arab Emirates</option>
                        <option value="United States of America">United States of America</option>
                        <option value="Uraguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Vatican City State">Vatican City State</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
                        <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
                        <option value="Wake Island">Wake Island</option>
                        <option value="Wallis & Futana Is">Wallis & Futana Is</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zaire">Zaire</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                    </Form.Control>
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Interests</label>
                  <Form.Control
                  type="text"
                  name="interests"
                  value={user.interests || ""}
                  placeholder={"Write something regarding your interests.."}
                  onChange={handleInput} />
                </div>
                <Button type="submit" variant="outline-dark" value="Update" style={{marginBottom:"3%"}}>Update Profile</Button>
                <div style={{marginBottom:"5%"}}>
                  {user.message && (
                      <div className="form-group">
                          <div
                          className={
                              user.successful? "alert alert-success": "alert alert-danger"
                          }
                          role="alert"
                          >
                          {user.message}
                          </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
            </div>
            </Form>
            
    );
    
}

let tempUser = authService.getCurrentUser();

const CHANGEPW_STATE ={
    oldPassword: "",
    newPassword: "",
    reEnterPassword: "",
    successful: false,
    message: "",
}

function ChangePassword() {
    const [user, setUser] = useState(CHANGEPW_STATE);

    useEffect(() => {
        (async () => {
        try {
            // const user = await axios.get(
            //   "https://jsonplaceholder.typicode.com/users/1"
            // );
            const user = authService.getCurrentUser();

            setUser({
            oldPassword: "",
            newPassword: "",
            reEnterPassword: ""

            })
            console.log(user);
            // setUser(user.data);
            
        } catch (error) {
            console.log(error);
        }
        })();
    }, []);

    const handleInput = (e) => {
        console.log(e.target.name, " : ", e.target.value);
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        let currentUser = authService.getCurrentUser();
        authService.changePassword(currentUser, user.oldPassword, user.newPassword, user.reEnterPassword)
        .then(successResponse => {
          setUser({
            successful: true,
            message:successResponse.data.message,
          })
        },error =>{
          setUser({
            successful: false,
            message:error.response.data.message,
          })
        })
        }catch (error) {
        console.log(error);
        }
    };
    return(
        <Form onSubmit={handleSubmit}>
        <div className="tab-content">
            <div className="tab-pane fade active show" id="account-change-password">
        
            
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <Form.Control 
                  name="oldPassword"
                  type="password" 
                  value={user.oldPassword || ""}
                  placeholder={"Type in your current password"}
                  onChange={handleInput} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <Form.Control 
                  name="newPassword"
                  type="password" 
                  value={user.newPassword || ""}
                  placeholder={"Type in your new password"}
                  onChange={handleInput} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <Form.Control 
                  name="reEnterPassword"
                  type="password" 
                  value={user.reEnterPassword || ""}
                  placeholder={"Re-enter your new password"}
                  onChange={handleInput} />            
                </div>
              </div>
            </div>
            </div>
            <Button type="submit" variant="outline-dark" value="Update">Change Password</Button>
            <div style={{marginTop:"2%"}}>
                  {user.message && (
                      <div className="form-group">
                          <div
                          className={
                              user.successful? "alert alert-success": "alert alert-danger"
                          }
                          role="alert"
                          >
                          {user.message}
                          </div>
                      </div>
                  )}
                </div>
            </Form>
    );    

}

const BIO_STATE = {
    
  };

function DropdownMenu() {
    const [key, setKey] = useState('general');
  
    return (
        
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 mt-3"
      >
        
        <Tab eventKey="general" title="General Information">
        <GeneralInformation />
        </Tab>
        <Tab eventKey="change-password" title="Change Password">
        <ChangePassword />
        </Tab>
      </Tabs>
    );
  }


function AccountSetting() {
    return (
        <Container>
        <DropdownMenu />
        </Container>
    )
}

export {AccountSetting}