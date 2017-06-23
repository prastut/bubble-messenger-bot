var $ = jQuery;

var dataArrayGenerator = function(length) {
    var i, array = [];
    for (i = 0; i < length; i++) {
        array.push([]);
    }

    return array;
};


var teamData = dataArrayGenerator(8);
var barData = {};
var gEvents = [];
var instance_id;

//Last Timestamp
var maxKey;

$.when(
        $.ajax(customSettings(urlGenerator('get-index-data'), instance_id, channels[0])),
        $.ajax(customSettings(urlGenerator('get-index-data'), instance_id, channels[1])),
        $.ajax(customSettings(urlGenerator('events'), instance_id, ""))
    )
    .done(function(team1, team2, events) {
        // console.log("HEllo");
        pushData(team1, 0);
        pushData(team2, 2);
        pushEventData(events);
        lineGraph();
        bargraph();

        // console.log(events);
        // console.log(gEvents);


        updateData();
        // console.log(channels);
        // console.log(barData);
    });

$(".ui-data-element").click(function(event) {

    var clicked = $(this).attr('id');
    var element = clicked.split('-')[0];
    var clickedIndex = clicked.split('-')[1];
    // console.log(element);

    $("#pointing-" + element).css({
        "padding-bottom": "0"
    });

    $.each($('.ui-data-element'), function() {
        $(this).fadeTo(0, 1);
    });


    var playerOrTeam = element == "player" ? "player" : "team";
    var notClicked = clickedIndex == "1" ? "2" : "1";

    $("#" + clicked).fadeTo(0, 1);
    $("#" + element + "-" + notClicked).fadeTo("slow", 0.5);
    $(".up-arrow").hide();
    $("#" + clicked + "-arrow").show();

    if (playerOrTeam == "player") {

        // console.log("player");


    } else {
        clickedIndex == "1" ? generateGraphs(0, 2) : generateGraphs(2, 4)
    }


    function generateGraphs(start, end) {
        clearGraph();
        clearIntervals();
        scatterGraph(start, end);
        lineGraph(start, end);

    }

    var timelineTop = $("#timeline-container").offset().top;
    $('html, body').animate({
        scrollTop: timelineTop
    }, 500);

});




function updateData() {

    var callTime = maxKey - 10;

    setInterval(
        function() {



            $.when(
                $.ajax(customSettings(urlGenerator('get-index-data'), instance_id, channels[0], callTime)),
                $.ajax(customSettings(urlGenerator('get-index-data'), instance_id, channels[1], callTime))

            ).done(function(team1, team2) {


                pushData(team1, 0, true);
                pushData(team2, 2, true);
                bargraph();

                callTime = maxKey;


            });


            // 
            // teamData[0].push({ 'x': x + 1000, 'y': Math.random() * 10, 'channel': "ind" });
            // teamData[1].push({ 'x': x + 1000, 'y': Math.random(), 'channel': "ind" });
            // teamData[2].push({ 'x': x + 1000, 'y': Math.random(), 'channel': "pak" });
            // teamData[3].push({ 'x': x + 1000, 'y': Math.random(), 'channel': "pak" });

            // x = x + 1000;

            // console.log("PD");
        },
        10000);



    // d3.csv("data-alt.csv", function(error, data) {
    //     data.forEach(function(d) {
    //         d.date = parseDate(d.date);
    //         d.close = +d.close;
    //     });

    //     // Scale the range of the data again 
    //     x.domain(d3.extent(data, function(d) { return d.date; }));
    //     y.domain([0, d3.max(data, function(d) { return d.close; })]);

    //     // Select the section we want to apply our changes to
    //     var svg = d3.select("body").transition();

    //     svg.select(".line") // change the line
    //         .duration(750)
    //         .attr("d", valueline(data));
    //     svg.select(".x.axis") // change the x axis
    //         .duration(750)
    //         .call(xAxis);
    //     svg.select(".y.axis") // change the y axis
    //         .duration(750)
    //         .call(yAxis);

    // });
}


function bgLive(object, channel) {

    // console.log(object);

    maxKey = Object.keys(object[channel])[Object.keys(object[channel]).length - 1];

    if (maxKey) {

        barData[channel] = [
            object[channel][maxKey].neg,
            object[channel][maxKey].pos
        ];



    }


}

function bargraph() {
    //Width and height
    var w = 110;
    var h = 50;
    var barPadding = 5;

    $.each($('.bar'), function(index, element) {
        var key = channels[index];
        var dataset = barData[key];

        $(element).empty();

        if (dataset) {
            // console.log(key);
            // console.log("DS->", dataset);

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


            var svg = d3.select("#" + $(element).attr("id"))
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            svg.call(tip);

            svg.selectAll("rect")
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
        var color;
        var name;
        for (var i = start; i < end; i++) {


            if (i % 2 === 0) {

                color = "red";
                name = toTitleCase(teamData[i][0].channel) + "'s NEG";

            } else {
                color = "green";
                name = toTitleCase(teamData[i][0].channel) + "'s POS";
            }

            series.push({
                color: color,
                data: teamData[i],
                name: name
            });

        }
    };

    pushData();

    var graph = new Rickshaw.Graph({
        element: document.getElementById("line"),
        width: 1100,
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


        annotator.add(element.x, element.y);
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

    var pushData = function() {
        series = [];
        var color;
        var name;
        for (var i = start; i < end; i++) {

            if (i % 2 === 0) {
                color = "red";
                name = toTitleCase(teamData[i][0].channel) + "'s NEG";

            } else {
                color = "green";
                name = toTitleCase(teamData[i][0].channel) + "'s POS";
            }

            series.push({
                color: color,
                data: teamData[i],
                name: name
            });

        }
    };

    pushData();

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

    // var timer = setInterval(function() {
    //     $.when(
    //             $.ajax(customSettings(instance_id, teamData[0][0].team), -1),
    //             $.ajax(customSettings(instance_id, teamData[2][0].team), -1)
    //         )
    //         .done(function(team1, team2) {
    //             console.log("Chala");
    //             pushData(team1, 0);
    //             pushData(team2, 2);
    //             graph.update();
    //         });

    // }, 10000);
    // console.log(team1);

    // setInterval(function() {
    //     $.when($.ajax(customSettings(instance_id, teams[0])), $.ajax(customSettings(instance_id, teams[1])))
    //         .done(function(team1, team2) {
    //             pushData(team1, 0);
    //             pushData(team2, 2);
    //             lineGraph();
    //         });

    // }, 10000);



    // var controls = new RenderControls({
    //     element: document.querySelector('form'),
    //     graph: graph
    // });

    // add some data every so often

    // var messages = [
    //     "That's a Six",
    //     "Wicket!",
    // ];

    // function addAnnotation(force) {
    //     if (messages.length > 0 && (force || Math.random() >= 0.95)) {
    //         annotator.add(teamData[2][teamData[2].length - 1].x, messages.shift());
    //         annotator.update();
    //     }
    // }

    // addAnnotation(true);

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

function pushData(response, indexOfSeries, live) {
    live = live || false;
    var object = response[0];
    var channel = Object.keys(object)[1 - Object.keys(object).indexOf('instance_id')];

    var keysSorted = Object.keys(object[channel]).map(Number).sort();
    // console.log(keysSorted);
    maxKey = keysSorted[keysSorted.length - 1];

    if (live) {


        for (var j = 0; j < keysSorted.length; j++) {

            teamData[indexOfSeries].shift();
            teamData[indexOfSeries + 1].shift();

        }
    }



    // Line Chart Data
    $.each(keysSorted, function(index, timestamp) {

        teamData[indexOfSeries].push({
            x: timestamp,
            y: object[channel][timestamp].neg,
            channel: channel

        });

        teamData[indexOfSeries + 1].push({
            x: timestamp,
            y: object[channel][timestamp].pos,
            channel: channel

        });
    });

    barData[channel] = [
        object[channel][maxKey].neg,
        object[channel][maxKey].pos
    ];
}


// function liveData(response, indexOfSeries) {
//     var object = response[0];
//     var channel = Object.keys(object)[1 - Object.keys(object).indexOf('instance_id')];

//     var keysSorted = Object.keys(object[channel]).map(Number).sort();
//     // console.log(keysSorted);
//     maxKey = keysSorted[keysSorted.length - 1];


//     // Line Chart Data
//     $.each(keysSorted, function(index, timestamp) {

//         teamData[indexOfSeries].push({
//             x: timestamp,
//             y: object[channel][timestamp].neg,
//             channel: channel

//         });

//         teamData[indexOfSeries + 1].push({
//             x: timestamp,
//             y: object[channel][timestamp].pos,
//             channel: channel

//         });
//     });

//     barData[channel] = [
//         object[channel][maxKey].neg,
//         object[channel][maxKey].pos
//     ];

// }

function pushEventData(response) {

    var events = response[0];

    $.each(events, function(index, element) {
        gEvents.push({

            x: Math.round(element.timestamp),
            y: element.event
        });
    });

    playerData(events[events.length - 1]);
}

function playerData(currentObj) {

    // console.log(currentObj);

    if (channels.length == 4) {
        channels.splice(-1, 3);

    }

    // channels.push(currentObj.batsmen_channel[0]);
    // channls.push(currentObj.bowler_channel[0]);



}




function customSettings(url, id, channel, second) {
    second = second || 0;
    return {
        "async": true,
        "crossDomain": true,
        "url": url,
        "type": "GET",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
        },
        "processData": false,
        "data": $.param({
            "instance_id": id,
            "channel": channel,
            "last_timestamp": second
        })
    };
}

function urlGenerator(url) {
    return "https://api.bubble.social/" + url;
}

function toTitleCase(str) {


    if (str.indexOf('_') != -1) {

        str = str.replace('_', " ");
        // console.log(str);
    }

    str = str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    return str;
}