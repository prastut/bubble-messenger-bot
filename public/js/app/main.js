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
                    time: 1499019300,
                    joshua_kimmich: [{
                        sentiment_index: 9.8,
                        text: "Hello World",
                    }, {
                        sentiment_index: -5,
                        text: "Hello 2"
                    }]
                },
                {
                    time: 1499019340,
                    joshua_kimmich: [{
                        sentiment_index: 9.8,
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
                    time: 1499019320,
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
                .domain(d3.extent(lineDataSample, function(d) { return d.time * 1000; }))
                .range([0, width]);


            var commonXZoomAxis = d3.scaleTime()
                .domain(commonXAxis.domain())
                .range(commonXAxis.range());

            var svg = d3.select(".chart");

            var lineChart = lineGraph.init()
                .data(lineData[channel])
                .x(commonXAxis)
                .xZoom(commonXZoomAxis);

            var scatterChart = scatterChart.init()
                .data(scatterChart[channel])
                .x(commonXAxis);

            svg.call(lineChart, scatterChart);

            // var scatterChart = scatterGraph.init().data(scatterData[channel]);
            // svg.call(scatterChart);

            var zoom = d3.zoom()
                .scaleExtent([1, 10])
                .translateExtent([
                    [0, 0],
                    [width, height]
                ])
                .extent([
                    [0, 0],
                    [width, height]
                ])
                .on("zoom", zoomed);


            svg.call(zoom);



            function zoomed() {

                var t = d3.event.transform;
                commonXAxis.domain(t.rescaleX(commonXZoomAxis).domain());
                lineChart.x(commonXAxis);
                // console.log(commonXAxis.domain());

            }



            // var minTime = moment(commonXAxis.domain()[0]).format('X');
            // var maxTime = moment(commonXAxis.domain()[1]).format('X');
            var mintime = d3.min(lineData[channel].timestamps);
            var maxTime = d3.max(lineData[channel].timestamps);

            // setInterval(function() {

            //     svg.on(".zoom", null);

            //     var live = [];
            //     live.push({
            //             time: maxTime / 1000,
            //             joshua_kimmich: {
            //                 neg: Math.random() * 10,
            //                 pos: Math.random() * 10
            //             }
            //         }

            //     );

            //     maxTime = maxTime + 5 * 1000;

            //     helper.pL(lineData, channel, live);
            //     commonXAxis.domain([mintime, maxTime]);


            //     // console.log(commonXAxis.domain());
            //     // commonXZoomAxis.domain(commonXAxis.domain());

            //     lineChart.x(commonXAxis).data(lineData[channel]);

            //     svg.call(zoom);


            // }, 5000);

            // helper.pL(lineData, channel, live);

            // 

            // console.log(lineData);

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