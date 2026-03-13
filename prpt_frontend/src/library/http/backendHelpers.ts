import {del, get, post, put} from "./apiHelpers";
import * as url from './urlHelpers';
import {LoginData, ResetPasswordParams} from "@/types/auth.ts";
import {CreateUserParams, UpdateUserParams} from "@/types/user.ts";
import {CreateCompany} from "@/types/company.ts";
import {CreatePropertyParams, UpdatePropertyParams} from "@/types/property.ts";
import {CreateUnitParams, UpdateUnitParams} from "@/types/unit.ts";
import {CreateLeaseParams, RenewLeaseParams, UpdateLeaseParams} from "@/types/lease.ts";



// @ts-ignore
const loginRequest = (data: LoginData) => post(url.LOGIN, data, { skipSuccessNotification: true });
const resendSetPasswordLink = (id: string | undefined) => post(`${url.RESEND_SET_PASSWORD_LINK}/${id}`, {});
const forgotPasswordEmail = (data: { email: string }) => post(url.FORGOT_PASSWORD_EMAIL, data);
const getUserState = () => get(url.USER_STATE).then((res: any) => res.data.user);
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

// Properties
const getProperties = () => get(url.PROPERTY);

const getProperty = (propertyId?: number) => get(`${url.PROPERTY}/${propertyId}`);

const createProperty = (data: CreatePropertyParams) => post(url.PROPERTY, data);

const editProperty = (data: UpdatePropertyParams) => {
    const { property_id, ...updateData } = data;
    return put(`${url.PROPERTY}/${property_id}`, updateData);
};

const deleteProperty = (propertyId: number) => del(`${url.PROPERTY}/${propertyId}`);


// Units
const getUnits = (propertyId?: number) => get(`${url.UNIT}?property_id=${propertyId}`);

const getUnit = (unitId?: number) => get(`${url.UNIT}/${unitId}`);

const createUnit = (data: CreateUnitParams) => post(url.UNIT, data);

const editUnit = (data: UpdateUnitParams) => {
    const { unit_id, ...updateData } = data;
    return put(`${url.UNIT}/${unit_id}`, updateData);
};

const deleteUnit = (unitId: number) => del(`${url.UNIT}/${unitId}`);

// Leases
const getLeases = (unitId?: number) => get(`${url.LEASE}?unit_id=${unitId}`);

const getLease = (leaseId?: number) => get(`${url.LEASE}/${leaseId}`);

const createLease = (data: CreateLeaseParams) => post(url.LEASE, data);

const editLease = (data: UpdateLeaseParams) => {
    const { lease_id, ...updateData } = data;
    return put(`${url.LEASE}/${lease_id}`, updateData);
};

const deleteLease = (unitId: number) => del(`${url.LEASE}/${unitId}`);

const terminateLease = (leaseId?: number) => get(`${url.LEASE}/terminate-lease/${leaseId}`);

const renewLease = (data: RenewLeaseParams) => {
    const { lease_id, ...renewLeaseData } = data;
    return post(`${url.LEASE}/renew-lease/${lease_id}`, renewLeaseData);
};

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
    resendSetPasswordLink,
    forgotPasswordEmail,
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

    getProperties,
    getProperty,
    createProperty,
    editProperty,
    deleteProperty,

    getUnits,
    getUnit,
    createUnit,
    editUnit,
    deleteUnit,

    getLeases,
    getLease,
    createLease,
    editLease,
    deleteLease,
    terminateLease,
    renewLease
}
