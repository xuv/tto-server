
/*********************************************************************\
 * ANSWERS 															 *
\*********************************************************************/

Answers = new Mongo.Collection("answers");

Router.route('/finger/:fingerId/answers', function(){
	this.subscribe('questions', 'admin');
	
	var alreadyAnswered = Answers.find({owner: this.params.fingerId});
	
	var getRandomQuestion = function() {
		var exclude = [];
		
		alreadyAnswered.forEach(function(answer){
				exclude.push(answer.questionId);
		});
			
		console.log("Exclude: " + exclude);
		
		var questions = Questions.find({
				$and: [
					{ owner: 'admin'},
					{ hidden: {$ne: true} },
					{ _id: {$nin: exclude} }
					]
				}).fetch();
		console.log(questions.length);
		if ( questions.length > 0 ) {
			return questions[Math.floor(Math.random()* questions.length)];
		}
	}

	if (this.ready()) {
		if ( this.params.fingerId === 'admin' ) {
			this.render('adminAnswer');
		} else {
			var randomQuestion  = getRandomQuestion();
			console.log("Random Question " + randomQuestion);
			if ( randomQuestion ) {
				Router.go('/finger/' + this.params.fingerId + '/answers/' + randomQuestion._id);
			} else {
				console.log('no More questions for this user');
				this.render('noMoreQuestion');
			}
		}
	}	
});

Router.route('/finger/:fingerId/answers/:_id', function () {
	this.subscribe('questions', 'admin');
	var item = Questions.findOne({_id: this.params._id});
	var answer = Answers.findOne({$and: [
		{owner: this.params.fingerId},
		{questionId: this.params._id}
	]});
	this.render('fingerAnswer', {data:  {
		question : item,
		answer : answer }
	});
});

if (Meteor.isClient) {
	Template.fingerAnswer.helpers({
		fingerId: function(){
			var OracleController = Iron.controller();
			return OracleController.params.fingerId;
		}
	});
		
	Template.fingerAnswer.events({
		"submit #create-answer": function(event){
			var text = event.target.text.value;
			var questionId = event.target.questionId.value;
			var fingerId = event.target.fingerId.value;
			
			Meteor.call("answerQuestion", text, questionId, fingerId);
			
			event.target.text.value = ""; // clear the form
			
			Router.go('/finger/' + fingerId + '/answers');
			
			return false; // prevent default form submit
		},
		
		"submit #change-answer": function(event){
			var text = event.target.text.value;
			var answerId = event.target.answerId.value;
			var fingerId = event.target.fingerId.value;
			
			Meteor.call("changeAnswer", text, answerId);
			
			event.target.text.value = ""; // clear the form
			
			Router.go('/finger/' + fingerId + '/answers');
			
			return false; // prevent default form submit
		}
	});

}

if (Meteor.isServer) {
	Meteor.publish("answers", function (owner) {
		return Answers.find({owner: owner});
	});
}


Meteor.methods({
	answerQuestion: function( text, questionId, owner ) {
		Answers.insert({
			text: text,							// text of the question
			createdAt: new Date(),				// current time
			questionId : questionId,
			owner: owner						// _id of logged in user
		});
	},
	changeAnswer: function( text, answerId ) {
		Answers.update(
			{ _id : answerId },
			{ $set : { text : text} }
		);
	}
	
});
