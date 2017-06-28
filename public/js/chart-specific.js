var $ = jQuery;

var dataArrayGenerator = function(length) {
    var i, array = [];
    for (i = 0; i < length; i++) {
        array.push([]);
    }

    return array;
};


var teamData = dataArrayGenerator(2);
var barData = {};
var channels = [];


var gEvents = [];
var instance_id;


$.getJSON(urlGenerator('get-index-data'), params).then(function(data) {

    console.log("PARAMS->", params);
    console.log("DATA", data);

    instance_id = data.instance_id;
    pushData(data, name, 0);

    if (parseInt(both) === 0) {
        lineGraph(0, 2);
        bargraph();
    }


});

function updateData() {
    var x = 1496570109000;
    setInterval(
        function() {

            barData[channels[0]] = [Math.random(), Math.random()];
            barData[channels[1]] = [Math.random(), Math.random()];

            bargraph();

            for (var i = 0; i < 4; i++) {

                teamData[i].shift();
            }
            teamData[0].push({ 'x': x + 1000, 'y': Math.random() * 10, 'channel': "ind" });
            teamData[1].push({ 'x': x + 1000, 'y': Math.random(), 'channel': "ind" });
            teamData[2].push({ 'x': x + 1000, 'y': Math.random(), 'channel': "pak" });
            teamData[3].push({ 'x': x + 1000, 'y': Math.random(), 'channel': "pak" });

            x = x + 1000;

            console.log("PD");
        },
        1000);

}

function bargraph() {
    //Width and height
    var w = 110;
    var h = 50;
    var barPadding = 5;

    $.each($('.bar'), function(index, element) {
        var key = channels[index];
        var dataset = barData[key];

        if (dataset) {

            var sum = dataset.reduce((a, b) => a + b, 0);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d, i) {
                    if (i == 0) {
                        return "<span style='color:red'>" + Math.round((d / sum) * 100) + "%</span>";
                    } else {
                        return "<span style='color:green'>" + Math.round((d / sum) * 100) + "%</span>";
                    }

                });


            $('.d3-tip').hide();
            $(element).empty();

            var svg = d3.select("#" + $(element).attr("id"))
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            svg.call(tip);

            var rect = svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("height", function(d) {
                    return 50;
                })
                .attr("x", function(d, i) {
                    return (i * dataset[0] / sum) * 100 + i * barPadding;
                })
                .attr("y", 0)
                .attr("width", function(d) {
                    return (d / sum) * 100;
                })
                .attr("fill", function(d, i) {
                    if (i == 0) {
                        return "red";
                    } else {
                        return "green";
                    }
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }


    });


}

function drawdata(svg, dataset) {

}


function lineGraph(start, end, specific) {
    start = start || 0;
    end = end || 4;
    specific = specific || false;

    var series = [];

    var palette = new Rickshaw.Color.Palette({
        scheme: 'classic9'
    });

    var pushData = function() {
        series = [];
        for (var i = start; i < end; i++) {

            if (i % 2 == 0) {
                series.push({
                    color: "red",
                    data: teamData[i],
                    name: teamData[i][0].channel.charAt(0).toUpperCase() + teamData[i][0].channel.slice(1) + " Negetive"
                });
            } else {

                series.push({
                    color: "green",
                    data: teamData[i],
                    name: teamData[i][0].channel.charAt(0).toUpperCase() + teamData[i][0].channel.slice(1) + " Positive"
                });

            }


        }
    };



    pushData();
    console.log(series);

    var graph = new Rickshaw.Graph({
        element: document.getElementById("line"),
        width: $(window).width() - 40,
        height: 500,
        renderer: 'line',
        stroke: true,
        preserve: true,
        interpolation: 'bundle',
        series: series
    });


    graph.render();


    var preview = new Rickshaw.Graph.RangeSlider({
        graph: graph,
        element: document.getElementById('line_slider'),
    });

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: function(x) {
            var d = new Date(0);
            d.setUTCSeconds(x);
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        }
    });

    var annotator = new Rickshaw.Graph.Annotate({
        graph: graph,
        element: document.getElementById('timeline')
    });

    var legend = new Rickshaw.Graph.Legend({
        graph: graph,
        element: document.getElementById('line_legend')

    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph,
        legend: legend
    });

    var order = new Rickshaw.Graph.Behavior.Series.Order({
        graph: graph,
        legend: legend
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: graph,
        legend: legend
    });



    var ticksTreatment = 'glow';

    var xAxis = new Rickshaw.Graph.Axis.X({
        graph: graph,
        tickFormat: function(x) {
            var d = new Date(0);
            d.setUTCSeconds(x);
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        }

    });

    xAxis.render();

    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph
    });

    yAxis.render();

    setInterval(function() {
        pushData();
        graph.update();
    }, 10000);


    $.each(gEvents, function(index, element) {


        annotator.add(teamData[2][teamData[2].length - 1].x, element.y);
        annotator.update();

    });

}

function scatterGraph(start, end, specific) {
    start = start || 0;
    end = end || 4;
    specific = specific || false;

    var series = [];

    var palette = new Rickshaw.Color.Palette({
        scheme: 'classic9'
    });


    for (i = start; i < end; i++) {
        series.push({
            color: palette.color(),
            data: teamData[i],
            name: teamData[i][0].channel
        });

    }

    var graph = new Rickshaw.Graph({
        element: document.getElementById("scatter"),
        width: 1100,
        height: 500,
        renderer: 'scatterplot',
        stroke: true,
        preserve: true,
        series: series
    });



    graph.render();

    var preview = new Rickshaw.Graph.RangeSlider({
        graph: graph,
        element: document.getElementById('scatter_slider'),
    });

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: function(x) {
            var d = new Date(0);
            d.setUTCSeconds(x / 1000);
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        }
    });

    var annotator = new Rickshaw.Graph.Annotate({
        graph: graph,
        element: document.getElementById('timeline')
    });

    var legend = new Rickshaw.Graph.Legend({
        graph: graph,
        element: document.getElementById('scatter_legend')

    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph,
        legend: legend
    });

    var order = new Rickshaw.Graph.Behavior.Series.Order({
        graph: graph,
        legend: legend
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: graph,
        legend: legend
    });



    var ticksTreatment = 'glow';

    var xAxis = new Rickshaw.Graph.Axis.X({
        graph: graph,
        tickFormat: function(x) {

            console.log(x);

            var d = new Date(0);
            d.setUTCSeconds(x);
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        }

    });

    xAxis.render();

    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph
    });

    yAxis.render();


}



function clearIntervals() {

    var killId = setTimeout(function() {
        for (var i = killId; i > 0; i--) clearInterval(i)
    }, 10000);

}

function clearGraph() {
    $('#line_legend, #scatter_legend').empty();
    $('#line, #timeline, #line_slider, #scatter, #scatter_slider').empty();
}

function pushData(object, name, indexOfSeries) {

    var channel = Object.keys(object)[1 - Object.keys(object).indexOf('instance_id')];
    var keysSorted = Object.keys(object[channel]).map(Number).sort();
    var maxKey = keysSorted[keysSorted.length - 1];

    channels.push(channel);
    // Line Chart Data
    $.each(keysSorted, function(index, timestamp) {

        teamData[indexOfSeries].push({
            x: keysSorted[index],
            y: object[channel][timestamp].neg,
            channel: name

        });

        teamData[indexOfSeries + 1].push({
            x: keysSorted[index],
            y: object[channel][timestamp].pos,
            channel: name

        });
    });

    barData[channel] = [
        object[channel][maxKey].neg,
        object[channel][maxKey].pos
    ];
}

function pushEventData(response) {

    var events = response[0];

    $.each(events, function(index, element) {
        gEvents.push({

            x: element.seconds,
            y: element.event
        });
    });
}

function customSettings(url, id, channel, second) {
    second = second || 0;
    return {
        "async": true,
        "crossDomain": true,
        "url": url,
        "type": "POST",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
        },
        "processData": false,
        "data": JSON.stringify({
            "instance_id": id,
            "channel": channel,
            "last_second": second
        })
    };
}

function urlGenerator(url) {
    return "https://api.bubble.social/" + url;
}