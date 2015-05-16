
/*********************************************************************\
 *  PRINT															 *
\*********************************************************************/	

Router.route('/finger/:fingerId/prophecies', function(){
	if ( this.params.fingerId != 'admin' & Fingers.findOne({fingerId: this.params.fingerId}).oracle ) {
		console.log('User has already printed its Oracle');
		this.render('alreadyPrinted');
	} else {
		var router = this;
		Meteor.call('collectFingerData', this.params.fingerId, function(err, data){
			console.log('data: ' + data);
			if ( data.questions.length == 0 & data.answers.length === 0 & data.comments.length === 0 ){
				router.render('noDataNoPrint');
			} else {
				router.render('print');
			}
		});
	}
});

if (Meteor.isClient) {
	Template.printform.helpers({
		isVisible: function(){
			var controller = Iron.controller();
			var fingerId = controller.params.fingerId;
			if (fingerId === 'admin'){
				return true;	
			} else {
				var user = Fingers.findOne({fingerId: fingerId});
				
				console.log("User has already received an Oracle :  ")
				console.log(user.oracle);
				
				
				var bool;
				if( user.oracle === undefined) {
					bool = true;
				} else {
					bool = false;
					// Automatic logout after the print command is sent.
					Meteor.setTimeout(function(){
						console.log('PRINT Event TIMEOUT Called');
						Router.go('/');
					}, 20000);
				}
				return bool;
			}
		}
	});
	
	Template.noDataNoPrint.helpers({
		blah: function(){
			console.log('blah print displayed');
			Meteor.setTimeout(function(){
				console.log('NoDATANoPRINT Event TIMEOUT Called');
				Router.go('/');
			},20000);
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
				
				console.log('Sending this data to the Oracle: ' + data);
				var result = HTTP.call("POST", "http://192.168.123.203:8000",
					{data: data}
				);
				
				if (result.statusCode === 200) {
					Meteor.call('storeOracle', result.data, fingerId);
				}
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
				comments: comments
				};
				
			//console.log(data);
			return data;
		},
		storeOracle: function(data, owner){
			Fingers.update({fingerId: owner},{ 
				$set : { oracle : data} 
			});
		}
	});
}

Meteor.methods({
	getPrintedOracle: function(owner){
		return Fingers.findOne({fingerId: owner}).oracle;
	}
});
