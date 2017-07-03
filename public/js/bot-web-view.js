var lineData = {};
var barData = {};


var gEvents = [];
var instance_id;


$.getJSON(urlGenerator('get-index-data'), params).then(function(data) {


    console.log(channel, data);
    instance_id = data.instance_id;
    pushData(channel, data);
    lineGraph();

});



function lineGraph() {
    var vizWidth = $(document).width();

    console.log(d3.select(".line"));

    var svg = d3.select("#line")
        .append("svg")
        .attr("width", vizWidth - 200)
        .attr("height", 500);

    margin = {
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
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom;


    var x_new;

    var parseDate = d3.timeParse("%b %Y");

    var bisectDate = d3.bisector(function(d) {
        return d.time;
    }).right;

    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

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

    var sentimentsLine = d3.line()
        .x(function(d) {
            return x(d.time);
        })
        .y(function(d) {
            return y(d.sentiment);
        });

    // var eventsLine = d3.line()
    //     .x(function(d) {
    //         return x(d.date);
    //     })
    //     .y(function(d) {
    //         return y2(1500 / 2);
    //     });

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var sentiments = svg.append("g")
        .attr("class", "sentiments")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var events = svg.append("g")
        .attr("class", "events")
        .attr("transform", "translate(" + margin.left + "," + 250 + ")");

    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("transform", "translate(" + margin.left + "," + 390 + ")");;

    var tooltipText = d3.select("body")
        .append("div")
        .attr("class", "tooltip-text")
        .style("display", "none");

    var tooltipLine = tooltip.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height)
        .style("display", "none");




    x.domain(d3.extent(lineData[channel].timestamps));
    y.domain([0, 4]);
    x2.domain(x.domain());

    var bisect = d3.bisector(function(d) {
        return d.timestamp;
    }).left;


    sentiments.append("path")
        .datum(lineData[channel].neg)
        .attr("class", "sentiment--line sentiment--neg")
        .attr("d", sentimentsLine);

    sentiments.append("path")
        .datum(lineData[channel].pos)
        .attr("class", "sentiment--line sentiment--pos")
        .attr("d", sentimentsLine);


    sentiments.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);


    //     events.selectAll("circle")
    //         .data(data)
    //         .enter().append("circle")
    //         .attr("r", 8)
    //         .attr("cx", function(d, i) {
    //             return x(d.date);

    //         })
    //         .attr("cy", function(d, i) {

    //             return y(1500 / 2);
    //         })
    //         .on("mouseover", function() {
    //             tooltipLine.style("display", null);
    //             tooltipText.style("display", null);
    //         })
    //         .on("mouseout", function() {
    //             tooltipLine.style("display", "none");
    //             tooltipText.style("display", "none");
    //         })
    //         .on("mousemove", mousemove)
    //         .on("click", mousemove);

    svg.call(zoom);

    //     // svg.append("rect")
    //     //     .attr("class", "zoom")
    //     //     .attr("width", width)
    //     //     .attr("height", height)
    //     //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //     //     // .call(zoom);

    //     zoom.scaleTo(svg, 2);
    //     zoom.translateBy(svg, -width, -height);

    //     // console.log(data);

    //     data.push({
    //         date: parseDate('May 2010'),
    //         price: 2000
    //     });

    //     console.log(data);

    //     function mousemove() {
    //         var x0 = x.invert(d3.mouse(this)[0]),
    //             i = bisectDate(data, x0);

    //         var item = data[bisectDate(data, x0)]
    //         console.log(item.price);



    //         if (!x_new) {
    //             var xTooltip = margin.left + x(item.date);
    //         } else {
    //             var xTooltip = margin.left + x_new(item.date);

    //         }

    //         tooltipText.html(item.price)
    //             .style("left", xTooltip + "px")
    //             .style("top", 20 + "px");

    //         tooltip.attr("transform", "translate(" + xTooltip + "," + 400 + ")");

    //         tooltip.select(".text").html("hello");

    //         tooltip.select(".x-hover-line").attr("y2", -height);


    //         var delayMillis = 1000; //1 second

    //         setTimeout(function() {}, delayMillis);

    //     }


    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;

        x.domain(t.rescaleX(x2).domain());
        sentiments.select(".sentiment--pos").attr("d", sentimentsLine);
        sentiments.select(".sentiment--neg").attr("d", sentimentsLine);


        x_new = d3.event.transform.rescaleX(x2);

        // events.selectAll("circle")
        //     .attr("cx", function(d) {
        //         return x_new(d.date);
        //     })
        //     .attr("cy", function(d, i) {

        //         return y(1500 / 2);
        //     });
    }

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

function pushData(channel, data, live) {
    live = live == "live" ? true : false;

    var timestamps = [];

    if (!(channel in lineData)) {
        lineData[channel] = {};
        lineData[channel].neg = [];
        lineData[channel].pos = [];
        lineData[channel].timestamps = [];
    }


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


        lineData[channel].timestamps.push(time);

        if (i > 100) {
            break;
        }

    }


    // console.log(timestamps);

}


function urlGenerator(url) {
    return "https://api.bubble.social/" + url;
}