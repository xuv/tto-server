
/*********************************************************************\
 *  PROTESTS														 *
\*********************************************************************/

Images = new Mongo.Collection("images");

Router.route('/protests', function(){
	this.render('protests');
});


if (Meteor.isClient) {	
	Session.setDefault("errorMessage", " ");
	
	Meteor.subscribe("images");

	Template.error.helpers({
		errorMessage: function () {
			return Session.get("errorMessage");
		}
	});
	
	Template.protestImage.helpers({
		images: function () {
			return Images.find(
				{userId: Meteor.userId()},
				{sort: {createdAt: -1}}
			);
		}
	});		
  
	Template.slogans.events({
		"submit form": function(event){
			var first = event.target.first.value;
			var second = event.target.second.value;
			if ( first === "" | second === "" ) {
				Session.set("errorMessage", "Fill both slogans");
			} else {
				Session.set("errorMessage", "");
				Meteor.call('createSlogan', first, second, Meteor.userId());
			}
			return false;
		}
		
	});
}

if (Meteor.isServer) {
	
	Meteor.startup(function () {
		// code to run on server at startup
	});
	
	Meteor.publish("images", function () {
		return Images.find({});
	});
	
	exec = Npm.require("child_process").exec;

	
	_execSync = function(cmd, stdoutHandler) {
        exec(cmd, Meteor.bindEnvironment(
                function(error, stdout, stderr) {
                    if (stdout != "")
                        stdoutHandler(stdout);
                }
            )
        );
    }
    
    insertImage = function(_data) {
			_data = _data.replace('\n', '')
			console.log(_data);
			Images.insert({
				name: _data,
				createdAt: new Date(),
				userId: Meteor.userId()
			});
	}
	
	Meteor.methods({
		createSlogan: function(first, second, userId){
		
			
			// process.env.PWD returns the app folder
			var file_path = process.env.PWD + "/public/protest-generator/protest-generator.sh";
			var cmd = 'sh ' + file_path + ' -f "' + first + '" -s "' + second + '"';
			_execSync(cmd, insertImage);
		}
	});
}
