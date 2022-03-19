import React from "react";

class Login extends React.Component {
    render() {
        return(
            <div className="container">
                <form action="../../login" method="POST">
                    <input type="number" className="form-control" name="sid" id="floatingInput" placeholder="SID"/>
                    <label className ="form-label" htmlFor="floatingInput">SID</label>
                    
                    <input type="password" className="form-control" name="password" id="floatingPassword" placeholder="Password"/>
                    <label className ="form-label" htmlFor="floatingPassword">Password</label>
                    
                    <input type="submit" className="btn btn-outline-warning navbar-btn" value="Sign In" />
                </form>
            </div>
        )
    }
}

export {Login}