# Bubble api
    Base URL: https://api.bubble.social
> Args
* None
> Sample Response:

	Internal Api for Bubble.social


### Get Live Matches:
	URL: https://api.bubble.social/get-live-matches
	
>	Args: 
* None

>Sample Response:

	[
	  {
	    "end_time": 1500560929, 
	    "id": "d88fee2c-6d85-11e7-b701-a402b9ccba5f", 
	    "name": "livetest1", 
	    "pretty_name": "LiveTest1", 
	    "scorea": {}, 
	    "scoreb": {}, 
	    "start_time": 1500560929, 
	    "status": "Not Started", 
	    "teama": "d88fee2d-6d85-11e7-b701-a402b9ccba5f", 
	    "teamb": "d88fee2e-6d85-11e7-b701-a402b9ccba5f", 
	    "type": "football", 
	    "valid": true
	  }
	]

### Get Teams:
	URL: https://api.bubble.social/get-teams?match_id=d88fee2c-6d85-11e7-b701-a402b9ccba5f

>Args: 
*	match_id

>Sample Response:

	[
	  {
	    "id": "d88fee2d-6d85-11e7-b701-a402b9ccba5f", 
	    "image_url": "happy.com", 
	    "keywords": [
	      "happy"
	    ], 
	    "leagues": "NA", 
	    "name": "happy", 
	    "pretty_name": "happy", 
	    "type": "football"
	  }, 
	  {
	    "id": "d88fee2e-6d85-11e7-b701-a402b9ccba5f", 
	    "image_url": "sad.com", 
	    "keywords": [
	      "sad"
	    ], 
	    "leagues": "NA", 
	    "name": "sad", 
	    "pretty_name": "sad", 
	    "type": "football"
	  }
	]

### Get Players:

	URL: https://api.bubble.social/get-players?match_id=d88fee2c-6d85-11e7-b701-a402b9ccba5f

> Args: 
*	match_id

>Sample Response:

	[
	  {
	    "channel": "wow", 
	    "id": "d88fee2f-6d85-11e7-b701-a402b9ccba5f", 
	    "img_url": "www.cricapi.comwow.com", 
	    "keywords": [
	      "wow"
	    ], 
	    "name": "wow", 
	    "pretty_name": "wow", 
	    "team": "d88fee2d-6d85-11e7-b701-a402b9ccba5f", 
	    "type": "player"
	  }, 
	  {
	    "channel": "meh", 
	    "id": "d88fee30-6d85-11e7-b701-a402b9ccba5f", 
	    "img_url": "meh.com", 
	    "keywords": [
	      "meh"
	    ], 
	    "name": "meh", 
	    "pretty_name": "meh", 
	    "team": "d88fee2e-6d85-11e7-b701-a402b9ccba5f", 
	    "type": "player"
	  }
	]

### Get Index Data:

>Args:
*	match_id
*	team_id (not required if player_id provided)
*	player_id (not required if team_id provided)
*	start_timestamp (optional, default 0) (pass -1 if last datapoint is required)
*	end_timestamp (optional, default severtime)	



	URL: http://localhost:5000/get-index-data?match_id=d88fee2c-6d85-11e7-b701-a402b9ccba5f&team_id=d88fee2d-6d85-11e7-b701-a402b9ccba5f&start_timestamp=0
	
>Sample Response:

	[
	  {
	    "happy": {
	      "neg": 0.09611716753663986, 
	      "neg_count": 8, 
	      "pos": 7.488754880153683, 
	      "pos_count": 170
	    }, 
	    "time": 1500528244
	  }, 
	  {
	    "happy": {
	      "neg": 0.1794776796951967, 
	      "neg_count": 5, 
	      "pos": 15.399192996740323, 
	      "pos_count": 83
	    }, 
	    "time": 1500528274
	  }
	]

### Get Scatter Data:

>Args:
*	match_id
*	team_id (not required if player_id provided)
*	player_id (not required if team_id provided)
*	start_timestamp (optional, default 0) (pass -1 if last datapoint is required)
*	end_timestamp (optional, default severtime)	
*	user_type (optional, (INFLUENCER/FAMOUS/SUBFAMOUS))

>INFO: `user_type` ignored if start_timestamp=-1


    URL: http://localhost:5000/get-scatter-data?match_id=fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f&player_id=743c79af-6ed6-11e7-b7a4-a402b9ccba5f&user_type=INFLUENCER
    
>Sample Response:

	[
      {
        "time": 1500686404, 
        "wow": [
          {
            "favorite_count": 0, 
            "retweet_count": 0, 
            "retweeted": false, 
            "sentiment_index": 61.95058222123639, 
            "text": "5 P's to A \"Wow!\" Business https://t.co/jufEF7aqk3 #success https://t.co/9F2c3kc4kI", 
            "timestamp": 1500706204, 
            "tweet_id": "888735393373237248", 
            "user": {
              "followers": 93184, 
              "friends": 13964, 
              "screen_name": "pasquinilli", 
              "type": "INFLUENCER"
            }
          }
        ]
      }, 
      {
        "time": 1500686518, 
        "wow": [
          {
            "favorite_count": 0, 
            "retweet_count": 0, 
            "retweeted": false, 
            "sentiment_index": 95.69227728913987, 
            "text": "@ndirish97 Hello, Val. Wow! Great to hear this feedback! We thank you and your family for choosing us!  *ARD", 
            "timestamp": 1500706318, 
            "tweet_id": "888735871838638083", 
            "user": {
              "followers": 1362322, 
              "friends": 32677, 
              "screen_name": "Delta", 
              "type": "INFLUENCER"
            }
          }
        ]
      }
    ]

### Get Trending, Heros and Zeros
>Args:
*   match_id 
		

	URL: http://localhost:5000/get-trendings?match_id=fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f

>	Info: 
*   Heros & Zeros max Players: 2 each
*   Total Heros+Zeros: 4. 
*   Trending: 5 Max
	** ** Can be Zero for Heros/Zeros** ** 



>	Sample Response:

	{
	  "heros": [
	    {
	      "id": "743c79af-6ed6-11e7-b7a4-a402b9ccba5f", 
	      "name": "wow", 
	      "neg": 1.2036494028160072, 
	      "pos": 25.56726034032042, 
	      "tweets_count": 820
	    }, 
	    {
	      "id": "743c79b0-6ed6-11e7-b7a4-a402b9ccba5f", 
	      "name": "meh", 
	      "neg": 1.9906187241337645, 
	      "pos": 4.263714777895914, 
	      "tweets_count": 45
	    }
	  ], 
	  "trending": [
	    {
	      "id": "743c79af-6ed6-11e7-b7a4-a402b9ccba5f", 
	      "name": "wow", 
	      "neg": 1.2036494028160072, 
	      "pos": 25.56726034032042, 
	      "tweets_count": 820
	    }, 
	    {
	      "id": "743c79b0-6ed6-11e7-b7a4-a402b9ccba5f", 
	      "name": "meh", 
	      "neg": 1.9906187241337645, 
	      "pos": 4.263714777895914, 
	      "tweets_count": 45
	    }
	  ], 
	  "zeros": []
	}

### Get Team details
>Args:

* team_id

	URL: https://api.bubble.social/get-team-details?team_id=fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f
> Sample Response

    {
        "country": "NA", 
        "id": "743c79af-6ed6-11e7-b7a4-a402b9ccba5f", 
        "image_url": "wow", 
        "index_table": "wow_realtime_index", 
        "keywords": [
        "wow"
        ], 
        "name": "wow", 
        "pretty_name": "wow", 
        "scatter_table": "wow_scatter", 
        "team": "743c79ad-6ed6-11e7-b7a4-a402b9ccba5f"
    }

### Get Player details
>Args:

* player_id

	URL: https://api.bubble.social/get-player-details?player_id=fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f
> Sample Response

    {
        "country": "NA", 
        "id": "743c79af-6ed6-11e7-b7a4-a402b9ccba5f", 
        "image_url": "wow", 
        "index_table": "wow_realtime_index", 
        "keywords": [
        "wow"
        ], 
        "name": "wow", 
        "pretty_name": "wow", 
        "scatter_table": "wow_scatter", 
        "team": "743c79ad-6ed6-11e7-b7a4-a402b9ccba5f"
    }

### Get Events
>Args

*	match_id
*	start_timestamp (optional)
*	end_timestamp (optional)

	URL: https://api.bubble.social/get-events

> Sample Response

	[
	  {
	    "comment": "This is the irst event for testing events pipelin", 
	    "id": "f900867e-73ae-11e7-ba85-0669e02bb0da", 
	    "match_id": "6bd5c316-7144-11e7-ba85-0669e02bb0da", 
	    "name": "Test Event One", 
	    "players": [
	      "6bd5c319-7144-11e7-ba85-0669e02bb0da", 
	      "6bd5c31a-7144-11e7-ba85-0669e02bb0da"
	    ], 
	    "time": 0.0
	  }
	]




















































