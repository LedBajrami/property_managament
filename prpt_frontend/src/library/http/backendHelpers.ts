import {get, post} from "./apiHelpers";
import * as url from './urlHelpers';

// Login Method
interface LoginData {
    email: string;
    password: string;
}

const loginRequest = (data: LoginData) => post(url.LOGIN, data);
const getUserState = () => get(url.USER_STATE);
// const getUserProfile = () => get(url.PROFILE)
// const editUserProfile = (data) => put(url.PROFILE, data)
// const changePassword = (data) => put(url.PASSWORD_UPDATE, data)
// const getMenuRequest = () => get(url.MENU)
//
// const confirmEmail = (id, data) => get(url.CONFIRM_EMAIL + '/' + id, { params: data })
// const resetPassword = (mainUrl, data) => post(mainUrl, data)
//
//
// // Users Method
// const getUsers = (filters) => get(url.GET_USERS, filters);
// const getUser = (user_id) => get(url.GET_USERS + '/' + user_id);
// const createUser = (user) => post(url.GET_USERS, user);
// const editUser = (user, user_id) => put(url.GET_USERS + '/' + user_id, user);
// const deleteUsers = (user_id) => del(url.GET_USERS + '/' + user_id);
// const changeUserPassword = (user_id) => post(url.GET_USERS + '/' + user_id + '/change-password');
//
//
// //Roles
// const getRoles = (filters) => get(url.GET_ROLES, filters);
// const getRole = (role_id) => get(url.GET_ROLES + '/' + role_id);
// const createRole = (role) => post(url.GET_ROLES, role);
// const editRole = (role, role_id) => put(url.GET_ROLES + '/' + role_id, role);
// const deleteRole = (role_id) => del(url.GET_ROLES + '/' + role_id);
//
// //Main Permissions
// const getMainPermissions = (filters) => get(url.GET_MAIN_PERMISSIONS, filters);

const registerCompany = (data: any) => post(`/register-company`, data);




export {
    loginRequest,
    getUserState,
    // getUserProfile,
    // editUserProfile,
    // changePassword,
    // getMenuRequest,
    // confirmEmail,
    // resetPassword,
    //
    // //Users
    // getUsers,
    // getUser,
    // createUser,
    // editUser,
    // deleteUsers,
    // changeUserPassword,
    //
    //
    // //Roles
    // getRoles,
    // getRole,
    // createRole,
    // editRole,
    // deleteRole,
    //
    // //Main Permissions
    // getMainPermissions,

    registerCompany,
}
