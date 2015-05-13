
/*********************************************************************\
 *  THE TECH ORACLE													 *
\*********************************************************************/

Router.route('/', {
	name : 'home'
});

if (Meteor.isClient) {	
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
