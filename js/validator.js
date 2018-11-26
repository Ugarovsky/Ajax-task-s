function validate(object, rules) {
    return Object.keys(rules)
        .every(key => typeof(object[key]) == 'object'
            ? validate(object[key], rules[key])
            : RegExp(rules[key].pattern).test(object[key])
        );
}

function validateOrder(order) {
    return validate(order, order);
}

function validateProduct(product) {
    return validate(product, productValidationRules);
}

const types = {
    number: {
        pattern: '^\\d+$'//'^[\\d]+$'
    },

    string: {
        pattern: '^.+$'
    },
    
    email: {
        pattern: '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    }
};

const orderValidationRules = {
    id: types.number,
    summary: {
        createdAt: types.string,
        customer: types.string,
        status: types.string,
        shippedAt: types.string,
        currency: types.string,
        totalPrice: types.number
    },
    shipTo: {
        name: types.string,
        address: types.string,
        ZIP: types.string,
        region: types.string,
        country: types.string
    },
    customerInfo: {
        firstName: types.string,
        lastName: types.string,
        address: types.string,
        phone: types.string,
        email: types.email
    },
};

const productValidationRules = {
    name: types.string,
    price: types.number,
    currency: types.string,
    quantity: types.number,
    totalPrice: types.number,
    id: types.number,
    orderId: types.number
}

