import React from "react";
import { Image } from 'react-bootstrap';
import Demo from './userProfile.png';

function UserIcon() {
    return (
        <Image src={Demo} alt='' roundedCircle style={{ width: '25px' }}/>
    )
}


export {UserIcon}