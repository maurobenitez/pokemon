
const required = (value, params) => {
    return (value !== "");
};

const between = (value, params) => {
    var { max, min } = params;
    return (value >= min && value <= max);
};

const length = (value, params) => {
    var { max, min } = params;
    return (value.length >= min && value.length <= max); 
};

const validCharacters = (value, params) => {
    var regex = new RegExp(/^[a-z]+$/);
    return regex.test(value);
};

const validUrl = (value, params) => {       
    var regexUrl = new RegExp(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/);
    var regexImageExtension = /\.(jpeg|jpg|gif|png)$/;
    return regexUrl.test(value) && regexImageExtension.test(value);
};

var validators = {
    required,
    between,
    length,
    validCharacters,
    validUrl
};
/* validateField valida un campo. Si es válido retorna un string vacío. Si no retorna un mensaje de error. Tiene tres parámetros, el primero el valor a validar, el segundo un objeto con los parámetros de validación, y el tercero un objeto que define todos los mensajes de error que podrían existir para cada posible error.
Ejemplo:
value: pikachu
params: { required: true, validCharacters: true, length: { min: 3, max: 12 } }
errorMessages: { required: "El nombre es requerido", validCharacters: "El nombre contiene caracteres inválidos", length: "El nombre debe tener entre 3 y 12 caracteres" }
*/
export const validateField = (value, params, errorMessages) => {
    for (const key in params){
        var validatorFunction = validators[key];
        if (validatorFunction === undefined) {
            console.log(`El validador ${key} no existe.`)
        }else if (!validatorFunction(value, params[key])) return errorMessages[key];
    }
    return "";
}

export const validateInput = (input, params, errorMessages)=> {
    var errors = {};
    var isValid = true;
    for (const key in params){
        var error = validateField (input[key], params[key], errorMessages[key]);
        errors[key] = error;
        if (error) isValid = false;
    }
    return [isValid, errors];
};

