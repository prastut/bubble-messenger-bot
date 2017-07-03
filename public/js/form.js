var $ = jQuery;

var data = {
    "name": "",
    "pretty_name": "",
    "start": "",
    "index": {},
    "channels": {},
    "event_type": "cricket-match",
    "events": { "balls": [] },

};




$('.form-details').hide();

$('#event-btn').click(function(event) {

    event.preventDefault();

    $('#event').hide();
    var nameOfTour = $('#nameOfTour').val();
    var nameOfMatch = $("#nameOfMatch").val();
    var start = $("#start").val();
    data.name = nameOfTour;
    data.pretty_name = nameOfMatch;
    data.start = start;

    $("#preview").val(prettyPrint(data));
    $('#event-btn').hide();
    $('.form-details').show();
});





if ($('#type').val() == "team") {

    $('#team-container').hide();
}


$('#type').on('change', function() {

    if (this.value == "team") {
        $('#team-container').hide();

    } else {
        $('#team-container').show();
    }
});

$('#submit').click(function(event) {
    var type = $('#type').val(),
        name = $('#name').val().trim(),
        key = name.toLowerCase().split(' ').join('_'),
        keywords = $('#keywords').val().split(",").map(function(keyword) { return keyword.replace(/\s+/g, ''); }),
        url = $('#url').val();


    if ($('#type').val() == "team") {
        data.channels[key] = getObject(name, type, url, keywords, null);
    } else {


        team = $('#team').val().toLowerCase().replace(" ", "_");
        data.channels[key] = getObject(name, type, url, keywords, team);

    }

    var channels = Object.keys(data.channels);
    var teams = [];

    if (channels.length == 2) {

        $("#team")
            .append('<option value=' + channels[0] + '>' + channels[0] + '</option>')
            .append('<option value=' + channels[1] + '>' + channels[1] + '</option>');

        $('#team-container').show();
        $('#type').val('player');

    }


    $("#details-submit").html(name + " details stored");

    $.each($('.data'), function(index, element) {
        $(element).val('');
    });

    $('#nameOfEvent').hide();

    $("#preview").val(prettyPrint(data));

});


$('#add-to-db').click(function(event) {

    event.preventDefault();

    var postObj = JSON.parse($("#preview").val());

    $.ajax(customSettings(urlGenerator('add-match-details'), postObj))
        .done(function() {
            console.log("POSTED");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {

            console.log("ERROR");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
});

function getObject(name, type, url, keywords, team) {

    team = team || null;

    return {
        "name": name,
        "team": team,
        "type": type,
        "img_url": url,
        "keywords": keywords
    };

}


function prettyPrint(object) {

    var pretty = JSON.stringify(object, undefined, 4);
    return pretty;
}


function customSettings(url, object) {

    object.time = Math.round(Date.now() / 1000);

    console.log("Time Posted " + object.time);

    return {
        "async": true,
        "crossDomain": true,
        "url": url,
        "type": "POST",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
        },
        "processData": false,
        "data": JSON.stringify(object)
    };
}

function urlGenerator(url) {
    return "https://api.bubble.social/" + url;
}