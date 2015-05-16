
/*********************************************************************\
 *  PROTESTS														 *
\*********************************************************************/

var FingerId;

Protests = new Meteor.Collection('protests');

Images = new Mongo.Collection("images");

Router.route('/finger/:fingerId/protests', function(){
	this.subscribe("images", this.params.fingerId );
	this.render('protests');
});


if (Meteor.isClient) {	
	Session.setDefault("errorMessage", " ");
	
	Template.error.helpers({
		errorMessage: function () {
			return Session.get("errorMessage");
		}
	});
	
	Template.slogans.helpers({
		fingerId: function() {
			var OracleController = Iron.controller();
			return OracleController.params.fingerId;
		}
	});
	
	Template.protestImage.helpers({
		images: function () {
			var OracleController = Iron.controller();
			var owner = OracleController.params.fingerId;
			
			return Images.findOne(
				{owner: owner},
				{sort: {createdAt: -1}}
			);
		},
	});		
  
	Template.slogans.events({
		"submit form.new-protest": function(event){
			var first = event.target.first.value;
			var second = event.target.second.value;
			var fingerId = event.target.fingerId.value;
			
			if ( first === "" | second === "" ) {
				Session.set("errorMessage", "Fill both slogans");
			} else {
				Session.set("errorMessage", "");
				Meteor.call('createSlogan', first, second, fingerId);
			}
			
			return false;
		}
		
	});
}

if (Meteor.isServer) {
	
	Meteor.publish("protests", function ( object ) {
		return Protests.find( object );
	});
	
	Meteor.publish("images", function (owner) {
		return Images.find({owner: owner});
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
			_data = _data.replace('\n', '');
			console.log(_data);
			console.log("FingerId: " + FingerId);
			Images.insert({
				name: _data,
				createdAt: new Date(),
				owner: FingerId
			});
	}
	
	Meteor.methods({
		createSlogan: function(first, second, owner){
			Meteor.call('createProtest', first, second, owner);
			FingerId = owner;
			console.log('create image : ' + owner);
			// process.env.PWD returns the app folder
			var file_path = process.env.PWD + "/public/protest-generator/protest-generator.sh";
			var cmd = 'sh ' + file_path + ' -f "' + first + '" -s "' + second + '"';
			_execSync(cmd, insertImage);
		},
		createProtest: function(first, second, owner){
			Protests.insert({
					owner: owner,
					text: first + "\n" + second
				});
		}
		
	});
}
