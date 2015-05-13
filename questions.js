
/*********************************************************************\
 *  QUESTIONS														 *
\*********************************************************************/

Questions = new Mongo.Collection("questions");

Router.route('/finger/:fingerId/questions', function(){
	this.subscribe('questions', this.params.fingerId);
	this.render('questions');
	if (this.params.fingerId == 'admin') {
		this.render('adminQuestion', {to: 'title'});
	} else {
		this.render('oracleQuestion', {to: 'title'});
	}
	this.render('submittedQuestions', {to: 'list'});
});

if (Meteor.isClient) {	
	Template.questions.helpers({
		fingerId: function(){
			var OracleController = Iron.controller();
			return OracleController.params.fingerId;
		},
		more: function(){
			var OracleController = Iron.controller();
			var el =  Questions.findOne({owner: OracleController.params.fingerId}, {sort: {createdAt: -1}});
			if( el ){
				return true;
			}
		}
	});
	
	Template.questions.events({
		"submit .new-question": function(event){
			console.log('blah');
			var text = event.target.text.value;
			var fingerId = event.target.fingerId.value;
			console.log('User entered a new question : ' + text + " user" );	
			Meteor.call("addQuestion", text, fingerId);
			event.target.text.value = ""; // clear the form
			return false; // prevent default form submit
		}
	});
	
	Template.submittedQuestions.helpers({
		listOfQuestions: function() {
			var OracleController = Iron.controller();
			return Questions.find({owner: OracleController.params.fingerId}, {sort: {createdAt: -1}});
		}
	});
	
	Template.submittedQuestions.events({
		"click .hide": function () {
			Meteor.call("hideQuestion", this._id, ! this.hidden);
		}
	});
}

if (Meteor.isServer){
	Meteor.publish("questions", function (owner) {
		if (owner === 'admin'){
			return Questions.find({
				owner: owner
			});
		} else {
			return Questions.find({
				owner: owner,
				hidden: {$ne: true}
			});
		}
	});
}

Meteor.methods({
	addQuestion: function( text, owner ) {
		console.log('adding question');
		Questions.insert({
			text: text,							// text of the question
			createdAt: new Date(),				// current time
			owner: owner
		});
	},
	hideQuestion: function( questionId, setHidden ) {
		Questions.update(questionId, {$set: {hidden: setHidden}});
	}
});	


