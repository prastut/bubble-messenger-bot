define(["jquery", "d3",
        "./utils/helper",
        "./utils/graph", "./utils/linegraph", "./utils/scattergraph"
    ],
    function($, d3, helper, graph, lineGraph, scatterGraph) {

        var lineData = {};
        var scatterData = {};

        $(function() {


            params.start_timestamp = 1499019288;
            params.end_timestamp = 1499019289;

            var transform;

            var scatterDataSample = [

                {
                    time: 1499019290,
                    joshua_kimmich: [{
                        sentiment_index: 2.3,
                        text: "Hello World",
                    }, {
                        sentiment_index: 4.5,
                        text: "Hello 2"
                    }]
                },
                {
                    time: 1499019291,
                    joshua_kimmich: [{
                        sentiment_index: 9.8,
                        text: "Hello World",
                    }, {
                        sentiment_index: -5,
                        text: "Hello 2"
                    }]
                },
                {
                    time: 14990193292,
                    joshua_kimmich: [{
                        sentiment_index: 5,
                        text: "Hello World",
                    }, {
                        sentiment_index: 1,
                        text: "Hello 2"
                    }]
                }
            ];

            var lineDataSample = [

                {
                    time: 1499019288,
                    joshua_kimmich: {
                        neg: 1.2,
                        pos: 5
                    }
                }, {
                    time: 1499019300,
                    joshua_kimmich: {
                        neg: 4,
                        pos: 10.2
                    }
                }, {
                    time: 1499019340,
                    joshua_kimmich: {
                        neg: 2,
                        pos: 2
                    }
                }
            ];

            helper.pL(lineData, channel, lineDataSample);
            helper.pS(scatterData, channel, scatterDataSample);

            // console.log(scatterData);
            var width = parseInt(d3.select("#chart_container").style("width"));
            var height = parseInt(d3.select("#chart_container").style("height"));

            var modelChart = graph.chart().width(width).height(height);
            d3.select('#chart_container').call(modelChart);


            var commonXAxis = d3.scaleTime()
                .domain([1499019288 * 1000, 1499019340 * 1000])
                .range([0, width]);


            var commonXZoomAxis = d3.scaleTime()
                .domain(commonXAxis.domain())
                .range(commonXAxis.range());

            var svg = d3.select(".chart");

            var lineChart = lineGraph.init()
                .data(lineData[channel])
                .x(commonXAxis)
                .zoom(d3.zoomIdentity);


            var scatterChart = scatterGraph.init()
                .data(scatterData[channel])
                .x(commonXAxis)
                .zoom(d3.zoomIdentity);


            svg.call(lineChart);
            svg.call(scatterChart);
            // var scatterChart = scatterGraph.init().data(scatterData[channel]);
            // svg.call(scatterChart);

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


            // svg.append("rect")
            //     .attr("width", width)
            //     .attr("height", height)
            //     .style("fill", "none")
            //     .style("pointer-events", "all")
            //     .call(zoom);

            // svg.call(overallZoom);



            function zoomHandler() {

                transform = d3.event.transform;
                commonXAxis.domain(transform.rescaleX(commonXZoomAxis).domain());
                lineChart.x(commonXAxis).zoom(transform);
                scatterChart.x(commonXAxis).zoom(transform);

            }



            // var minTime = moment(commonXAxis.domain()[0]).format('X');
            // var maxTime = moment(commonXAxis.domain()[1]).format('X');
            var mintime = 1499019288 * 1000;
            var maxTime = 1499019340 * 1000;



            var time = 1499019340;

            // Update Common Axis
            setTimeout(function() {

                maxTime = maxTime + 1 * 1000;
                commonXAxis.domain([mintime, maxTime]);
                commonXZoomAxis.domain(commonXAxis.domain());

            }, 1000);

            setTimeout(function() {

                console.log("Scatter UPDATE");

                var liveScatter = [];

                liveScatter.push({
                    time: 1499019293,
                    joshua_kimmich: [{
                        sentiment_index: -Math.random() * 10,
                        text: "Tweet 2",
                    }, {
                        sentiment_index: -Math.random() * 10,
                        text: "Tweet 3"
                    }, {
                        sentiment_index: -Math.random() * 10,
                        text: "Tweet 4"
                    }]
                });



                helper.pS(scatterData, channel, liveScatter);
                scatterChart.x(commonXAxis).data(scatterData[channel]);

                // svg.call(overallZoom);


            }, 1000);

            // Update Line Chart Data

            // setInterval(function() {

            //     time = time + 5;
            //     console.log("Line UPDATE");
            //     var liveLine = [];
            //     live.push({
            //             time: time,
            //             joshua_kimmich: {
            //                 neg: Math.random() * 10,
            //                 pos: Math.random() * 10
            //             }
            //         }

            //     );


            //     helper.pL(lineData, channel, liveLine);
            //     lineChart.x(commonXAxis).data(lineData[channel]);
            //     // svg.call(overallZoom);


            // }, 5000);


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