import React from "react";

class Login extends React.Component {
    render() {
        return(
            <div className="container">
                <form action="../../login" method="POST">
                    <input type="number" class="form-control" name="sid" id="floatingInput" placeholder="SID"/>
                    <label class ="form-label" for="floatingInput">SID</label>
                    
                    <input type="password" class="form-control" name="password" id="floatingPassword" placeholder="Password"/>
                    <label class ="form-label" for="floatingPassword">Password</label>
                    
                    <input type="submit" class="btn btn-outline-warning navbar-btn" value="Sign In" />
                </form>
            </div>
        )
    }
}

export {Login}