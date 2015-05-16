
/*********************************************************************\
 *  THE TECH ORACLE													 *
\*********************************************************************/

Router.route('/', {
	name : 'home'
});

if (Meteor.isClient) {
	Template.header.events({
		"submit .logout": function(){
			Router.go('/');
			return false;
		}
	});	
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
