define(["jquery", "d3",
        "./utils/helper", "./utils/data",
        "./utils/graph", "./utils/linegraph", "./utils/scattergraph", "./utils/events"
    ],
    function($, d3, helper, data, graph, lineGraph, scatterGraph, eventsGraph) {

        var lineData = {};
        var scatterData = {};

        $(function() {


            params.start_timestamp = 1499019288;
            params.end_timestamp = 1499019289;

            var transform = d3.zoomIdentity;
            var start = 1499019288;


            helper.pL(lineData, channel, helper.fakeDataFormatter(data.fakeLine, start));

            helper.pS(scatterData, channel, helper.fakeDataFormatterScatter(data.fakeLine, start));

            var width = Math.round(parseInt(d3.select("#chart_container").style("width")));
            var height = Math.round(parseInt(d3.select("#chart_container").style("height")));


            var modelChart = graph.chart().width(width).height(height);
            d3.select('#chart_container').call(modelChart);

            // //Axis
            var commonXAxis = d3.scaleTime()
                .domain(d3.extent(lineData[channel].timestamps))
                .range([0, width]);

            var commonXZoomAxis = d3.scaleTime()
                .domain(commonXAxis.domain())
                .range(commonXAxis.range());


            //Chart Area
            // // Main Chart. 70% of real estate
            var svg = d3.select(".chart");

            var lineChart = lineGraph.init()
                .width(width)
                .height(height * 0.70)
                .x(commonXAxis)
                .data(lineData[channel])
                .zoom(d3.zoomIdentity);

            var scatterChart = scatterGraph.init()
                .height(height * 0.70)
                .width(width)
                .x(commonXAxis)
                .data(scatterData[channel])
                .zoom(d3.zoomIdentity);

            // var rect = svg.append("rect")
            //     .attr("class", "checking")
            //     .attr("width", width)
            //     .attr("height", height)
            //     .style("fill", "transparent");

            svg.call(lineChart).call(scatterChart);

            // Events Chart. 30% of real estate

            var eventsChart = eventsGraph.init()
                .yPos($('.axis--y')[0].getBoundingClientRect().height + 20)
                .height(height)
                .width(width)
                .x(commonXAxis)
                .data(lineData[channel].events)
                .zoom(d3.zoomIdentity);


            svg.call(eventsChart);


            var overallZoom = d3.zoom()
                .scaleExtent([1, 10])
                .translateExtent([
                    [0, 0],
                    [width, height]
                ])
                .extent([
                    [0, 0],
                    [width, height]
                ])
                .on("zoom", zoomHandler);


            svg.call(overallZoom);
            // overallZoom.scaleTo(svg, 1);
            // overallZoom.translateBy(svg, -width, -height);



            function zoomHandler() {
                // live("stop");

                transform = d3.event.transform;
                // console.log(transform);
                commonXAxis.domain(transform.rescaleX(commonXZoomAxis).domain());
                lineChart.x(commonXAxis).zoom(transform);
                scatterChart.x(commonXAxis).zoom(transform);
                eventsChart.x(commonXAxis).zoom(transform);

            }

            //Going Live


            var liveData = helper.fakeDataFormatter(data.liveFakeLine,
                lineData[channel].timestamps[lineData[channel].timestamps.length - 1] / 1000,
                "seconds");

            console.log(liveData);

            // // Update Common Axis
            var xAxisLive;
            var scatterLive;
            var lineLive;

            var minTime = 1499019468000;
            var maxTime = 1499020728000;

            function live(state) {


                if (!(xAxisLive || scatterLive || lineLive)) {

                    xAxisLive = setInterval(function() {

                        maxTime = maxTime + 1 * 1000;
                        commonXAxis.domain([minTime, maxTime]);
                        commonXZoomAxis.domain(commonXAxis.domain());
                        commonXAxis.domain(transform.rescaleX(commonXZoomAxis).domain());
                    }, 1000);




                    scatterLive = setInterval(function() {

                        console.log("Scatter UPDATE");

                        // var liveScatter = [];

                        // liveScatter.push({
                        //     time: scatterTime,
                        //     joshua_kimmich: [{
                        //         sentiment_index: -Math.random() * 10,
                        //         text: "Tweet 2",
                        //     }, {
                        //         sentiment_index: +Math.random() * 10,
                        //         text: "Tweet 3"
                        //     }]
                        // });

                        // scatterTime = scatterTime + 1;



                        // helper.pS(scatterData, channel, liveScatter);
                        scatterChart.x(commonXAxis).data(scatterData[channel]);

                        // svg.call(overallZoom);


                    }, 1000);

                    // Update Line Chart Data

                    lineLive = setInterval(function() {

                        console.log("Line + Events");

                        var x = liveData.shift();
                        if (x) {
                            helper.pL(lineData, channel, [x]);
                            lineChart.x(commonXAxis).data(lineData[channel]);
                            eventsChart.x(commonXAxis).data(lineData[channel].events);
                        } else {
                            console.log("STOPPED");
                            liveStop();
                            maxTime = maxTime + 100 * 1000;
                            commonXAxis.domain([minTime, maxTime]);
                            commonXZoomAxis.domain(commonXAxis.domain());
                            eventsChart.x(commonXAxis).data(lineData[channel].events);

                        }

                    }, 1000);

                }


            }

            function liveStop() {

                clearInterval(xAxisLive);
                clearInterval(scatterLive);
                clearInterval(lineLive);

            }


            // live();
            // liveStop();



            // line_chart.data(lineData[channel]);
            // d3.select(window).on('resize', resize);

            // function resize() {
            //     model_chart.width(parseInt(d3.select("#chart").style("width")));
            // }

            // console.log(lineData);

            // $.when(
            //     $.getJSON(helper.url('get-index-data'), params),
            //     $.getJSON(helper.url('get-scatter-data'), params)

            // ).done(function(index, scatter) {

            //     
            //     helper.pS(scatterData, channel, scatter[0]);

            //     var model_chart = graph.chart();

            //     var ui_chart = d3.select('#chart')
            //         .call(model_chart);

            //     // d3.select(window).on('resize', resize);

            //     // function resize() {
            //     //     console.log(parseInt(d3.select("#chart").style("width")));
            //     // }



            // });

        });
    });