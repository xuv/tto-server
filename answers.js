
/*********************************************************************\
 * ANSWERS 															 *
\*********************************************************************/

Answers = new Mongo.Collection("answers");

Router.route('/answers', function(){
	var getRandomQuestion = function() {
		var exclude = [];
		
		if ( Meteor.userId() != null ) {
			var answers = Answers.find({owner: Meteor.userId()});
			answers.forEach(function(answer){
					exclude.push(answer.questionId);
			});
		};
		
		var questions = Questions.find({
				$and: [
					{ hidden: {$ne: true} },
					{ _id: {$nin: exclude} }
					]
				}).fetch();
		console.log(questions.length);
		if ( questions.length > 0 ) {
			return questions[Math.floor(Math.random()* questions.length)];
		}
	}
	
	this.subscribe('answers').wait();

	if (this.ready()) {
		var randomQuestion  = getRandomQuestion();
		console.log("Random Question " + randomQuestion);
		if ( randomQuestion ) {
			Router.go('/answers/' + randomQuestion._id);
		} else {
			this.render('noMoreQuestion');
		}
	}	
});

Router.route('/answers/:_id', function () {
  var item = Questions.findOne({_id: this.params._id});
  var answer = Answers.findOne({$and: [
	  {owner: Meteor.userId()},
	  {questionId: this.params._id}
	  ]});
  this.render('answerQuestion', {data:  {
	  question : item,
	  answer : answer }
	});
});

if (Meteor.isClient) {
	Meteor.subscribe("answers");
	
	Template.answerQuestion.events({
		"submit #create-answer": function(event){
			var text = event.target.text.value;
			var questionId = event.target.questionId.value;
			
			Meteor.call("answerQuestion", text, questionId);
			
			event.target.text.value = ""; // clear the form
			
			Router.go('/answers');
			
			return false; // prevent default form submit
		},
		
		"submit #change-answer": function(event){
			var text = event.target.text.value;
			var answerId = event.target.answerId.value;
			
			Meteor.call("changeAnswer", text, answerId);
			
			event.target.text.value = ""; // clear the form
			
			Router.go('/answers');
			
			return false; // prevent default form submit
		}
	});

}

if (Meteor.isServer) {
	Meteor.publish("answers", function () {
		return Answers.find({});
	});
}


Meteor.methods({
	answerQuestion: function( text, questionId ) {
		if ( Meteor.userId() != null ) {
			Answers.insert({
				text: text,							// text of the question
				createdAt: new Date(),				// current time
				questionId : questionId,
				owner: Meteor.userId(),				// _id of logged in user
			});
		} else {
			Answers.insert({
				text: text,	
				createdAt: new Date(),
				questionId : questionId
			});
		}
	},
	changeAnswer: function( text, answerId ) {
		Answers.update(
			{ _id : answerId },
			{ $set : { text : text} }
		);
	}
	
});
