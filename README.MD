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


    URL: https://trendingapi.bubble.social/get-scatter-data?instance_id=59515087281ce634c625877e&last_timestamp=0&channel=awaiting_vivegam_2nd_track
    
>Sample Response:

	[
	  {
	    "bubble_radius": 3.54585588
        "favorite_count": 0, 
        "retweet_count": 0, 
        "retweeted": false, 
        "sentiment_index": 82.46279619739632, 
        "text": "IM SO HAPPY", 
        "timestamp": 1500696981, 
        "tweet_id": "888696710616231937", 
        "user": {
	  "id": 4568745
          "followers": 18026, 
          "friends": 9912, 
          "screen_name": "satanyoongi", 
          "type": "FAMOUS"
        	}
      	}, 
      {
        "favorite_count": 0, 
        "retweet_count": 0, 
        "retweeted": false, 
        "sentiment_index": 88.47578436317524, 
        "text": "RT @gentle: \ud83d\ude0a\ud83c\udf08:\nYOU DESERVE TO BE HAPPY\nYOU DESERVE TO BE LOVED\nYOU DESERVE TO BE VALUED", 
        "timestamp": 1500696981, 
        "tweet_id": "888696711513866241", 
        "user": {
	  "id": 4568745
          "followers": 18026, 
          "friends": 9912, 
          "screen_name": "satanyoongi", 
          "type": "SUBFAMOUS"
        	}
      }, 
      {
        "favorite_count": 0, 
        "retweet_count": 0, 
        "retweeted": false, 
        "sentiment_index": 16.00701218303068, 
        "text": "RT @gs_magazine: \u3010HAPPY BIRTHDAY\u30117\u670822\u65e5\u306f\u3001\u300e\u30e9\u30d6\u30e9\u30a4\u30d6\uff01\u300f\u77e2\u6fa4\u306b\u3053\u3061\u3083\u3093\u306e\u8a95\u751f\u65e5!! -https://t.co/5nmbwLelBH\n#lovelive https://t.co/OopsoXGRdB", 
        "timestamp": 1500696981, 
        "tweet_id": "888696708917374977", 
        "user": {
	  "id": 4568745
          "followers": 18026, 
          "friends": 9912, 
          "screen_name": "satanyoongi", 
          "type": "INFLUENCER"
        	}
      }
	]

### Get Events:
>	Args:
	
*	match_id 
*	start_timestamp (optional)
*	end_timestamp (optional)
*	start_timestamp (optional, default 0) (pass -1 if last datapoint is required)
*	end_timestamp (optional, default severtime)	


	URL: http://localhost:5000/get-events?match_id=fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f&start_timestamp=1500686048&end_timestamp=1500686150


>	Sample Response:

	[
	  {
	    "comment": "test comment 1500686109", 
	    "id": "9f50d6d6-6ed8-11e7-b7a4-a402b9ccba5f", 
	    "match_id": "fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f", 
	    "name": "test event", 
	    "players": [
	      "p1", 
	      "p2"
	    ], 
	    "time": 1500686109.0
	  }, 
	  {
	    "comment": "test comment 1500686139", 
	    "id": "a7330b62-6ed8-11e7-b7a4-a402b9ccba5f", 
	    "match_id": "fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f", 
	    "name": "test event", 
	    "players": [
	      "p1", 
	      "p2"
	    ], 
	    "time": 1500686139.0
	  }, 
	  {
	    "comment": "test comment 1500686109", 
	    "id": "df5bc29a-6ed8-11e7-b7a4-a402b9ccba5f", 
	    "match_id": "fb38f3f4-6ed6-11e7-b7a4-a402b9ccba5f", 
	    "name": "test event", 
	    "players": [
	      "p1", 
	      "p2"
	    ], 
	    "time": 1500686109.0
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

