
/*********************************************************************\
 *  SCREENSAVER														 *
\*********************************************************************/

Router.route('/slideshow', function(){
	this.subscribe('agnese');
	this.render('slideshow');
	}, {
	name : 'slideshow'
});

if (Meteor.isClient) {
	Template.slideshow.helpers({
		slides: function(){
			return Agnese.find({});
		},
		/*
		questions: function(){
			return Questions.find({});
		},
		comments: function(){
			return Comments.find({});
		}
		*/
	});
		
	
	Meteor.setInterval(function(){
		
		// Randownly display the words
		var slides = this.$('.slide');
		
		
		// remove the ones that have been animated
		var sel = this.$('.displayed');
		sel.animate({opacity: 0}).removeClass('displayed');
		
		// do animation
		var element = $(slides[Math.floor(Math.random() * slides.length)]);
		
		
		if(element.height() > element.width()){
			element.css({height: "100%"});
		} else {		
			if(element.width() >= element.height()){
				element.css({width: "100%"});
			} 
		}
		
		var elWidth = element.width();
		var elHeight = element.height();
		
		var targetX = .5*(windowWidth - elWidth);
		var targetY =  .5*(windowHeight - elHeight);
		
		element.css({left: targetX, top: targetY});
		
		element.animate({opacity: 1}).addClass('displayed');
		
	}, 5000);
	
	Template.slide.onRendered(function(){
			
			var element = this.$('.slide');
			/*
			var elWidth = element.width();
			var elHeight = element.height();
			
			console.log("img: " + elWidth + "x" + elHeight);
			
			var marginX = (windowWidth - elWidth)*.5;
			var marginY = (windowHeight - elHeight)*.5;
			
			/*
			if ( diffX < diffY ){
				element.css('height', windowHeight + 'px');
			} else {
				element.css('width', widowWidth + 'px');
			}
			*/
			
			
			
		
			element.css({opacity: 0});
		
	});
}

