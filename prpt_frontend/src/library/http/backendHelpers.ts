import {del, get, post, postUpload, put, putFormData} from "./apiHelpers";
import * as url from './urlHelpers';
import {AuthResponse, LoginData, RegisterApplicantData, ResetPasswordParams} from "@/types/auth.ts";
import {CreateUserParams, UpdateUserParams} from "@/types/user.ts";
import {CreateCompany} from "@/types/company.ts";
import {CreatePropertyParams, UpdatePropertyParams} from "@/types/property.ts";
import {CreateUnitParams, UpdateUnitParams} from "@/types/unit.ts";
import {CreateLeaseParams, RenewLeaseParams, UpdateLeaseParams} from "@/types/lease.ts";
import {PaymentScheduleFilters, RecordPaymentParams} from "@/types/payment.ts";
import {downloadFile} from "./apiHelpers";
import {RecordDepositPaidParams, RecordDepositReturnParams} from "@/types/deposit.ts";
import {PropertyFilters, SubmitApplicationParams} from "@/types/publicProperty.ts";
import {ApplicationFilters, ApproveApplicationParams, RejectApplicationParams} from "@/types/application.ts";

const loginRequest = (data: LoginData) =>
    post(url.LOGIN, data, { skipSuccessNotification: true } as unknown as Parameters<typeof post>[2]);
const resendSetPasswordLink = (id: string | undefined) => post(`${url.RESEND_SET_PASSWORD_LINK}/${id}`, {});
const forgotPasswordEmail = (data: { email: string }) => post(url.FORGOT_PASSWORD_EMAIL, data);
const getUserState = () => get<{ data: { user: AuthResponse } }>(url.USER_STATE).then((res) => res.data.user);

const registerApplicant = (data: RegisterApplicantData) => post('/register-applicant', data);

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

const appendValue = (formData: FormData, key: string, value: unknown) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
        formData.append(key, value, value.name);
    } else if (Array.isArray(value)) {
        value.forEach((item) => appendValue(formData, `${key}[]`, item));
    } else {
        formData.append(key, String(value));
    }
};

const toFormData = (data: Record<string, unknown>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => appendValue(formData, key, value));
    return formData;
};

const toPutFormData = (data: Record<string, unknown>) => {
    const formData = toFormData(data);
    formData.append("_method", "PUT");
    return formData;
};

const createProperty = (data: CreatePropertyParams) =>
    postUpload(url.PROPERTY, toFormData(data as unknown as Record<string, unknown>));

const editProperty = (data: UpdatePropertyParams) => {
    const { property_id, ...updateData } = data;
    return updateData.thumbnail
        ? putFormData(`${url.PROPERTY}/${property_id}`, updateData as unknown as Record<string, unknown>)
        : put(`${url.PROPERTY}/${property_id}`, updateData);
};

const deleteProperty = (propertyId: number) => del(`${url.PROPERTY}/${propertyId}`);


// Units
const getUnits = (propertyId?: number) => get(`${url.UNIT}?property_id=${propertyId}`);

const getUnit = (unitId?: number) => get(`${url.UNIT}/${unitId}`);

const createUnit = (data: CreateUnitParams) =>
    postUpload(url.UNIT, toFormData(data as unknown as Record<string, unknown>));

const editUnit = (data: UpdateUnitParams) => {
    const { unit_id, ...updateData } = data;
    return updateData.thumbnail || updateData.gallery_photos?.length
        ? postUpload(`${url.UNIT}/${unit_id}`, toPutFormData(updateData as unknown as Record<string, unknown>))
        : put(`${url.UNIT}/${unit_id}`, updateData);
};

const deleteUnit = (unitId: number) => del(`${url.UNIT}/${unitId}`);

// Leases
const getLeases = (filters?: { unit_id?: number; property_id?: number; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.unit_id)     params.append('unit_id', String(filters.unit_id));
    if (filters?.property_id) params.append('property_id', String(filters.property_id));
    if (filters?.status)      params.append('status', filters.status);
    if (filters?.search)      params.append('search', filters.search);
    const qs = params.toString();
    return get(`${url.LEASE}${qs ? `?${qs}` : ''}`);
};
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

// Deposits

const getDepositSummary = (leaseId: number) =>
    get(`${url.LEASE}/${leaseId}/deposit`);

const recordDepositPaid = (leaseId: number, data: RecordDepositPaidParams) =>
    post(`${url.LEASE}/${leaseId}/deposit/record-paid`, data);

const recordDepositReturn = (leaseId: number, data: RecordDepositReturnParams) =>
    post(`${url.LEASE}/${leaseId}/deposit/record-return`, data);

// Payments
const buildPaymentScheduleQuery = (filters?: PaymentScheduleFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.unit_id) params.append('unit_id', String(filters.unit_id));
    if (filters?.lease_id) params.append('lease_id', String(filters.lease_id));
    const query = params.toString();
    return query ? `?${query}` : '';
};

const getPaymentSchedules = (filters?: PaymentScheduleFilters) =>
    get(`${url.PAYMENT_SCHEDULE}${buildPaymentScheduleQuery(filters)}`);

const getMyPaymentSchedules = (filters?: PaymentScheduleFilters) =>
    get(`${url.PAYMENT_SCHEDULE}/mine${buildPaymentScheduleQuery(filters)}`);

const recordPayment = (scheduleId: number, data: RecordPaymentParams) =>
    post(`${url.PAYMENT_SCHEDULE}/${scheduleId}/record-payment`, data);

const downloadReceipt = (documentId: number, filename: string) =>
    downloadFile(`${url.DOCUMENT}/${documentId}/download`, {}, filename);

const downloadDocument = (documentId: number, filename: string) =>
    downloadFile(`${url.DOCUMENT}/${documentId}/download`, {}, filename);

const getDocuments = () => get(url.DOCUMENTS);

const getDashboardOverview = () => get(url.DASHBOARD_OVERVIEW);

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


// ─── Public Properties ────────────────────────────────────────────────────

const buildPublicPropertyQuery = (filters?: PropertyFilters): string => {
    const params = new URLSearchParams();
    if (filters?.location)      params.append('location', filters.location);
    if (filters?.property_type) params.append('property_type', filters.property_type);
    if (filters?.min_rent)      params.append('min_rent', String(filters.min_rent));
    if (filters?.max_rent)      params.append('max_rent', String(filters.max_rent));
    if (filters?.bedrooms)      params.append('bedrooms', String(filters.bedrooms));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export const getPublicProperties = (filters?: PropertyFilters) =>
    get(`${url.PUBLIC_PROPERTIES}${buildPublicPropertyQuery(filters)}`);

export const getPublicProperty = (id: number) =>
    get(`${url.PUBLIC_PROPERTIES}/${id}`);

export const getPublicPropertyUnit = (propertyId: number, unitId: number) =>
    get(`${url.PUBLIC_PROPERTIES}/${propertyId}/units/${unitId}`);

// ─── Applications
export const submitApplication = (data: SubmitApplicationParams) =>
    post(url.PUBLIC_APPLICATIONS, data);

export const getMyApplications = () =>
    get(`${url.PUBLIC_APPLICATIONS}/mine`);

// ─── Internal Application Review
const buildApplicationQuery = (filters?: ApplicationFilters) => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    const query = params.toString();
    return query ? `?${query}` : "";
};

const getApplications = (filters?: ApplicationFilters) =>
    get(`${url.APPLICATIONS}${buildApplicationQuery(filters)}`);

const getApplication = (applicationId: number) =>
    get(`${url.APPLICATIONS}/${applicationId}`);

const approveApplication = (applicationId: number, data: ApproveApplicationParams) =>
    post(`${url.APPLICATIONS}/${applicationId}/approve`, data);

const rejectApplication = (applicationId: number, data: RejectApplicationParams) =>
    post(`${url.APPLICATIONS}/${applicationId}/reject`, data);


export {
    loginRequest,
    registerApplicant,
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
    renewLease,

    getDepositSummary,
    recordDepositPaid,
    recordDepositReturn,

    getPaymentSchedules,
    getMyPaymentSchedules,
    recordPayment,
    downloadReceipt,
    downloadDocument,
    getDocuments,
    getDashboardOverview,

    getApplications,
    getApplication,
    approveApplication,
    rejectApplication,
}
