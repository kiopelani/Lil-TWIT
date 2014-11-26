class Tweet < ActiveRecord::Base
  attr_accessible :content, :avatar_url, :username, :handle
  has_many :tweet_tags
  has_many :hashtags, through: :tweet_tags

  def hashtag_names
    self.hashtags.pluck(:name)
  end

  def self.ordered_json
    order("created_at DESC").limit(50).to_json(methods: :hashtag_names)
  end
end
