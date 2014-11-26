$(document).ready(function() {

  var Tweet = function(obj) {
    this.handle = obj["handle"];
    this.content = obj["content"];
    this.avatar_url = obj["avatar_url"];
    this.created_at = obj["created_at"];
    this.hashtag_names = obj["hashtag_names"];
  }

  function create_tweets(data) {
    tweets = [];
    for(var i = 0; i < data.length; i++) {
      tweets.push(new Tweet(data[i]))
    }
    return tweets;
  }

  function build_tweet_html(tweets) {
    for(var i = 0; i < tweets.length; i++) {
      for(var j = 0; j < tweets[i].hashtag_names.length; j++) {
        tweets[i].hashtag_names[j] = "#" + tweets[i].hashtag_names[j];
      }
      hashtag_names = tweets[i].hashtag_names.toString().replace(/,/g , " ");
      $('#tweets-container ul').append('<li class="tweet"><img class="avatar" src="'+tweets[i].avatar_url+'" alt=""><div class="tweet-content"><p><span class="username">'+tweets[i].handle+'</span><span class="timestamp">'+tweets[i].created_at+'</span></p><p>'+tweets[i].content + hashtag_names +'</p></div></li>');
    }
  }

  // RECENT TWEETS

  $.ajax({
   url: '/tweets/recent',
   type: 'get',
 })
  .done(function(server_data) {
    tweets = create_tweets(server_data);
    build_tweet_html(tweets);
  })
  .fail(function() {
   console.log("failed to get data");
 })

  // CREATE NEW TWEET Soon To Be

  $( "#tweet-form" ).submit(function(event) {
    event.preventDefault();
    $.ajax({
      url: '/tweets',
      type: 'post',
    })
    .done(function(server_data) {
      console.log("got some data back");
      for(var i = 0; i < server_data.hashtag_names.length; i++){
        server_data.hashtag_names[i] = "#" + server_data.hashtag_names[i]
      }
      hashtag_names = server_data.hashtag_names.toString().replace(/,/g , " ");
      $('#tweets-container ul').prepend('<li class="tweet" style="display: none"><img class="avatar" src="'+server_data.avatar_url+
        '" alt=""><div class="tweet-content"><p><span class="username">'+server_data.handle+'</span><span class="timestamp">'+server_data.created_at+'</span></p><p>'+
        server_data.content + hashtag_names +'</p></div></li>');
      var tweetsList = $('.tweet');
      $(tweetsList[0]).slideDown(2000);

    })
    .fail(function() {
     console.log("failed to get data");
   })

  });

    // TRENDS LIST AJAX POPULATE

    $.ajax({
    url:"hashtags/popular",
    type: 'get',
    })

    .done(function(server_data){
      for (i = 0; i < server_data.length; i ++){
        $('#trends-list').append("<li>#" + server_data[i] + "</li>")
      }
    })

    .fail(function(){
      console.log("Nope Try Again")
    // setTimeout(trends, 10000);
  })

    // SEARCH FORM AJAX

  $('#search-form').on('submit', function(event) {
    event.preventDefault();
    var input = $(this).find('#search').val();

    $.ajax({
      url:'tweets/search/'+ input,
      type:'get',
    })

    .done(function(server_data){
      $('#tweets-list').empty();
      build_tweet_html(server_data);
    })

    .fail(function(){
      console.log("Nope Try Again")
      $('#search-form').find('#search').css('background-color', 'red')
    })
  });

  // TRENDS LIST AJAX SEARCH

  $('#trends-list').on('click', function(event) {
    event.preventDefault();
    var tagText = event.target.textContent.slice(1)

   $.ajax({
      url:'tweets/search/'+ tagText,
      type:'get',
    })

    .done(function(server_data){
      $('#tweets-list').empty();
      build_tweet_html(server_data);
    })

    .fail(function(){
      console.log("Nope Try Again")
    })
  });

})
