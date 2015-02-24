/*
TO FIX
X if a titles ends with a word of 4 letters or less that is not a number, discard it
X if a title has a perfect match in the titles array, discard it
- if there's a ":" and a "-", discard
- if there are two "-", discard
X if there's a "(" there should also be a ")"
- if there's a "”" there should also be a "”"
*/

var app = require('http').createServer();
require('./titles.js');
var Twit = require('twit');

app.listen(process.env.PORT || 5000);

var T = new Twit({
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
})


var terminals = {};
var startwords = [];
var wordstats = {};

for (var i = 0; i < titles.length; i++) {
    var words = titles[i].split(' ');
    terminals[words[words.length - 1]] = true;
    startwords.push(words[0]);
    for (var j = 0; j < words.length - 1; j++) {
        if (wordstats.hasOwnProperty(words[j])) {
            wordstats[words[j]].push(words[j + 1]);
        } else {
            wordstats[words[j]] = [words[j + 1]];
        }
    }
}

var choice = function (a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
};

var make_title = function (min_length) {
    word = choice(startwords);
    var title = [word];
    while (wordstats.hasOwnProperty(word)) {
        var next_words = wordstats[word];
        word = choice(next_words);
        title.push(word);
        if (title.length > min_length && terminals.hasOwnProperty(word)) break;
    }
    if (title.length < min_length) return make_title(min_length);
    return title.join(' ');
};

var title;

function generate() {
	
	title = make_title(3 + Math.floor(3 * Math.random()));
	
	function lastWordTest(title) {
	    var n = title.split(" ");
	    return n[n.length - 1];
	};
	
	function titleChecker(title) {
		for (i = 0; i < titles.length; i++) {
			if (title === titles[i]) {console.log("duplicato "+titles[i]);return true} else {return false}
		}
	}
	
	function parenthesisChecker(title) { 
		if (title.search(/\(/) >= 0 && title.search(/\)/) === -1) {
			return true;
		}
	}
	
	if (lastWordTest(title).length <= 4 || titleChecker(title) === true || title.length >= 118) {
		generate();
	} else {
		if (parenthesisChecker(title) === true) {
			title = title+")";
			return title;
		} else {return title;}
		}
}

function refreshData() {
	
	x = 3600;  // x = seconds, 3600 = once every hour
	
	//generate a new title
	generate(); 
	//and post it on twitter
		T.post('statuses/update', { status: "Da stasera al cinema: "+title }, function(err, data, response) {
		  //console.log(data)
		})
	
	setTimeout(refreshData, x*1000);
}
refreshData();