class TweetsController < ApplicationController
  def recent
    Tweet.ordered_json
    tweets = Tweet.ordered_json
    render json: tweets
  end

  def search
    hashtag = Hashtag.where(name: params[:keyword]).first
    puts hashtag
    if hashtag
      render json: hashtag.tweets.ordered_json
    else
      render :nothing => true, status: 404
    end
  end

  def create
    # tweet = Tweet.new(params[:tweet])

    # tweet.content ||= Faker::Lorem.sentence
    # tweet.username ||= Faker::Name.name
    # tweet.handle ||= "@" + Faker::Internet.user_name
    # tweet.avatar_url ||= Faker::Avatar.image(tweet.username)
    # tweet.save

    # hashtags_names = params[:hashtags] || ["yolo"]

    # hashtags_names.each do |name|
    #   hashtag = Hashtag.where(name: name).first
    #   hashtag = Hashtag.create(name: name) if hashtag.nil?
    #   tweettag = TweetTag.where(hashtag_id: hashtag.id, tweet_id: tweet.id).first

    #   if tweettag.nil?
    #     tweettag = TweetTag.new
    #     tweettag.hashtag = hashtag
    #     tweettag.tweet = tweet
    #     tweettag.save!
    #   end
    tweet = Tweet.new(params[:tweet])
    tweet.content ||= Faker::Lorem.sentence
    tweet.username ||= Faker::Name.name
    tweet.handle ||= "@" + Faker::Internet.user_name
    tweet.avatar_url ||= Faker::Avatar.image(tweet.username)
    tweet.save

    hashtags_names = params[:hashtags] || []
    hashtags_names.each do |name|
      tweet.hashtags << Hashtag.first_or_create(name: name)
    end

    render json: tweet.to_json(methods: :hashtag_names)
  end

end
