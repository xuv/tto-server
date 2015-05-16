
/*********************************************************************\
 *  COMMENTS														 *
\*********************************************************************/

Agnese = new Meteor.Collection('agnese');
Comments = new Meteor.Collection('comments');

Router.route('/finger/:fingerId/comments', function(){
	
	var getRandomImageId = function() {
		var imagesArray = Agnese.find({}).fetch();			
		//console.log(imagesArray);
		var rand = Math.floor(Math.random()* imagesArray.length);
		return imagesArray[rand];
	}
	
	//if( this.ready() ){
		var img = getRandomImageId();
		console.log("Should go to " + img._id);
		this.redirect('/finger/' + this.params.fingerId + '/comments/' + img._id );
	//}
});


Router.route('/finger/:fingerId/comments/:agneseId', function(){
		//this.subscribe('agnese', {_id: this.params.agneseId});
		this.subscribe('comments', {});
		this.render('comments', {
			data: function(){
				return Agnese.find({_id: this.params.agneseId});
			}
		});
});


if (Meteor.isClient) {
	Template.comments.helpers({
		posts: function() {
			var OracleController = Iron.controller();
			var agneseId = OracleController.params.agneseId;
			console.log("AgneseId: " + agneseId);
			
			return Agnese.find({_id: agneseId});
		},
		fingerId: function(){
			var OracleController = Iron.controller();
			return OracleController.params.fingerId;
		},
		title: function(){
			var titles = [
				'Can you describe what you feel while looking at this image?',
				'Which personal situation comes back when looking at this image?',
				'Where would you put this image in your flat?',
				'What does this picture remind you of?',
				'What is wrong?',
				'Comment tis image?',
				'What do you see in this image?',
				'What is missing?',
				'Where has this image been taken?',
				'What would you add?'
			];
			return titles[Math.floor(Math.random() * titles.length)];
		}
	});
	
	Template.post.helpers({
		postedComments: function( id ){
			console.log("id : " + id);
			return Comments.find({ agneseId: id });
		}
	});
	
	Template.comments.events({
		'click #clickme': function () {
			var OracleController = Iron.controller();
			var fingerId = OracleController.params.fingerId;
			
			Router.go('/finger/' + fingerId + '/comments');
		}
	});
	
	Template.post.events({
		"submit form": function( event ){
			var OracleController = Iron.controller();
			var fingerId = OracleController.params.fingerId;
			
			var text = event.target.comment.value;
			var agneseId = event.target.agneseId.value;
			
			console.log("comment: " + text + " " + agneseId )
			if( text.trim() != "" ){
				Meteor.call("postComment", text, agneseId, fingerId);
			}
			event.target.text.value = ""; // clear the form
			return false; // prevent default form submit
		}
	});
	
	Template.postedComment.helpers({
		isOwner: function( owner ){
			var OracleController = Iron.controller();
			var fingerId = OracleController.params.fingerId;
			if (fingerId === owner ) {
				return true;
			}
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
	
	Meteor.publish("agnese", function( object ){
		return Agnese.find(object);
	});
	
	Meteor.publish("comments", function ( object ) {
		return Comments.find( object );
	});
	
	Meteor.methods({
		postComment: function(text, postId, owner){
			Comments.insert({
				text: text,
				agneseId: postId,
				owner: owner,
				createdAt: new Date()
			});
		}
	});
}


