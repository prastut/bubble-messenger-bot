define(["d3", "twemoji", "jquery"], function(d3, emoji) {


    function scatterGraph() {

        // Data Model
        var data = {};
        var updateData;

        //Axis
        var x;
        var y = d3.scaleLinear();
        var yAxis = d3.axisRight(y);


        // Dimensions
        var width;
        var height;
        var updateWidth;

        //Initial Zoom Level
        var zoom;

        var tweetshow = d3.select("body")
            .append("div")
            .attr("class", "tweet")
            .style("opacity", 0);

        var emoji = d3.select("body")
            .append("div")
            .attr("class", "emoji")
            .style("opacity", 0)
            .style("position", "absolute");

        var positiveEmotions = {
            2: '1F60A',
            1: '1F601',
            0: '1F606'
        };

        var negetiveEmotions = {
            2: '1F612',
            1: '1F61E',
            0: '1F620'

        };


        function chart(selection) {
            selection.each(function() {

                var dom = d3.select(this);

                // Axis
                y.domain([0, 9]).range([height, 0]);

                // console.log(data);


                var scatter = dom.append("g")
                    .attr("class", "scatter-chart");

                var segmentClickedRect = scatter.append('rect')
                    .attr("class", "segment-clicked-rect");

                var scatterdots = scatter.selectAll(".series")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "series")
                    .selectAll(".point")
                    .data(function(d) { return d; })
                    .enter().append("g")
                    .attr("class", "point");

                //Clip Circles
                var clipCircles = scatterdots.append("svg:clipPath")
                    .attr("id", function(d, i) {
                        return "clip-circle-" + d.x + d.y.sentiment_index;
                    })
                    .append("circle")
                    .attr("r", 10)
                    .attr("cx", function(d) { return x(d.x); })
                    .attr("cy", function(d) { return y(d.y.sentiment_index); })
                    .attr("transform", "translate(10,10)");

                //Image
                var image = scatterdots.append("image")
                    .attr("class", "point-image")
                    .attr("x", function(d) { return x(d.x); })
                    .attr("y", function(d) { return y(d.y.sentiment_index); })
                    .attr("width", "20px")
                    .attr("height", "20px")
                    .attr("xlink:href", function(d, i) {
                        return "https://randomuser.me/api/portraits/thumb/men/" + Math.floor(Math.random() * 50) + ".jpg";
                    })
                    .attr("clip-path", function(d, i) {
                        return 'url(#clip-circle-' + d.x + d.y.sentiment_index + ")";

                    })
                    .on("click", click);

                var strokeCircles = scatterdots.append("circle")
                    .attr("class", "point-image-circle")
                    .attr("r", 10)
                    .attr("cx", function(d) { return x(d.x); })
                    .attr("cy", function(d) { return y(d.y.sentiment_index); })
                    .attr("transform", "translate(10,10)")
                    .style("fill", "none")
                    .style("stroke", function(d) {
                        if (d.y.type == "-") {
                            return "red";
                        } else {
                            return "green";
                        }
                    });


                var coords = [];

                scatter.append("g")
                    .attr("class", "axis axis--y")
                    .call(yAxis.tickValues(d3.range(0, 9, 3)));

                scatter.selectAll(".tick").each(function(data) {
                    var tick = d3.select(this);
                    var transform = tick.attr("transform");
                    var c = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(",")[1];
                    coords.push(parseInt(c));
                });


                coords.push(0);
                coords = coords.sort();
                coords.splice(coords.length - 1, 1);

                var heightGrid = coords[1] - coords[0];




                updateScatterData = function() {


                    var t = d3.transition().duration(750);

                    var update = scatter.selectAll(".series")
                        .data(data);

                    console.log(update);

                    update.exit().remove();

                    // var point = update.enter()
                    //     .append("g")
                    //     .attr("class", "series")
                    //     .merge(update)
                    //     .selectAll(".point")
                    //     .data(function(d) { return d; })
                    //     .enter().append("g")
                    //     .attr("class", "point");


                    // dots
                    //     .attr("cy", function(d) { return y(d.y.sentiment_index); })
                    //     .attr("cx", x.range()[1]) // Transistion from the extreme right to the screen
                    //     .transition(t)
                    //     .attr("cx", function(d) { return x(d.x); })
                    //     .style("stroke", function(d) {
                    //         if (d.y.type == "-") {
                    //             return "red";
                    //         } else {
                    //             return "green";
                    //         }
                    //     });

                    // dots.on("click", click);

                    // var alldots = scatter.selectAll(".series")
                    //     .selectAll(".point")
                    //     .attr("cy", function(d) { return y(d.y.sentiment_index); })
                    //     .transition(t)
                    //     .attr("cx", function(d) { return x(d.x); });



                };

                zoomScatter = function() {

                    clipCircles
                        .attr("r", function() {
                            var width = 20 * zoom.k > 40 ? 40 : 20 * zoom.k;
                            return width / 2;
                        })
                        .attr("cx", function(d) { return x(d.x); })
                        .attr("transform", function() {

                            var translate = 20 * zoom.k > 40 ? 40 : 20 * zoom.k;

                            return "translate(" + (translate / 2) + "," + (translate / 2) + ")";

                        });


                    //Image
                    image
                        .attr("x", function(d) { return x(d.x); })
                        .attr("width", function() {
                            var width = 20 * zoom.k > 40 ? 40 : 20 * zoom.k;
                            return width;
                        })
                        .attr("height", function() {
                            var height = 20 * zoom.k > 40 ? 40 : 20 * zoom.k;
                            return height;

                        });

                    strokeCircles
                        .attr("r", function() {
                            var width = 20 * zoom.k > 40 ? 40 : 20 * zoom.k;
                            return width / 2;
                        })
                        .attr("cx", function(d) { return x(d.x); })
                        .attr("transform", function() {

                            var translate = 20 * zoom.k > 40 ? 40 : 20 * zoom.k;

                            return "translate(" + (translate / 2) + "," + (translate / 2) + ")";

                        });

                };



                function click(d) {

                    var yClick = d3.mouse(this)[1];
                    var coordsLocal = coords.slice();

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

                    var text = d.y.type == "-" ? negetiveEmotions[segmentClicked] : positiveEmotions[segmentClicked];

                    emoji.html(twemoji.convert.fromCodePoint(text))
                        .style("left", (5) + "px")
                        .style("top", (coordsLocal[segmentClicked] + heightGrid / 2 + 50) + "px");


                    // Fade rects
                    segmentClickedRect.attr("x", 0)
                        .attr("y", coordsLocal[segmentClicked])
                        .attr("height", heightGrid)
                        .attr("width", width)
                        .style("opacity", 1);

                    coordsLocal.splice(segmentClicked, 1);

                    console.log(coordsLocal);
                    var fadeRect = scatter.selectAll('.fade-rect')
                        .data(coordsLocal)
                        .enter()
                        .append('rect')
                        .attr("class", "fade-rect")
                        .attr("x", 0)
                        .attr("y", function(d) {
                            return d;
                        })
                        .attr("height", heightGrid)
                        .attr("width", width)
                        .style("opacity", 1)
                        .style("fill", "black");


                    setTimeout(function() {

                        tweetshow.transition()
                            .duration(500)
                            .style("opacity", 0);

                        emoji.transition()
                            .duration(500)
                            .style("opacity", 0);

                        segmentClickedRect.transition()
                            .duration(500)
                            .style("opacity", 0);

                        fadeRect.transition()
                            .duration(500)
                            .style("opacity", 0).remove();



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


        chart.width = function(value) {
            if (!arguments.length) return 960;
            width = value;
            return chart;
        };

        chart.height = function(value) {
            if (!arguments.length) return 500;
            height = value;
            return chart;
        };

        chart.x = function(commonXAxis) {
            if (!arguments.length) return d3.scaleTime();
            x = commonXAxis;
            return chart;
        };

        return chart;
    }



    return {
        init: scatterGraph
    };
});