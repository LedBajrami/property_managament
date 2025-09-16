export default function authHeader() {
    const obj = localStorage.getItem("token");
    if (obj) {
        return 'Bearer ' + obj
    }else{
        return null
    }
}
