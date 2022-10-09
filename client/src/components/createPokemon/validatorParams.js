
export const validatorParams = {
    name: {
        required: true,
        validCharacters: true,
        length: {
            min: 3,
            max: 12
        }
    },
    image: {
        required: true,
        validUrl: true
    },
    hp: {
        required: true,
        between: {
            min: 0,
            max: 100
        }
    },
    attack: {
        required: true,
        between: {
            min: 0,
            max: 100
        }
    },
    defense: {
        required: true,
        between: {
            min: 0,
            max: 100
        }
    },
    speed: {
        required: true,
        between: {
            min: 0,
            max: 100
        }
    },
    height: {
        required: true,
        between: {
            min: 0,
            max: 100
        }
    },
    weight: {
        required: true,
        between: {
            min: 0,
            max: 100
        }
    },
};

export const errorMessages = {
    name: {
        required: "El nombre es requerido",
        validCharacters: "El nombre contiene caracteres inválidos",
        length: "El nombre debe tener entre 3 y 12 caracteres"
    },
    image: {
        required: "La imagen es requerida",
        validUrl: "La url proporcionada no es válida"
    },
    hp: {
        required: "La vida es requerida",
        between: "La vida debe ser un valor entre 0 y 100"
    },
    attack: {
        required: "El ataque es requerido",
        between: "la vida debe ser un valor entre 0 y 100"
    },
    defense: {
        required: "La defensa es requerida",
        between: "La defensa debe ser un valor entre 0 y 100"
    },
    speed: {
        required: "La velocidad es requerida",
        between: "La velocidad debe ser un valor entre 0 y 100"
    },
    height: {
        required: "La altura es requerida",
        between: "La altura debe ser un valor entre 0 y 100"
    },
    weight: {
        required: "El peso es requerido",
        between: "El peso debe ser un valor entre 0 y 100"
    },
}