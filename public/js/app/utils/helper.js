define(["moment"], function(moment) {

    moment().format('LTS');

    function pushLineData(lineData, channel, data, live) {
        live = live == "live" ? true : false;

        var timestamps = [];

        if (!(channel in lineData)) {
            lineData[channel] = {};
            lineData[channel].neg = [];
            lineData[channel].pos = [];
            lineData[channel].timestamps = [];
        }

        var max = 0;

        for (var i in data) {

            var time = data[i].time * 1000;

            lineData[channel].neg.push({
                sentiment: data[i][channel].neg,
                time: time
            });

            lineData[channel].pos.push({
                sentiment: data[i][channel].pos,
                time: time
            });

            max = Math.max(max, parseFloat(data[i][channel].pos));
            lineData[channel].timestamps.push(time);

        }

        lineData[channel].max = max;
    }


    function urlGenerator(url) {
        return "https://api.bubble.social/" + url;
    }


    function pushScatterData(scatterData, channel, data, live) {


        var series = [];
        var i;

        for (i in data) {

            var obj = {};
            var array = [];

            for (var tweet in data[i][channel]) {

                var sentiment = Math.abs(data[i][channel][tweet].sentiment_index);
                var sign = data[i][channel][tweet].sentiment_index < 0 ? '-' : '+';

                array.push({
                    'sentiment_index': sentiment,
                    'text': data[i][channel][tweet].text,
                    'type': sign
                });
            }

            obj.x = data[i].time * 1000;
            obj.y = array;

            series.push(obj);

        }


        var scatterSeries = [];
        var max = 0;

        for (i = 0; i < series.length; i++) {

            len = series[i].y.length;
            max = Math.max(max, len);
        }

        for (i = 0; i < max; i++) {
            scatterSeries.push([]);
        }

        for (i = 0; i < series.length; i++) {
            len = series[i].y.length;
            x = series[i].x;

            for (var j = 0; j < len; j++) {
                y = series[i].y[j];
                scatterSeries[j].push({
                    x: x,
                    y: y
                });

            }
        }


        // First Time Updating
        if (!(channel in scatterData)) {
            scatterData[channel] = scatterSeries;
            // console.log("FIRST TIME", scatterData[channel]);


        } else { //Live Updating

            // console.log("NEW DATA", scatterSeries);

            var prevDataLength = scatterData[channel].length;
            var newDataLength = scatterSeries.length;

            var minLength = Math.min(scatterData[channel].length, scatterSeries.length);

            if (minLength == newDataLength) {
                // Old Data has larger number of independent arrays

                for (i = 0; i < minLength; i++) {

                    scatterData[channel][i] = scatterData[channel][i].concat(scatterSeries[i]);
                }
            } else {
                // New Data has large number of independent arrays
                var compartmentsToBeAdded = newDataLength - prevDataLength;

                for (i = 0; i < compartmentsToBeAdded; i++) {

                    scatterData[channel].push([]);
                }

                for (i = 0; i < newDataLength; i++) {

                    scatterData[channel][i] = scatterData[channel][i].concat(scatterSeries[i]);
                }

            }

            // console.log("UPDATED", scatterData[channel]);

        }


    }


    return {
        pL: pushLineData,
        pS: pushScatterData,
        url: urlGenerator

    };


});