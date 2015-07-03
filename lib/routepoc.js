var App = Em.Application.create({
				rootElement: "#appId"
});

App.Router.map(function () {
	this.route("index", { path: '/' });
	this.resource("hotel", { path: '/hotel' }, function () {
		this.route("new");
		this.route("edit", { path: '/:id' });
	});
	this.resource("github", { path: '/github' }, function () {
		this.route('edit', { path: '/:id' });
	});
});

App.HotelRoute = Em.Route.extend({
	model: function (parms) {
		var vm = this.get("hotelRouteModel");
		if (vm)
			return vm;

		vm = Fixure.getHotels();

		this.set("hotelRouteModel", vm);
		return vm;
	},

	actions: {
		save: function (obj) {
			console.log("HotelRoute - Save action");
			console.log(obj);

			var vm = this.get("hotelRouteModel");

			var obj = vm.findBy("id", obj.id);
			if (obj) {
				// Modify existing data
			}
			else {
				//Add new
				vm.pushObject(obj);
			}
			this.transitionTo('hotel');

			return false;
		}
	}
});

App.HotelNewRoute = Em.Route.extend({
	model: function (params) {
		console.log('HotelNewRoute - Model()');
		return App.HotelModel.create();
	},
	
	setupController : function(controller, model){
		this._super(controller, model);
		controller.set("errors", []);	
	},

	actions: {
		save: function (obj) {
			console.log("HotelNewRoute - Save action");
			
			obj.validate();
			
			if(obj.get("isValid")==false){
				//Invalid Model
				var errors = obj.get("validationErrors.fullMessages");
				
				this.set("controller.errors", errors);
				
				return false;
			}
			
			return true;
		}
	}

});

App.HotelEditRoute = Em.Route.extend({
	model: function (params) {
		console.log('HotelEditRoute - Model()');
		console.log(this.get("hotelRouteModel"));
		return App.HotelModel.create();
	},
	serialize: function (model) {
		console.log('HotelEditRoute - serialize()');
		return {
			id: model.id
		};
	}
});

App.HotelModel = Em.Object.extend(Ember.Validations,{
	id: null,
	name: '',
	rating: null,
	address: '',
	city: '',
	
	validations : {
		id : {
			presence : true,
			numericality : true
		},
		name : {
			presence : true
		},
		rating : {
			presence : true,
			numericality : {
				onlyInteger : true
			}
		},
		address : {
			presence : true
		},
		city :{
			presence : true
		}
	}
});

var Fixure = {
	getHotels: function () {
		var list = [];
		list.push(App.HotelModel.create({
			id: 1,
			name: 'taj diamond',
			rating: 4,
			address: 'koregoan park',
			city: 'pune'
		}));
		list.push(App.HotelModel.create({
			id: 2,
			name: 'Lemeridon',
			rating: 4,
			address: 'pune stations',
			city: 'pune'
		}));
		return list;
	}
};