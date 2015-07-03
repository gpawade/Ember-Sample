var App = Em.Application.create();

App.Router.map(function(){
	this.route('index',{path: '/'});
	this.route("todos", {path:'/:groupname'});
	//this.route("group", {path:'/:groupname'});
});

App.TodosRoute = Em.Route.extend({
	needs : ["application"],
	groupModel : Em.Object.create(),
	model : function(params){
		console.log('Route : TodosRoute init');
		
		// var groupList = this.get("controllers");
		// console.log(groupList);
		var m = this.get("groupModel");
		
		if(m && m.get(params.groupname))
		   return m.get(params.groupname);
		
		var list =[];
		
		if(params.groupname && params.groupname=="default"){
			list = [];
			list.pushObject(App.TodoModel.create({
				task : "my sample task 1"
			}));
			
			list.pushObject(App.TodoModel.create({
				task : "my sample task 2"
			}));
		}
		m = {
				list : list,
				groupName : params.groupname
			};
		this.get("groupModel").set(params.groupname, m);
		return m;	
	},
	
	/*
	setupController : function(controller, 	model){
		console.log('Route : Todos : Setup Controller');
		console.log(model);
		
		
		var list = [], groupName = "";
		if(model){
		   list = model.list;
		   groupName = model.groupName;
		}
		controller.set("model", model);
		// console.log('group name : ', groupName);
	 	//controller.set("list", list);
		//controller.set("groupName", groupName);
		
	}
	*/
	
	actions :{
		willTransition: function(transition) {
			//console.log(transition);
	        console.log('action - will transition');
		  	var m = this.controllerFor('todos').get("model");
			
			//console.log(this.get("groupModel"));
			
			//console.log(this.groupModel);
			
			this.get("groupModel").set(m.groupName, m); 
			  //console.log();
			  //transition.abort();
	    }
		
		// deActivate : function(){
		// 	console.log('deactivate - action');
		// 	console.log(this.get("groupModel"));
		// }
	},
	
	
	deactivate : function(){
		console.log('deactivate');
		//console.log(this.get("groupModel"));
		
	}.on("deactivate")
	
});

App.ApplicationController = Em.Controller.extend({
	newGroupName : "",
	groupList : ["default"],
	
	actions : {
		addNewGroup : function(){
			console.log('adding new group...');
			var name = this.get("newGroupName");
			
			if(name)
			  this.get("groupList").pushObject(name);
			
			this.set("newGroupName","");
			
			return false;
		}
	}	
	
});

App.TodosController = Em.Controller.extend({
	newTask : "",
	//groupName : "",
	//list : [],
	
	init : function(){
		console.log('todos controller initialized...');
	},
	
	
	totalCount : function(){
		//console.log('executing count computed property..');
		return this.get('model.list').length;
	}.property("model.list.@each"),
	
	completed : function(){
		//console.log('executing completed computed property..');
		return this.get('model.list').filter(function(item,index){
			return item.isDone;
		}).length;
	}.property("model.list.@each.isDone"),
	
	
	remaining : function(){
		//console.log('executing remaining computed property..');
		return this.get('model.list').filter(function(item,index){
			return !item.isDone;
		}).length;
	}.property("model.list.@each.isDone"),
	
	actions :{
		
		addNew : function(){
			console.log('Action : Add new');
			
			var task = App.TodoModel.create();
			task.set("task", this.get("newTask"));
			
			this.get("model.list").pushObject(task);
			
			this.set("newTask","");
			
			return false;
		}
	}
	
});


App.TodoModel = Em.Object.extend({
	task : "",
	isDone : false
});