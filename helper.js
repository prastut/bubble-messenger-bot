module.exports = {
    getParams: function(url, params) {
        return { url: module.exports.customUrlGenerator(url), qs: params, json: true };
    },

    customUrlGenerator: function(url) {
        return "http://bubble.social/" + url;
    },

    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);


    },

    ip: "http://139.59.25.186/"

};