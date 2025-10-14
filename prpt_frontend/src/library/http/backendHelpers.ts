import {del, get, post, put} from "./apiHelpers";
import * as url from './urlHelpers';
import {LoginData, ResetPasswordParams} from "@/types/auth.ts";
import {CreateUserParams, UpdateUserParams} from "@/types/user.ts";
import {CreateCompany} from "@/types/company.ts";



// @ts-ignore
const loginRequest = (data: LoginData) => post(url.LOGIN, data, { skipSuccessNotification: true });
const getUserState = () => get(url.USER_STATE);
// const getUserProfile = () => get(url.PROFILE)
// const editUserProfile = (data) => put(url.PROFILE, data)
// const changePassword = (data) => put(url.PASSWORD_UPDATE, data)
// const getMenuRequest = () => get(url.MENU)
//
// const confirmEmail = (id, data) => get(url.CONFIRM_EMAIL + '/' + id, { params: data })
const resetPassword = ({ url, data }: ResetPasswordParams) => post(url, data);
//
//
// // Users Method
const getUsers = () => get(url.GET_USERS);
const getTeamMembers = () => get(url.GET_TEAM_MEMBERS);
const getResidents = () => get(url.GET_RESIDENTS);
// const getUsers = (filters) => get(url.GET_USERS, filters); // use when implementing pagination
const getUser = (userId: number) => get(url.GET_USERS + '/' + userId);
const createUser = (user: CreateUserParams) => post(url.GET_USERS, user);
const editUser = (user: UpdateUserParams) => put(url.GET_USERS + '/' + user.id, user);
const deleteUser = (userId: number) => del(url.GET_USERS + '/' + userId);
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

const registerCompany = (data: CreateCompany) => post(`/register-company`, data);




export {
    loginRequest,
    getUserState,
    // getUserProfile,
    // editUserProfile,
    // changePassword,
    // getMenuRequest,
    // confirmEmail,
    resetPassword,
    //
    // //Users
    getUsers,
    getTeamMembers,
    getResidents,
    getUser,
    createUser,
    editUser,
    deleteUser,
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
