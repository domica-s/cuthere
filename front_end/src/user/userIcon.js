// The program is the front-end code for the rendering of user Icon
// PROGRAMMER: Pierson Tarrantino Limas
// The program is called whem the user opens up a profile
// Revised on 5/5/2022

import React from "react";
import { Image } from 'react-bootstrap';
import Demo from './userProfile.png';

function UserIcon() {
                            /*
        This is a functional component related to the rendering of the user Icon
        This code is rendered upon opening the profile
    */
    return (
        <Image src={Demo} alt='' roundedCircle style={{ width: '25px' }}/>
    )
}


export {UserIcon}