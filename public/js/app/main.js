define(["jquery", "d3",
        "./utils/helper", "./utils/data",
        "./utils/graph",
        "./utils/bargraph", "./utils/linegraph", "./utils/scattergraph", "./utils/events", "./utils/players"
    ],
    function($, d3, helper, data, graph, barGraph, lineGraph, scatterGraph, eventsGraph, playersGraph) {

        //https://bubble.social/get-webview?match_id=01aa28ba-77ac-11e7-949c-0669e02bb0da&team_id=01aa28bb-77ac-11e7-949c-0669e02bb0da&name=liverpool_fc

        $(function() {

            var channel = params.name;
            params.user_type = "INFLUENCER";

            //Real Estate Setup
            var width = Math.round(parseInt(d3.select("#chart_container").style("width")));
            var height;
            var transform = d3.zoomIdentity;

            //Data Model
            var lineData = {};
            var scatterData = {};

            //All Charts
            var modelChart;
            var barChart;
            var lineChart;
            var scatterChart;
            var eventsChart;

            //Axis
            var commonXAxis;
            var commonXZoomAxis;

            //Interactions
            var overallZoom;


            if (window.location.pathname == "/get-video-overlay") {
                height = 150;
            } else {
                height = Math.round(parseInt(d3.select("#chart_container").style("height")));
            }

            $.when(
                $.getJSON(helper.url('get-index-data'), params),
                $.getJSON(helper.url('get-scatter-data'), params)

            ).done(function(index, scatter) {
                helper.pL(lineData, channel, index[0]);
                helper.pS(scatterData, channel, scatter[0]);

                modelChart = graph.chart().width(width).height(height);
                d3.select('#chart_container').call(modelChart);

                var svg = d3.select(".chart");
                var topOffset = $('#mainNav')[0].getBoundingClientRect().height;

                //Common X Axis Definitions
                commonXAxis = d3.scaleTime()
                    .domain(d3.extent(lineData[channel].timestamps))
                    .range([0, helper.widthDependingOnPage(width)]);

                commonXZoomAxis = d3.scaleTime()
                    .domain(commonXAxis.domain())
                    .range(commonXAxis.range());

                overallZoom = d3.zoom()
                    .scaleExtent([1, 10])
                    .translateExtent([
                        [0, 0],
                        [helper.widthDependingOnPage(width), height]
                    ])
                    .extent([
                        [0, 0],
                        [helper.widthDependingOnPage(width), height]
                    ])
                    .on("zoom", zoomHandler);

                //Charts Definition Chart

                barChart = barGraph.init()
                    .height(height * 0.10)
                    .width(width)
                    .yPos(0)
                    .data(lineData[channel]);

                lineChart = lineGraph.init()
                    .x(commonXAxis)
                    .height(height * 0.60)
                    .yPos(topOffset)
                    .data(lineData[channel]);

                scatterChart = scatterGraph.init()
                    .height(height * 0.60)
                    .width(helper.widthDependingOnPage(width))
                    .x(commonXAxis)
                    .yPos(topOffset)
                    .data(scatterData[channel])
                    .zoom(d3.zoomIdentity);

                // // Events Chart. 30% of real estate
                // var eventsChart = eventsGraph.init()
                //     .yPos($('.axis--y')[0].getBoundingClientRect().height + 20)
                //     .height(height)
                //     .width(widthDependingOnPage(width))
                //     .x(commonXAxis)
                //     .data(lineData[channel].events)
                //     .zoom(d3.zoomIdentity);

                d3.select(window).on('resize', resize);

                svg
                    .call(barChart)
                    .call(lineChart)
                    .call(scatterChart)
                    .call(overallZoom);
                // svg.call(eventsChart);




            });


            //Base Chart

            //Axis



            function zoomHandler() {

                // live("stop");
                transform = d3.event.transform;
                commonXAxis.domain(transform.rescaleX(commonXZoomAxis).domain());
                updateCharts();
            }

            function updateCharts() {
                lineChart.x(commonXAxis);
                scatterChart.width(helper.widthDependingOnPage(width)).x(commonXAxis).zoom(transform);
                // eventsChart.width(widthDependingOnPage(width)).x(commonXAxis).zoom(transform);

                // if (playersChart) {
                //     playersChart.width(helper.widthDependingOnPage(width)).xPos(commonXAxis.range()[1]);
                // }

            }



            // if (window.location.pathname == "/get-video-overlay") {
            //     d3.select("#chart_container").style("opacity", "0");

            //     d3.select(window)
            //         .on('mousemove', mousemoveIframe)
            //         .on("click", mousemoveIframe);

            //     // console.log(widthDependingOnPage(width));
            //     var playersChart = playersGraph.init()
            //         .xPos(commonXAxis.range()[1])
            //         .height(height)
            //         .width(helper.widthDependingOnPage(width))
            //         .x(commonXAxis)
            //         .zoom(d3.zoomIdentity);

            //     svg.call(playersChart);

            // } else {

            //     svg.call(overallZoom);
            // }

            overallZoom.scaleTo(svg, 1);
            overallZoom.translateBy(svg, -width, -height);


            // //Going Live


            // var liveData = helper.fakeDataFormatter(data.liveFakeLine,
            //     lineData[channel].timestamps[lineData[channel].timestamps.length - 1] / 1000,
            //     "seconds");

            // console.log(liveData);

            // // // Update Common Axis
            // var xAxisLive;
            // var scatterLive;
            // var lineLive;

            // var minTime = 1499019468000;
            // var maxTime = 1499020728000;

            // function live(state) {


            //     if (!(xAxisLive || scatterLive || lineLive)) {

            //         xAxisLive = setInterval(function() {

            //             maxTime = maxTime + 1 * 1000;
            //             commonXAxis.domain([minTime, maxTime]);
            //             commonXZoomAxis.domain(commonXAxis.domain());
            //             commonXAxis.domain(transform.rescaleX(commonXZoomAxis).domain());
            //         }, 1000);




            //         scatterLive = setInterval(function() {

            //             console.log("Scatter UPDATE");

            //             // var liveScatter = [];

            //             // liveScatter.push({
            //             //     time: scatterTime,
            //             //     joshua_kimmich: [{
            //             //         sentiment_index: -Math.random() * 10,
            //             //         text: "Tweet 2",
            //             //     }, {
            //             //         sentiment_index: +Math.random() * 10,
            //             //         text: "Tweet 3"
            //             //     }]
            //             // });

            //             // scatterTime = scatterTime + 1;



            //             // helper.pS(scatterData, channel, liveScatter);
            //             scatterChart.x(commonXAxis).data(scatterData[channel]);

            //             // svg.call(overallZoom);


            //         }, 1000);

            //         // Update Line Chart Data

            //         lineLive = setInterval(function() {

            //             console.log("Line + Events");

            //             var x = liveData.shift();
            //             if (x) {
            //                 helper.pL(lineData, channel, [x]);
            //                 lineChart.x(commonXAxis).data(lineData[channel]);
            //                 eventsChart.x(commonXAxis).data(lineData[channel].events);
            //             } else {
            //                 console.log("STOPPED");
            //                 liveStop();
            //                 maxTime = maxTime + 100 * 1000;
            //                 commonXAxis.domain([minTime, maxTime]);
            //                 commonXZoomAxis.domain(commonXAxis.domain());
            //                 eventsChart.x(commonXAxis).data(lineData[channel].events);

            //             }

            //         }, 1000);

            //     }


            // }

            // function liveStop() {

            //     clearInterval(xAxisLive);
            //     clearInterval(scatterLive);
            //     clearInterval(lineLive);

            // }


            // // live();
            // // liveStop();


            function resize() {

                width = Math.round(parseInt(d3.select("#chart_container").style("width")));
                console.log(width);

                //Container Update
                modelChart.width(width);

                // Axis Update
                commonXAxis.range([0, helper.widthDependingOnPage(width)]);
                commonXZoomAxis.range(commonXAxis.range());

                // Charts Update
                updateCharts();

            }


            var iframetimer;

            function mousemoveIframe() {

                d3.select("body").style("background", "rgba(54, 61, 82, 0.2)");
                d3.select("#chart_container").style("opacity", "1");


                if (iframetimer) clearTimeout(iframetimer);
                iframetimer = setTimeout(function() {
                    d3.select("#chart_container").transition().style("opacity", "0");
                    d3.select("body").style("background", "none");
                }, 2000);

            }


        });
    });
