
/*********************************************************************\
 *  SCREENSAVER														 *
\*********************************************************************/

Router.route('/screensaver', function(){
	this.subscribe('answers', {$exists: true});
	this.subscribe('questions', {$nin: ['admin']});
	this.subscribe('comments', {});
	this.subscribe('protests', {});
	this.render('screensaver');
	}, {
	name : 'screensaver'
});

if (Meteor.isClient) {	
	Template.screensaver.helpers({
		answers: function(){
			return Answers.find({});
		},
		questions: function(){
			return Questions.find({});
		},
		comments: function(){
			return Comments.find({});
		},
		slogans: function(){
			return Protests.find({});
		}
		
	});
	
	//var windowWidth, windowHeight;
	
	$(function(){
		windowWidth = $(document).width(); //retrieve current document width
		windowHeight = $(document).height(); //retrieve current document height
		console.log("Screen size: " + windowWidth + "x" + windowHeight);
	});	
	
	Meteor.setInterval(function(){
		// Randownly display the words
		var words = this.$('.word');
		
		
		// remove the ones that have been animated
		var sel = this.$('.selected');
		sel.animate({opacity: 0}).removeClass('selected');
		
		// do animation
		var element = $(words[Math.floor(Math.random() * words.length)]);
		
		
		while(element.height() > windowHeight){
			element.css('fontSize', Math.floor(element.css('fontSize').slice(0,-2)*.9) + 'px');
			//console.log(element.css('fontSize'));
		}
		
		var elWidth = element.width();
		var elHeight = element.height();
		
		var targetX = Math.random()*(windowWidth - elWidth);
		var targetY =  Math.random()*(windowHeight - elHeight);
		
		var originX = 0;
		var originY = 0;
		
		
		if ( sel.css('left') ) {
			var originX = Math.floor(sel.css('left').slice(0,-2));
			var originY = Math.floor(sel.css('top').slice(0,-2));
			
			if ( (windowWidth - originX) < elWidth ) originX = windowWidth - elWidth;
			if ( (windowHeight - originY) < elHeight ) originY = windowHeight - elHeight; 
		}
		
		//console.log('origin: ' + originX + 'x' + originY);
		
		element.css({ top: originY + 'px', left: originX + 'px' })
			   .animate({opacity: 1, left: targetX, top: targetY})
			   .addClass('selected');
	}, 5000);
	
	Template.word.onRendered(function(){
			
			var element = this.$('.word');
			
			var elWidth = element.width();
			var elHeight = element.height();
			
			
			/*
			var x = .5*(windowWidth - elWidth);
			var y =  windowHeight - elHeight;
			 
			element.css({opacity: 0, left: x, top: -elHeight});
			*/
			element.css({opacity: 0});
			/*
			console.log(this.firstNode.children);
			$(this.firstNode.children).addClass('test');
			*/
	});
}

if (Meteor.isServer) {

}
