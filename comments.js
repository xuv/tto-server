
/*********************************************************************\
 *  COMMENTS														 *
\*********************************************************************/

var Agnese = new Meteor.Collection('agnese');
var Comments = new Meteor.Collection('comments');

Router.route('/finger/:fingerId/comments', function(){
	this.subscribe('agnese', {});
	this.subscribe('comments');
	this.render('comments');
	//Router.go('/finger/' + this.params.fingerId + '/comments/1');
});


/*
Router.route('/finger/:fingerId/comments/:agneseId', function(){
	this.subscribe('agnese', { agneseId:  this.params.agneseId });
	this.subscribe('comments');
	this.render('comments');
});
*/

if (Meteor.isClient) {
	Template.comments.helpers({
		posts: function() {
			return Agnese.find({});
		}
	});
	
	Template.post.helpers({
		postedComments: function( id ){
			console.log("id : " + id);
			return Comments.find({ agneseId: id });
		}
	});
	
	Template.post.events({
		"submit form": function( event ){
			var OracleController = Iron.controller();
			var fingerId = OracleController.params.fingerId;
			
			var text = event.target.comment.value;
			var agneseId = event.target.agneseId.value;
			console.log("comment: " + text + " " + agneseId )
			
			Meteor.call("postComment", text, agneseId, fingerId);
			
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
	
	Meteor.publish("comments", function () {
		return Comments.find({});
	});
}

Meteor.methods({
	postComment: function(text, postId, owner){
			Comments.insert({
				text: text,
				agneseId: postId,
				owner: owner
			});
		}
});
