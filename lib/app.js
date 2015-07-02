var App = Em.Application.create();

App.Router.map(function(){
	this.route('index',{path: '/'});
	this.route("todos", {path:'/:groupname/:filter'});
	//this.route("group", {path:'/:groupname'});
});

App.TodosRoute = Em.Route.extend({
	needs : ["application"],
	model : function(params){
		console.log('Route : TodosRoute init');
		
		// var groupList = this.get("controllers");
		// console.log(groupList);
		
		
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
		return {
				list : list,
				groupName : params.groupname
			};	
	},
	
	setupController : function(controller, 	model){
		console.log('Route : Todos : Setup Controller');
		//console.log(model);
		
		
		var list = [], groupName = "";
		if(model){
		   list = model.list;
		   groupName = model.groupName;
		}
		
		console.log('group name : ', groupName);
	 	controller.set("list", list);
		controller.set("groupName", groupName);
		
	}
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
		// console.log(this.get("model"));				
	},
	
	totalCount : function(){
		console.log('executing count computed property..');
		return this.get('list').length;
	}.property("list.@each"),
	
	completed : function(){
		console.log('executing completed computed property..');
		return this.get('list').filter(function(item,index){
			return item.isDone;
		}).length;
	}.property("list.@each.isDone"),
	
	
	remaining : function(){
		console.log('executing remaining computed property..');
		return this.get('list').filter(function(item,index){
			return !item.isDone;
		}).length;
	}.property("list.@each.isDone"),
	
	actions :{
		
		addNew : function(){
			console.log('Action : Add new');
			
			var task = App.TodoModel.create();
			task.set("task", this.get("newTask"));
			
			this.get("list").pushObject(task);
			
			this.set("newTask","");
			
			return false;
		}
	}
	
});


App.TodoModel = Em.Object.extend({
	task : "",
	isDone : false
});