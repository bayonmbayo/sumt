

export function authHeaderWithJSON() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.jwt) {
        return { Authorization: `Bearer ${user.jwt}`, 'Content-Type': 'application/json' };
    } else {
        return { 'Content-Type': 'application/json' };
    }
}

export function authHeaderWithoutContentType() {
    // return authorization header with jwt token
    let user = JSON.parse(sessionStorage.getItem('user'));

    if (user && user.jwt) {
        return { Authorization: `Bearer ${user.jwt}` };
    } else {
        return {};
    }
}