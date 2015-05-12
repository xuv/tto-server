
/*********************************************************************\
 *  THE TECH ORACLE													 *
\*********************************************************************/

Router.route('/', {
	name : 'home'
});

if (Meteor.isClient) {	
	Accounts.ui.config({
		// So the account system dois not ask for email address.
		passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
