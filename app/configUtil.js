var parseConfig = function (config) {
    return config.replace(/'/g, '"');
};
var parseAsArray = function (config) {
    var replacedString = config.replace(/'/g, '"');
    return replacedString.split(',')
};

module.exports = {
    parseConfig: parseConfig,
    parseAsArray: parseAsArray
};
