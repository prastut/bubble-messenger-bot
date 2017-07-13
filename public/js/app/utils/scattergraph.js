define(["d3", "twemoji"], function(d3, emoji) {


    function scatterGraph() {
        var updateWidth;
        var data = {};

        var updateData;

        var x;
        var xZoom = d3.scaleTime();
        var y = d3.scaleLinear();

        var yAxis = d3.axisRight(y);

        var zoom;

        var tweetshow = d3.select("body")
            .append("div")
            .attr("class", "tooltip-text")
            .style("opacity", 0);

        var emoji = d3.select("body")
            .append("div")
            .attr("class", "emoji")
            .style("opacity", 0)
            .style("position", "absolute");


        function chart(selection) {
            // console.log(selection);
            selection.each(function() {


                var dom = d3.select(this);

                // Axis
                y.domain(d3.extent(d3.merge(data), function(d) { return d.y.sentiment_index; })).nice().range([dom.attr("height"), 0]);


                var scatter = dom.append("g")
                    .attr("class", "scatter-chart");

                scatter.selectAll(".series")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "series")
                    .selectAll(".point")
                    .data(function(d) { return d; })
                    .enter().append("circle")
                    .attr("class", "point")
                    .attr("r", 8)
                    .attr("cx", function(d) { return x(d.x); })
                    .attr("cy", function(d) { return y(d.y.sentiment_index); })
                    .style("stroke", function(d) {
                        if (d.y.type == "-") {
                            return "red";
                        } else {
                            return "green";
                        }
                    })
                    .on("click", click);

                scatter.append("g")
                    .attr("class", "axis axis--y")
                    .call(yAxis.tickValues(d3.range(1, 10, 3)));

                var coords = [];

                scatter.selectAll(".tick").each(function(data) {
                    var tick = d3.select(this);
                    var transform = tick.attr("transform");
                    var c = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(",")[1];
                    coords.push(parseInt(c));
                });

                coords.push(0);
                coords = coords.sort();
                coords.splice(coords.length - 1, 1);
                var height = coords[1] - coords[0];

                updateScatterData = function() {

                    var t = d3.transition().duration(750);

                    console.log("UPDATE", data);
                    var update = scatter.selectAll(".series")
                        .data(data);

                    update.exit().remove();

                    var dots = update.enter()
                        .append("g")
                        .attr("class", "series")
                        .merge(update)
                        .selectAll(".point")
                        .data(function(d) { return d; })
                        .enter().append("circle")
                        .attr("class", "point")
                        .attr("r", 8);


                    dots
                        .attr("cx", function(d) { return x(d.x); })
                        .transition(t)
                        .attr("cy", function(d) { return y(d.y.sentiment_index); })
                        .style("stroke", function(d) {
                            if (d.y.type == "-") {
                                return "red";
                            } else {
                                return "green";
                            }
                        });

                    dots.on("click", click);

                    // hello(2);


                    // console.log(inner);

                    //     .selectAll(".point")
                    //     .data(function(d) { return d; })
                    //     .enter().append("circle")
                    //     .attr("class", "point")
                    //     .attr("r", 8)
                    //     .attr("cx", function(d) { return x(d.x); })
                    //     .attr("cy", function(d) { return y(d.y.sentiment_index); })
                    //     .style("stroke", function(d) {
                    //         if (d.y.type == "-") {
                    //             return "red";
                    //         } else {
                    //             return "green";
                    //         }
                    //     });



                    // scatter.selectAll(".series")
                    //     .data(data)
                    //     .enter().append("g")
                    //     .attr("class", "series")
                    //     .selectAll(".point")
                    //     .data(function(d) { return d; })
                    //     .enter().append("circle")
                    //     .attr("class", "point")
                    //     .attr("r", 8)
                    //     .attr("cx", function(d) { return x(d.x); })
                    //     .attr("cy", function(d) { return y(d.y.sentiment_index); })
                    //     .style("stroke", function(d) {
                    //         if (d.y.type == "-") {
                    //             return "red";
                    //         } else {
                    //             return "green";
                    //         }
                    //     });

                    // svg.selectAll("circle")
                    // .data(data) // Update with new data
                    // .transition() // Transition from old to new
                    // .duration(1000) // Length of animation
                    // .each("start", function() { // Start animation
                    //     d3.select(this) // 'this' means the current element
                    //         .attr("fill", "red") // Change color
                    //         .attr("r", 5); // Change size
                    // })
                    // .delay(function(d, i) {
                    //     return i / dataset.length * 500; // Dynamic delay (i.e. each item delays a little longer)
                    // })
                    // //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
                    // .attr("cx", function(d) {
                    //     return xScale(d[0]); // Circle's X
                    // })
                    // .attr("cy", function(d) {
                    //     return yScale(d[1]); // Circle's Y
                    // })
                    // .each("end", function() { // End animation
                    //     d3.select(this) // 'this' means the current element
                    //         .transition()
                    //         .duration(500)
                    //         .attr("fill", "black") // Change color
                    //         .attr("r", 2); // Change radius
                    // });

                };

                zoomScatter = function() {
                    scatter.selectAll(".series")
                        .selectAll(".point")
                        .attr("cx", function(d) { return x(d.x); })
                        .attr("cy", function(d) { return y(d.y.sentiment_index); });
                };



                function click(d) {

                    var yClick = d3.mouse(this)[1];
                    var coordsLocal = coords.slice();
                    // console.log(yClick);

                    tweetshow.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    tweetshow.html(d.y.text)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");

                    emoji.transition()
                        .duration(200)
                        .style("opacity", 0.9);


                    var segmentClicked = d3.bisectRight(coordsLocal, yClick) - 1;


                    if (d.y.type == "-") {
                        emoji.html(twemoji.parse('\u2764'))
                            .style("left", (5) + "px")
                            .style("top", (coordsLocal[segmentClicked] + height / 2 + 50) + "px");

                    } else {


                        console.log(twemoji.convert.fromCodePoint('1F602'));

                        emoji.html(twemoji.convert.fromCodePoint('1F602'))
                            .style("left", (5) + "px")
                            .style("top", (coordsLocal[segmentClicked] + height / 2 + 50) + "px");
                    }


                    coordsLocal.splice(segmentClicked, 1);

                    var rect = scatter.selectAll('rect')
                        .data(coordsLocal)
                        .enter()
                        .append('rect')
                        .attr("x", 0)
                        .attr("y", function(d) { return d; })
                        .attr("height", height)
                        .attr("width", dom.attr("width"))
                        .style("opacity", 0.1);


                    setTimeout(function() {

                        tweetshow.transition()
                            .duration(500)
                            .style("opacity", 0);

                        emoji.transition()
                            .duration(500)
                            .style("opacity", 0);

                        rect.transition()
                            .duration(500)
                            .style("opacity", 0)
                            .remove();

                        // scatter.selectAll("rect").remove();
                    }, 2000);



                }


            });
        }

        chart.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            if (typeof updateScatterData === 'function') updateScatterData();
            return chart;
        };


        chart.zoom = function(value) {
            if (!arguments.length) return zoom;
            zoom = value;
            if (typeof zoomScatter === 'function') zoomScatter();
            return chart;
        };

        chart.x = function(commonXAxis) {
            if (!arguments.length) return d3.scaleTime();
            x = commonXAxis;
            return chart;

        };

        // chart.x = function(value) {

        //     return x;
        // };



        return chart;
    }

    function hello(value) {
        console.log(value);
    }


    return {
        init: scatterGraph
    };
});