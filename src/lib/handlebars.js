const handlebars = require('handlebars');

// Este helper permite comparar dos valores en la plantilla handlebars
handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

module.exports = handlebars;
