define(["d3", "twemoji"], function(d3) {



    function eventGraph() {

        // Data Model
        var data = {};
        var updateData;

        //Axis
        var x;
        var y = d3.scaleLinear();

        // Dimensions
        var width;
        var overallheight;
        var updateWidth;
        var yPos;

        //Event Bisector
        var eventBisect = d3.bisector(function(d) {
            return d.time;
        }).left;

        var emojiDict = {
            "OFFSIDE": "261D",
            "CHANCE": "1F631",
            "GOAL": "26BD",
            "FOUL": "1F915",
            "CORNER": "261D",
            "Chile": "🇨🇱",
            "Germany": "🇩🇪"

        };


        function chart(selection) {

            selection.each(function() {

                var dom = d3.select(this);

                var backgroundRect = dom.append("rect")
                    .attr("class", "events-rect")
                    .attr("height", 50)
                    .attr("width", width)
                    .attr("transform", "translate(0," + (yPos - 2) + ")");


                var events = dom.append("g")
                    .attr("class", "events")
                    .attr("transform", "translate(0," + (yPos) + ")");


                var event = events.selectAll("g")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "event");

                var emoji = event.append("text")
                    .attr("class", "event-points")
                    .attr("x", function(d, i) {
                        return x(d.time);

                    })
                    .attr("dy", 20)
                    .text(function(d) {

                        return twemoji.convert.fromCodePoint(emojiDict[d.type]);
                    })
                    .on("mouseover", function() {
                        tooltipLine.transition().style("opacity", 1);
                        tooltipText.transition().style("opacity", 1);
                    })
                    .on("mouseout", function() {
                        tooltipLine.style("opacity", 0);
                        tooltipText.style("opacity", 0);
                    })
                    .on("mousemove", mousemove)
                    .on("click", mousemove);

                var displaytime = event.append("text")
                    .attr("class", "event-time")
                    .attr("x", function(d, i) {
                        return x(d.time);

                    })
                    .attr("dy", 40)
                    .text(function(d) {

                        return d.timeDisplay.time + "'";
                    });




                var tooltip = dom.append("g")
                    .attr("class", "tooltip-graph")
                    // .attr("transform", "translate(" + margin.left + "," + 390 + ")");

                var tooltipText = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip-text")
                    .style("opacity", 0);

                var tooltipLine = tooltip.append("line")
                    .attr("class", "x-hover-line hover-line")
                    .attr("y1", 0)
                    .attr("y2", yPos - 10)
                    .style("opacity", 0);


                updateEvents = function() {


                    events.selectAll("text")
                        .data(data)
                        .enter().append("text")
                        .attr("class", "event-points")
                        .attr("x", function(d, i) {
                            return x(d.time);

                        })
                        .attr("y", 20)
                        .text("\u26BD");

                    events.on(".click", null);

                    events.selectAll("circle")
                        .filter(function(d) { if (d.event) return d; })
                        .transition()
                        .attr("cx", function(d, i) {
                            return x(d.time);

                        });

                    events.on("mouseover", function() {
                            tooltipLine.transition().style("opacity", 1);
                            tooltipText.transition().style("opacity", 1);
                        })
                        .on("mouseout", function() {
                            tooltipLine.style("opacity", 0);
                            tooltipText.style("opacity", 0);
                        })
                        .on("mousemove", mousemove)
                        .on("click", mousemove);

                };

                zoomEvents = function() {

                    backgroundRect
                        .attr("height", function() {

                            var height = 50 * zoom.k > 55 ? 55 : 50 * zoom.k;
                            return height;
                        })
                        .attr("width", width);

                    emoji
                        .attr("x", function(d) {
                            if (zoom.k > 1) {
                                return x(d.time) - 8;
                            } else {
                                return x(d.time);
                            }
                        })
                        .style("font-size", function() {

                            if (zoom.k > 1) {

                                var size = 20 * zoom.k > 35 ? 35 : 20 * zoom.k;
                                return (size) + "px";

                            } else {
                                return "20px";
                            }
                        });

                    displaytime
                        .attr("x", function(d, i) {
                            return x(d.time);

                        });

                };

                function mousemove() {

                    var x0 = x.invert(d3.mouse(this)[0]);
                    var position = eventBisect(data, x0) - 1;


                    var item = data[position];
                    if (item) {
                        var xTooltip = x(item.time);
                        tooltipText.html('<span style="font-size:20px">' + emojiDict[item.country] + '</span><br>' + item.event)
                            .style("left", (xTooltip - 50 - 50) + "px")
                            .style("top", (overallheight * 0.4) + "px");

                        tooltip.attr("transform", "translate(" + (xTooltip + 10) + ",0)");
                    }
                }


            });
        }

        chart.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            if (typeof updateEvents === 'function') updateEvents();
            return chart;
        };

        chart.zoom = function(value) {
            if (!arguments.length) return zoom;
            zoom = value;
            if (typeof zoomEvents === 'function') zoomEvents();
            return chart;
        };

        chart.x = function(commonXAxis) {
            if (!arguments.length) return d3.scaleTime();
            x = commonXAxis;
            return chart;

        };

        chart.width = function(value) {
            if (!arguments.length) return 960;
            width = value;
            return chart;
        };

        chart.height = function(value) {
            if (!arguments.length) return 500;
            overallheight = value;
            return chart;
        };

        chart.yPos = function(value) {
            if (!arguments.length) return 300;
            yPos = value;
            return chart;

        };

        return chart;
    }

    return {
        init: eventGraph
    };
});