

export function clearToken() {
    localStorage.removeItem('token');
}

export function getToken() {
    try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return { token, user };
    } catch (err) {
        clearToken();
        return new Map();
    }
}
