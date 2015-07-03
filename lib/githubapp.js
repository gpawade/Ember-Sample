//Ember bootstrap
var App = Em.Application.create();

App.Router.map(function () {
	this.route('index', { path: '/' });
	this.resource('search', { path: '/:username' }, function(){
		this.route("details", {path : '/:id'});
	});
});


App.ApplicationController = Em.Controller.extend({

	actions: {
		search: function (username) {
			console.log('looking for ' + username);
			this.transitionToRoute("search", username);
			return false;
		}
	}
});


App.SearchRoute = Em.Route.extend({
	model : function(params){
		var url = 'https://api.github.com/search/users?q=' + params.username;
		console.log('user looging for ' + url);
		
		var promise = Em.$.getJSON(url);
		
		
		return new Em.RSVP.Promise(function(resolve) {
			promise.then(function(data){
				resolve(data);
			});	
		});
	},
	
	setupController : function(controller, model){
		this._super(controller, model);
		console.log('SearchRoute - SetupController');
		console.log(model);
	}
	
});