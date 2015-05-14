
/*********************************************************************\
 *  FINGERS															 *
\*********************************************************************/
Fingers = new Mongo.Collection('fingers');

OracleController = RouteController.extend();

Router.route('/finger/:fingerId', function(){
	this.render('fingerWelcome');
});

var checkUser =  function(){
	console.dir(this.params);
	if(this.ready() && this.params.fingerId){
		console.log('checking user');
		var finger = Fingers.findOne({fingerId: this.params.fingerId});
		// Checking if user exists
		if (finger) {
			this.next();
		} else {
			this.render('fingerRegister');
		}
	} else {
		this.next();
	}
}


Router.onBeforeAction(checkUser, {
	//except: ['agneseImage', 'oneAnswer']
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
