
/*********************************************************************\
 *  FINGERS															 *
\*********************************************************************/
Fingers = new Mongo.Collection('fingers');

OracleController = RouteController.extend();

Router.route('/finger/', function(){
	this.redirect('/');
});

Router.route('/finger/:fingerId', function(){
	this.render('fingerWelcome');
});

var checkUser =  function(){
	console.log("User: " + this.params.fingerId + " is being called");
	if( this.params.fingerId){
		console.log('Checking if user exists...');
		var finger = Fingers.findOne({fingerId: this.params.fingerId});
		// Checking if user exists
		if (finger) {
			console.log('... and it does exists');
			this.next();
		} else {
			console.log("No, it doesn't. Go register.");
			this.render('fingerRegister');
		}
	} else {
		console.log('No user id was submitted');
		this.next();
	}
}

Router.onBeforeAction(checkUser, {
	except: ['screensaver', 'slideshow']
});


Router.configure({
	loadingTemplate: 'loading',

	subscriptions: function() {
		// add the subscription to the waitlist
		//this.subscribe('fingers').wait();
		//this.subscribe('questions', this.params.fingerId).wait();
		this.subscribe('answers', this.params.fingerId).wait();
	},
	waitOn: function(){
		Meteor.subscribe('fingers');
		Meteor.subscribe('agnese', {});
	},
	controller: OracleController
});

if (Meteor.isClient) {
	Template.fingerRegister.helpers({
		fingerId: function(){
			var controller = Iron.controller();
			return controller.params.fingerId;
			
		}
	});
	
	Template.fingerRegister.events({
		"submit form": function(event){
			var fingerId = event.target.fingerId.value;
			Meteor.call('createFinger', fingerId);
			return false;
		}
	});
	
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
	Meteor.publish("fingers", function () {
		return Fingers.find({});
	});
}

Meteor.methods({
	createFinger: function(fingerId){
		Fingers.insert({
			fingerId: fingerId
		});
	}
});
