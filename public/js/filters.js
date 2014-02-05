app.filter('removehashtag', function() {
        return function(hashtag) {
        	var newHashtag = hashtag.replace(/^#/, '');
            return newHashtag;
        };
    });