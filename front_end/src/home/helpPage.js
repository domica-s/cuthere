// The program for the frontend of forget password page
// PROGRAMMER: Pierson
// The program is called when the user clicks on a page that is not in our routes
// Revised on 5/5/2022

import React from "react";
import { Container } from "react-bootstrap";

function Help() {
                                /*
        This is a functional component to render the content when the page is not there in the route
    */
    return(
        <Container>
            <h2>Sorry!</h2>
            <p>Page under development, cannot help you right now!</p>
        </Container>
    );
}

export {Help}