
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
			return Answers.find({}, {
				sort: {createdAt: -1},
				limit: 50
				});
		},
		questions: function(){
			return Questions.find({}, {
				sort: {createdAt: -1},
				limit: 50
				});
		},
		comments: function(){
			return Comments.find({}, {
				sort: {createdAt: -1},
				limit: 50
				});
		},
		slogans: function(){
			return Protests.find({}, {
				sort: {createdAt: -1},
				limit: 50
				});
		}
		
	});
	
	windowWidth = 0; 
	windowHeight = 0;
	
	Template.screensaver.onRendered(function(){
		this.$(function(){
			windowWidth = $(document).width(); //retrieve current document width
			windowHeight = $(document).height(); //retrieve current document height
			console.log("Screen size: " + windowWidth + "x" + windowHeight);
		});
		
		
		Meteor.setInterval(function(){
			//var windowWidth, windowHeight;
			/*
			var windowWidth = this.$(document).width(); //retrieve current document width
			var windowHeight = this.$(document).height(); //retrieve current document height
					
			console.log("Screen size: " + windowWidth + "x" + windowHeight);
			*/
			// Randownly display the words
			var words = this.$('.word');
			
			// remove the ones that have been animated
			var sel = this.$('.selected');
			sel.animate({opacity: 0}).removeClass('selected');
			
			// do animation
			var element = $(words[Math.floor(Math.random() * words.length)]);
			
			
			//console.log("Just before resize : Screen size: " + windowWidth + "x" + windowHeight);
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
	
			
	});
	

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
