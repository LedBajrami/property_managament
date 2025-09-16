export const convertCamelToNormal = (camelText) => {
    const normalText = camelText.replace(/([A-Z])/g, ' $1').toLowerCase();
    return normalText.charAt(0).toUpperCase() + normalText.slice(1);
}

export const convertJSONToFormData = (jsonObject) => {
    const formData = new FormData();

    const flattenObject = (data, prefix = '') => {
        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                if (typeof item === 'object' && !Array.isArray(item)) {
                    flattenObject(item, `${prefix}[${index}]`);
                } else {
                    if (item instanceof File) {
                        formData.append(`${prefix}[${index}]`, item, item.name);
                    } else if (item !== undefined) {
                        formData.append(`${prefix}[${index}]`, item);
                    } else {
                        formData.append(`${prefix}[${index}]`, '');
                    }
                }
            });
        } else if (typeof data === 'object') {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const value = data[key];
                    const newKey = prefix ? `${prefix}.${key}` : key;

                    if (Array.isArray(value) || typeof value === 'object') {
                        if (value instanceof File) {
                            formData.append(newKey, value, value.name);
                        }else {
                            flattenObject(value, newKey);
                        }
                    } else {
                        if (value instanceof File) {
                            formData.append(newKey, value, value.name);
                        } else if (value !== undefined) {
                            formData.append(newKey, value);
                        } else {
                            formData.append(newKey, '');
                        }
                    }
                }
            }
        } else {
            if (data !== undefined) {
                formData.append(prefix, data);
            } else {
                formData.append(prefix, '');
            }
        }
    };

    flattenObject(jsonObject);

    return formData;
}


export const formatJSON = (json) => {
    const formattedJson = {};

    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const value = json[key];
            if (value === null || value === undefined) {
                formattedJson[key] = "";
            } else if (typeof value === "boolean") {
                formattedJson[key] = value ? 1 : 0;
            } else {
                formattedJson[key] = value;
            }
        }
    }
    return formattedJson;
}


export const buildFilterQueryParams = (filters) => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value !== '' && value !== null && typeof value !== 'undefined') {
            queryParams.append(`filter[${key}][value]`, value);
            queryParams.append(`filter[${key}][operator]`, 'like');  // assuming you want 'like' searches for all
        }
    }
    return queryParams
};

export const buildFilterObjectParams = (filters, additionalParams) => {
    const filterParams = {};
    if (filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (value !== '' && value !== null && typeof value !== 'undefined') {
                filterParams[key] = {
                    operator: 'like',
                    value: value
                };
            }
        }
    }
    return {filter: filterParams, ...additionalParams};
};

