var barData = {};
var lineData = {};
var scatterData = {};

var eventsData = [{
    x: 1499019290 * 1000,
    y: "Goal!"

}, {
    x: 1499019320 * 1000,
    y: "Penalty"

}, {
    x: 1499019350 * 1000,
    y: "Offside"
}, {
    x: 1499019650 * 1000,
    y: "Half Time"
}];

var gEvents = [];
var instance_id;

// Settings for page view:
var vizWidth = $(document).width() < 800 ? $(document).width() + 200 : $(document).width();
var margin = {
        top: 20,
        right: 20,
        bottom: 110,
        left: 40
    },
    margin2 = {
        top: 430,
        right: 20,
        bottom: 30,
        left: 40
    };

// Helper Functions for D3
var parseDate = d3.timeParse("%b %Y");

var bisectDate = d3.bisector(function(d) {
    return d.x;
}).right;

var eventBisect = d3.bisector(function(d) {
    return d.x;
}).left;




$.when(
    $.getJSON(urlGenerator('get-index-data'), params),
    $.getJSON(urlGenerator('get-scatter-data'), params)

).done(function(index, scatter) {
    instance_id = index.instance_id;

    pushLineData(channel, index[0]);
    pushScatterData(channel, scatter[0]);
    makeGraph();
});



function makeGraph() {

    var index = lineData[channel];
    var scatter = scatterData[channel];

    var svg = d3.select("#line")
        .append("svg")
        .attr("width", vizWidth - 200)
        .attr("height", 500);

    var width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom;


    var x_new;

    var parseDate = d3.timeParse("%b %Y");

    var bisectDate = d3.bisector(function(d) {
        return d.time;
    }).right;

    // Axis
    // // Line Chart
    var xLine = d3.scaleTime().range([0, width]),
        xGeneralLine = d3.scaleTime().range([0, width]),
        yLine = d3.scaleLinear().range([height, 0]);

    xLine.domain(d3.extent(index.timestamps));
    yLine.domain([0, index.max]).nice();
    xGeneralLine.domain(xLine.domain());

    // // Scatter Chart
    var xScatter = d3.scaleTime().range([0, width]),
        xGeneralScatter = d3.scaleTime().range([0, width]),
        yScatter = d3.scaleLinear().range([height, 0]);

    xScatter.domain(d3.extent(d3.merge(scatter), function(d) { return d.x; })).nice();
    xGeneralScatter.domain(xScatter.domain());
    yScatter.domain(d3.extent(d3.merge(scatter), function(d) { return d.y.sentiment_index; })).nice();


    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);

    var sentimentsLine = d3.line()
        .x(function(d) {
            return xLine(d.time);
        })
        .y(function(d) {
            return yLine(d.sentiment);
        });

    // var eventsLine = d3.line()
    //     .x(function(d) {
    //         return x(d.x);
    //     })
    //     .y(function(d) {
    //         return y(150)
    //     });

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);


    // Charting
    // // Line Chart
    var sentiments = svg.append("g")
        .attr("class", "sentiments")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    sentiments.append("path")
        .datum(index.neg)
        .attr("class", "sentiment--line sentiment--neg")
        .attr("d", sentimentsLine);

    sentiments.append("path")
        .datum(index.pos)
        .attr("class", "sentiment--line sentiment--pos")
        .attr("d", sentimentsLine);


    // // Scatter Chart

    var scatterChart = svg.append("g")
        .attr("class", "scatter")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    scatterChart.selectAll(".series")
        .data(scatter)
        .enter().append("g")
        .attr("class", "series")
        .selectAll(".point")
        .data(function(d) { return d; })
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 8)
        .attr("cx", function(d) { return xScatter(d.x); })
        .attr("cy", function(d) { return yScatter(d.y.sentiment_index); })
        .style("stroke", function(d) {
            if (d.y.type == "-") {
                return "red";
            } else {
                return "green";
            }
        });



    // Events
    // var events = svg.append("g")
    //     .attr("class", "events")
    //     .attr("transform", "translate(" + margin.left + "," + 250 + ")");

    // events.selectAll("circle")
    //     .data(eventsData)
    //     .enter().append("circle")
    //     .attr("r", 8)
    //     .attr("cx", function(d, i) {
    //         return x(d.x);

    //     })
    //     .attr("cy", function(d, i) {

    //         return y(2);
    //     })
    //     .on("mouseover", function() {
    //         tooltipLine.style("display", null);
    //         tooltipText.style("display", null);
    //     })
    //     .on("mouseout", function() {
    //         tooltipLine.style("display", "none");
    //         tooltipText.style("display", "none");
    //     })
    //     .on("mousemove", mousemove)
    //     .on("click", mousemove);

    // // tooltip
    // var tooltip = svg.append("g")
    //     .attr("class", "tooltip-graph")
    //     .attr("transform", "translate(" + margin.left + "," + 390 + ")");;

    // var tooltipText = d3.select("body")
    //     .append("div")
    //     .attr("class", "tooltip-text")
    //     .style("display", "none");

    // var tooltipLine = tooltip.append("line")
    //     .attr("class", "x-hover-line hover-line")
    //     .attr("y1", 0)
    //     .attr("y2", -height)
    //     .style("display", "none");



    svg.call(zoom);


    zoom.scaleTo(svg, 2);
    zoom.translateBy(svg, -width, -height);

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;

        xLine.domain(t.rescaleX(xGeneralLine).domain());
        sentiments.select(".sentiment--pos").attr("d", sentimentsLine);
        sentiments.select(".sentiment--neg").attr("d", sentimentsLine);

        xZoomScatter = d3.event.transform.rescaleX(xGeneralScatter);

        scatterChart.selectAll(".series")
            .selectAll(".point")
            .attr("cx", function(d) { return xZoomScatter(d.x); })
            .attr("cy", function(d) { return yScatter(d.y.sentiment_index); });

    }


    // function mousemove() {
    //     var x0 = x.invert(d3.mouse(this)[0]);
    //     var position = eventBisect(eventsData, x0) - 1;

    //     var item = eventsData[position];
    //     // console.log(item);
    //     var xTooltip;

    //     if (!x_new) {
    //         xTooltip = margin.left + x(item.x);
    //     } else {
    //         xTooltip = margin.left + x_new(item.x);

    //     }
    //     var top = $('#scatter').offset().top + 40;
    //     var left = $('#scatter').offset().left + x(item.x);

    //     tooltipText.html(item.y)
    //         .style("left", left + "px")
    //         .style("top", top + "px");

    //     tooltip.attr("transform", "translate(" + xTooltip + "," + 400 + ")");


    // }

}

function update() {

    $

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

function pushLineData(channel, data, live) {
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
        console.log()
        max = Math.max(max, parseFloat(data[i][channel].pos));
        lineData[channel].timestamps.push(time);

        // if (i > 100) {
        //     break;
        // }

    }

    lineData[channel].max = max;


    // console.log(timestamps);

}


function urlGenerator(url) {
    return "https://api.bubble.social/" + url;
}


function pushScatterData(channel, data, live) {


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

    scatterData[channel] = scatterSeries;
}


function scatterGraph() {

    var data = scatterData[channel];

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", vizWidth - 200)
        .attr("height", 500);


    var width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var x_new;

    // Axis
    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);

    x.domain(d3.extent(d3.merge(data), function(d) { return d.x; })).nice();
    y.domain(d3.extent(d3.merge(data), function(d) { return d.y.sentiment_index; })).nice();

    x2.domain(x.domain());

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var sentiments = svg.append("g")
        .attr("class", "sentiments")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    sentiments.selectAll(".series")
        .data(data)
        .enter().append("g")
        .attr("class", "series")
        .style("fill", function(d, i) { return z(i); })
        .selectAll(".point")
        .data(function(d) { return d; })
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 4.5)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y.sentiment_index); });

    sentiments.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);


    // Events
    var events = svg.append("g")
        .attr("class", "events")
        .attr("transform", "translate(" + margin.left + "," + 270 + ")");

    events.selectAll("circle")
        .data(eventsData)
        .enter().append("circle")
        .attr("r", 4)
        .attr("cx", function(d, i) {
            console.log(d);
            return x(d.x);

        })
        .attr("cy", function(d, i) {

            return y(20);
        })
        .on("mouseover", function() {
            tooltipLine.style("display", null);
            tooltipText.style("display", null);
        })
        .on("mouseout", function() {
            tooltipLine.style("display", "none");
            tooltipText.style("display", "none");
        })
        .on("mousemove", mousemove)
        .on("click", mousemove);

    // tooltip
    var tooltip = svg.append("g")
        .attr("class", "tooltip-graph")
        .attr("transform", "translate(" + margin.left + "," + 390 + ")");;

    var tooltipText = d3.select("body")
        .append("div")
        .attr("class", "tooltip-text")
        .style("display", "none");

    var tooltipLine = tooltip.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", -height)
        .style("display", "none");



    svg.call(zoom);


    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;

        x.domain(t.rescaleX(x2).domain());
        // y.domain(t.rescaleY(y2).domain());

        sentiments.select(".axis--y").call(yAxis);

        x_new = d3.event.transform.rescaleX(x2);


        sentiments.selectAll(".series")
            .selectAll(".point")
            .attr("cx", function(d) {
                return x_new(d.x);
            })
            .attr("cy", function(d, i) {

                return y(d.y.sentiment_index);
            });

        events.selectAll("circle")
            .attr("cx", function(d, i) {
                return x_new(d.x);

            });
    }

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var position = eventBisect(eventsData, x0) - 1;

        var item = eventsData[position];
        // console.log(item);
        var xTooltip;



        if (!x_new) {
            xTooltip = margin.left + x(item.x);
        } else {
            xTooltip = margin.left + x_new(item.x);

        }
        var top = $('#scatter').offset().top + 10;
        var left = $('#scatter').offset().left + x(item.x);

        tooltipText.html(item.y)
            .style("left", left + "px")
            .style("top", top + "px");

        tooltip.attr("transform", "translate(" + xTooltip + "," + 400 + ")");


    }


}