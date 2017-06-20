module.exports = {
    getParams: function(url, params) {
        return { url: module.exports.customUrlGenerator(url), qs: params, json: true };
    },

    customUrlGenerator: function(url) {
        return "http://api.bubble.social/" + url;
    },

    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);


    },

    ip: "https://bubble.social/",

    optionsPhone: {
        screenSize: {
            width: 320,
            height: 480
        },
        shotSize: {
            width: 320,
            height: 'all'
        },
        userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' +
            ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g',
    }

};