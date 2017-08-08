define(["d3", "twemoji"], function(d3) {
    function lineGraph() {

        // Data Model
        var data = {};
        var updateData;

        //Axis
        var x;
        var y = d3.scaleLinear();

        //Circles on line graph
        var circle;

        // Dimensions
        var height;

        //Initial Zoom Level
        var zoom;

        var sentimentsLine = d3.line()
            .x(function(d) {
                return x(d.time);
            })
            .y(function(d) {
                return y(d.sentiment);
            });

        var bisectLine = d3.bisector(function(d) { return d.time; }).left;

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
                y.domain([0, data.max]).nice().range([height, 0]);

                var line = dom.append("g")
                    .attr("class", "line-chart");

                var neg = line.append("path")
                    .datum(data.neg)
                    .attr("class", "sentiment--line sentiment--neg")
                    .attr("d", sentimentsLine)

                var pos = line.append("path")
                    .datum(data.pos)
                    .attr("class", "sentiment--line sentiment--pos")
                    .attr("d", sentimentsLine);

                // Create circles on the line chart
                circle = line.append('g');
                circle.selectAll('circle')
                  .data((data.neg).concat(data.pos))
                  .enter()
                  .append('circle')
                  .attr('r', 5)
                  .attr('cx', function(d){
                    return x(d.time);
                  })
                  .attr('cy', function(d){
                    return y(d.sentiment);
                  })
                  .attr('fill', 'white')
                  .on('mouseover', mouseover)
                  .on('mouseout', mouseout);

                var lineChartToolTipLine = line.append("line")
                    .attr("class", "x-hover-line line-hover-line")
                    .style("opacity", "0");

                var lineChartToolTipText = d3.select("body")
                    .append("div")
                    .attr("class", "line-tooltip-text")
                    .style("opacity", 1);

                var posText = lineChartToolTipText.append("div").attr("class", "line-tooltip-text-pos").html('arihant');
                var negText = lineChartToolTipText.append("div").attr("class", "line-tooltip-text-neg");

                updateDataLine = function() {
                    resizeLine("yes");
                };

                zoomLine = function() {
                    mouseout();
                    resizeLine();
                };

                resizeLine = function(transition) {
                    transition = transition == "yes" ? 750 : 0;
                    var t = d3.transition().duration(transition);

                    pos.transition(t)
                        .attr("d", sentimentsLine(data.pos));

                    neg.transition(t)
                        .attr("d", sentimentsLine(data.neg));

                    // Transition of circles
                    circle.selectAll('circle').transition(t)
                        .attr('cx', function(d){
                          return x(d.time);
                        })
                        .attr('cy', function(d){
                          return y(d.sentiment);
                        });

                };

                function mouseover(d, i) {
                    var posX = x.invert(d3.mouse(this)[0]);

                    var obj = {};
                    obj.neg = data.neg[i%(data.neg.length)].sentiment;
                    obj.pos = data.pos[i%(data.pos.length)].sentiment;
                    obj.time = data.pos[i%(data.pos.length)].time;
                    var time = x(posX);

                    var sum = [obj.neg, obj.pos].reduce((a, b) => a + b, 0);
                    var percentage = [obj.neg, obj.pos].map(function(i) { return Math.round(i / sum * 100); });
                    var yCoords = [obj.neg, obj.pos].map(function(i) { return y(i); });

                    lineChartToolTipText.transition().style("opacity", "1");

                    negText.html('<span style="font-size:20px">' + twemoji.convert.fromCodePoint(negetiveEmotions[1]) + '</span> ' + percentage[0] + "%")
                        .style("left", (time) + "px")
                        .style("top", (yCoords[0] + 80) + "px")
                        .style('opacity', 1);

                    posText.html(percentage[1] + "%" + '<span style="font-size:20px">' + twemoji.convert.fromCodePoint(positiveEmotions[1]) + '</span> ')
                        .style("left", (time - 50) + "px")
                        .style("top", (yCoords[1] + 80) + "px")
                        .style('opacity', 1);

                    lineChartToolTipLine.transition()
                        .style("opacity", "1")
                        .attr("transform", "translate(" + time + ",0)")
                        .attr("y1", yCoords[0])
                        .attr("y2", yCoords[1]);
                }

                var findYatXbyBisection = function(x, path, error) {
                    // console.log(path);
                    var length_end = path.getTotalLength(),
                        length_start = 0,
                        point = path.getPointAtLength((length_end + length_start) / 2) // get the middle point
                        ,
                        bisection_iterations_max = 50,
                        bisection_iterations = 0

                    error = error || 0.01

                    while (x < point.x - error || x > point.x + error) {
                        // get the middle point
                        point = path.getPointAtLength((length_end + length_start) / 2)

                        if (x < point.x) {
                            length_end = (length_start + length_end) / 2
                        } else {
                            length_start = (length_start + length_end) / 2
                        }

                        // Increase iteration
                        if (bisection_iterations_max < ++bisection_iterations)
                            break;
                    }
                    return point.y;
                }

                function mouseout() {
                    lineChartToolTipText.transition().style("opacity", "0");
                    lineChartToolTipLine.transition().style("opacity", "0");
                }

                function pulse() {
                    var circle = d3.select(this);
                    console.log(circle);
                    repeat();
                    function repeat() {
                        circle.transition()
                            .duration(2000)
                            .attr("stroke-width", 2)
                            .attr("r", 20)
                            .transition()
                            .duration(800)
                            .attr('stroke-width', 3)
                            .attr("r", 12)
                            .each("end", repeat);
                    }
                }
            });
        }

        chart.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            if (typeof updateDataLine === 'function') updateDataLine();
            return chart;
        };

        chart.x = function(commonXAxis) {
            if (!arguments.length) return d3.scaleTime();
            x = commonXAxis;
            if (typeof resizeLine === 'function') resizeLine();
            return chart;
        };

        chart.height = function(value) {
            if (!arguments.length) return 500;
            height = value;
            return chart;
        };
        return chart;
    }

    return {
        init: lineGraph
    };
});
