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
			
			if(vm.isAny("id", obj.id)){
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
		
		//Get model from parent route
		var hvm = this.modelFor('hotel');
		
		var id = parseInt(params.id);
		
		// console.log(hvm.findBy("id",id));
		// console.log(this.controllerFor("hotel").get("model"));
		if(!hvm.isAny("id", id)){
			//if id note found in parent model, then redirect to index
			console.log("param hotel id not found");
			this.transitionTo("hotel");
			console.log('transition to root route');
		}
		return hvm.findBy("id",id);
	},
  // setupController: function(controller, model) {
    // this._super(controller, model);
    // var hvm = this.controllerFor("hotel").get("model");
	// 
	// // var obj hvm.
  // },
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