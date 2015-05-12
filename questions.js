
/*********************************************************************\
 *  QUESTIONS														 *
\*********************************************************************/

Questions = new Mongo.Collection("questions");

Router.route('/questions', function () {
  this.render('addQuestions');
});


if (Meteor.isClient) {
	if ( Meteor.userId() != null ) {
		Meteor.subscribe("questions-admin");
	} else {
		Meteor.subscribe("questions");
	}	
		
	Template.addQuestions.helpers({
		questions: function() {
			if (Session.get("hideUnused")) {
				return Questions.find({hidden: {$ne: true}}, {sort: {createdAt: -1}});
			} else {
				return Questions.find({}, {sort: {createdAt: -1}});
			}
		}
	});
	
	Template.addQuestions.events({
		"submit .new-question": function(event){
			var text = event.target.text.value;	
			Meteor.call("addQuestion", text);
			
			event.target.text.value = ""; // clear the form
			
			return false; // prevent default form submit
		},
		
		"change .hide-unused input": function( event ) {
			Session.set("hideUnused", event.target.checked);
		}
	});
	
	Template.question.events({
		"click .hide": function () {
			Meteor.call("hideQuestion", this._id, ! this.hidden);
		}
	});

}

if (Meteor.isServer){
	Meteor.publish("questions", function () {
		return Questions.find({
			hidden: {$ne: true}
		});
	});
	
	Meteor.publish("questions-admin", function () {
		return Questions.find({});
	});
	
}

Meteor.methods({
	addQuestion: function( text ) {
		
		if ( Meteor.userId() != null ) {
			Questions.insert({
				text: text,							// text of the question
				createdAt: new Date(),				// current time
				owner: Meteor.userId(),				// _id of logged in user
				username: Meteor.user().username	// username of logged in user
			});
		} else {
		
			Questions.insert({
				text: text,							// text of the question
				createdAt: new Date()				// current time
			});
		}
	},
	
	hideQuestion: function( questionId, setHidden ) {
		Questions.update(questionId, {$set: {hidden: setHidden}});
	}
});
