define(["d3"], function(d3) {

    function lineGraph() {

        var updateWidth;
        var data = {};
        // var updateHeight;
        // var updateFillColor;
        var updateData;

        var x;
        var xZoom;
        var y = d3.scaleLinear();

        var zoom = d3.zoomIdentity;

        var sentimentsLine = d3.line()
            .x(function(d) {
                return x(d.time);
            })
            .y(function(d) {
                return y(d.sentiment);
            });


        function chart(selection) {

            selection.each(function() {

                var dom = d3.select(this);
                y.domain([0, data.max]).nice().range([dom.attr("height"), 0]);

                var line = dom.append("g")
                    .attr("class", "line-chart");

                var neg = line.append("path")
                    .datum(data.neg)
                    .attr("class", "sentiment--line sentiment--neg")
                    .attr("d", sentimentsLine);

                var pos = line.append("path")
                    .datum(data.pos)
                    .attr("class", "sentiment--line sentiment--pos")
                    .attr("d", sentimentsLine);


                updateDataLine = function() {

                    pos.transition()
                        .attr("d", sentimentsLine(data.pos));

                    neg.transition()
                        .attr("d", sentimentsLine(data.neg));
                };

                zoomLine = function() {

                    pos.attr("d", sentimentsLine);
                    neg.attr("d", sentimentsLine);

                };
            });
        }

        chart.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            if (typeof updateDataLine === 'function') updateDataLine();
            return chart;
        };

        chart.zoom = function(value) {
            if (!arguments.length) return zoom;
            zoom = value;
            if (typeof zoomLine === 'function') zoomLine();
            return chart;
        };

        chart.x = function(commonXAxis) {
            if (!arguments.length) return d3.scaleTime();
            x = commonXAxis;
            return chart;

        };

        chart.xZoom = function(commonZoomAxis) {
            if (!arguments.length) return d3.scaleTime();
            x = commonZoomAxis;
            return chart;
        };

        return chart;
    }

    return {
        init: lineGraph
    };
});