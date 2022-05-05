// The program to handle the email confirmation of the user
// PROGRAMMER: Domica Santoso
// The program is called when the user clicks on the verification link
// Revised on 5/5/2022
import React, { useEffect, useState } from "react";
import { baseBackURL } from "../params/params";
import { useParams } from "react-router-dom";

function ConfirmEmail() {

    const [userRequest, setUserRequest] = useState({
        successful: false,
        message: "",
    });


    const { sid, token } = useParams();

    useEffect(() => {
        let FULL_URL = baseBackURL +  "/api/auth/confirmation/" + sid + "/" + token;
        fetch(FULL_URL)
        .then(response => {
            response.json().then(data => {
                if(response.status === 200) {
                    setUserRequest({ successful: true, message: data.message });
                }
                else {
                    setUserRequest({ successful: false, message: data.message });
                }
            })
        })
    }, []);

    const { successful, message } = userRequest;

    return (
        <>
        {message && (
            <div className="form-group">
                <div
                className={
                    successful? "alert alert-success": "alert alert-danger"
                }
                role="alert"
                >
                {message}
                </div>
            </div>
        )}
        </>
    );

}

export {ConfirmEmail}