// The program is for the header authorization services
// PROGRAMMER: Domica 
// Revised on 5/5/2022

export default function authHeader() {
                                              /*
        This is a functional component handling the authorization services related to the access token sent in the header
    */
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        // for Node.js Express back-end
        return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
}