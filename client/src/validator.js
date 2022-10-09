
export const validateField = (value, params, errorMessages) => {
    for (const key in params){
        var validator = validators[key];
        if (!validator(value, params[key])) return errorMessages[key];
    }
    return "";
}

export const validateInput = (input, params, errorMessages)=> {
    var errors = {};
    for (const key in params){
        errors[key] = validateField (input[key], params[key], errorMessages[key]);
    }
    return errors;
};

var validators = {
    required: (value, params) => {
        return (value !== "");
    },

    between: (value, params) => {
        var { max, min } = params;
        return (value >= min && value <= max);
    },

    length: (value, params) => {
        var {max, min} = params;
        return (value.length >= min && value.length <= max);
    },

    validCharacters: (value, params) => {
        var regex = new RegExp(/^[a-z]+$/);
        return regex.test(value);
    },

    validUrl: (value, params) => {       
        var regexUrl = new RegExp(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/);
        var regexImageExtension = /\.(jpeg|jpg|gif|png)$/;
        return regexUrl.test(value) && regexImageExtension.test(value);
    }

}