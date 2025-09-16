import { message } from 'antd';

export const validateFromServer = errors => {
    const fieldsError = [];
    for (let key in errors.data) {
        fieldsError.push({
            name: key,
            errors: errors.data[key],
        })
    }
    return fieldsError;
}

export const isValidationError = errors => {
    return (errors.hasOwnProperty('data') && Object.keys(errors.data).length > 0);
}


export const successToast = success => {
    message.success(success);
}

export const errorToast = error => {
    message.error(error);
}

export const checkProductAvailability = (current_product) => {
    let message = '';
    if (current_product.is_editable === 0) {
        message = current_product.current_editor_name
            ? `This product is currently being edited by ${current_product.current_editor_name}`
            : `You need to start editing this product to continue`;
    } else if (current_product.is_editable === 1 && current_product.is_editing_active === 0) {
        message = `This product is currently being edited by ${current_product.current_editor_name}`;
    }
    if (message) {
        errorToast(message);
        return true
    }
    return false
}
