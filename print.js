
/*********************************************************************\
 *  PRINT															 *
\*********************************************************************/	

Router.route('/finger/:fingerId/print', function(){
	this.render('print');
});

if (Meteor.isClient) {
	Template.print.helpers({
		isVisible: function(){
				return true;
		}
		
	});
	
	Template.print.events({
		"submit form": function(){
			var controller = Iron.controller();
			var fingerId = controller.params.fingerId;
			Meteor.call('sendToPrinter', fingerId);
			return false;
		}
	});
}

if (Meteor.isServer) {	
	Meteor.methods({
		sendToPrinter: function ( fingerId ) {
			this.unblock();
			try {
				var data = Meteor.call('collectFingerData', fingerId);
			
				console.log('sending...');
				var result = HTTP.call("POST", "http://192.168.123.203:8000",
					{data: data}
				);
				
				Meteor.call('storeOracle', result.data, fingerId);
				return true;
			} catch (e) {
				// Got a network error, time-out or HTTP error in the 400 or 500 range.
				console.log("Error sending to printer" + e);
				return false;
			}

		},
		collectFingerData: function( fingerId ){
			console.log("fingerId: " + fingerId);
			
			// gather questions
			var questions = [];
			Questions.find({owner: fingerId}).forEach( function(question){
				questions.push(question.text);
			});
			
			// gather answers
			var answers = [];
			Answers.find({owner: fingerId}).forEach( function(answer){
				answers.push(answer.text);
			});
			
			// gather answers
			var comments = [];
			
			Comments.find({owner: fingerId}).forEach( function(comment){
				comments.push(comment.text);
			});
			
			
			var data = { 
				questions : questions,
				answers : answers,
				comments: comments,
				};
				
			//console.log(data);
			return data;
		},
		storeOracle: function(data, owner){
			Fingers.update({fingerId: owner},{
				fingerId : owner,
				oracle: data
			});
		}
	});
}
