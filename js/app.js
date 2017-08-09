/*
	Calling the "tutorialApp" name form "index.html". 
	It has to be at the beginning of the <html> tag with ng-app="tutorialApp".
	
	var app = angular.module('tutorialApp', [Depedicies Injection]); 
	
	Adding the routing module => ngRoute.
*/
var app = angular.module('groceryListApp', ['ngRoute']);	// Main - Module 



// ================================== Add Routing  ==================================
app.config(function($routeProvider)
{
	$routeProvider
		.when ('/', {
			templateUrl: "views/groceryList.html",
			controller: "HomeController"
		})
		
		.when ('/addItem', {
			templateUrl: "views/addItem.html",
			controller: "GroceryListItemController"
		})
		
		// Passing the Arguments with HTTP protocol
		.when ('/addItem/edit/:id', {
			templateUrl: "views/addItem.html",
			controller: "GroceryListItemController"
		})
		
		.otherwise({
			redirectTo: "/", 		// Redirecting to home page
		})
});

// ================================== Services     ==================================

app.service("GroceryService", function ($http)
{
	var groceryService = {}; 
	
	// groceryService.groceryItems;
	
	// Connectng to the server simulation by using "HTTP" protocol
	groceryService.groceryItems = []; 
	// $http.get("json/server_data.json")
	$http.get("json/server_data_clean.json")
		 .then (function success(response) // HTTP 200 OK
		 {
			groceryService.groceryItems = response.data; 
			
			// console.log(response.data); 
			
			// Converting the Date String to Date Object 
			for (var item in groceryService.groceryItems)
			{
				groceryService.groceryItems[item].date = new Date(groceryService.groceryItems[item].date); 
			}
		 },
		 function error(response, status)
		 {
			 alert("Things went wrong !!!"); 
		 });
	
	
	/*
	// Dummy Data 
	groceryService.groceryItems = [
		{id: 1, completed: true, itemName: "Milk", date: new Date("October 1, 2014 11:13:00")}, 
		{id: 2, completed: true, itemName: "Cookies", date: new Date("October 1, 2014 11:13:00")}, 
		{id: 3, completed: true, itemName: "Ice Creams", date: new Date("October 1, 2014 11:13:00")}, 
		{id: 4, completed: true, itemName: "Potatoes", date: new Date("October 2, 2014 11:13:00")}, 
		{id: 5, completed: true, itemName: "Cereal", date: new Date("October 3, 2014 11:13:00")}, 
		{id: 6, completed: true, itemName: "Bread", date: new Date("October 3, 2014 11:13:00")}, 
		{id: 7, completed: true, itemName: "Eggs", date: new Date("October 4, 2014 11:13:00")}, 
		{id: 8, completed: true, itemName: "Coffee", date: new Date("October 5, 2014 11:13:00")}, 
		]; 
	*/	
	
	// Completed and Uncompleted task 
	groceryService.markCompleted = function(entry)
	{
		entry.completed = !entry.completed; 
	};
	
	// Deleting the item form the list 
	groceryService.removeItem = function(entry)
	{
		// Removing the item with HTTP Ajax Request 
		$http.post("json/deleted_item.json", {id: entry.id})
				 .then (function success(response) // HTTP 200 OK
				 {
					if (response.data[0].status === 1)
					{
						var index = groceryService.groceryItems.indexOf(entry); 
		
						// Deleting the one thing 
						// groceryService.groceryItems.splice(StartIndex, NumOfRows_To_Delete); 
						groceryService.groceryItems.splice(index, 1);  
						
						console.log ("Delete Status >> " + response.data[0].status)
					}
					
				 });
		
		/*
		// Getting the index of the item 
		var index = groceryService.groceryItems.indexOf(entry); 
		
		// Deleting the one thing 
		// groceryService.groceryItems.splice(StartIndex, NumOfRows_To_Delete); 
		groceryService.groceryItems.splice(index, 1); 
		*/
	}; 

	/*
		Searching for the item in the list
		
		How to test with GoogleChrome Developer Console : 
			# angular.element(document.body).injector().get("GroceryService").findById(<ID Integer>)
			$ angular.element(document.body).injector().get("GroceryService").findById(4)
		
	*/
	groceryService.findById = function(id)
	{
		for(var item in groceryService.groceryItems)
		{
			if (groceryService.groceryItems[item].id === id)
			{
				return groceryService.groceryItems[item]; 
			}
		}
	};	
	
	// Creating a unique ID 
	groceryService.getNewId = function()
	{
		if (groceryService.newId)
		{
			groceryService.newId ++; 
			
			return groceryService.newId; 
		}
		else
		{
			// Using underscore.min.js
			var maxID = _.max(groceryService.groceryItems, function(entry)
			{
				return entry.id;
			});
			
			groceryService.newId = maxID.id + 1; 
			
			return groceryService.newId; 
		}
	};
		
	// Saving the data to the list  
	groceryService.save = function(entry)
	{
		var updatedItem = groceryService.findById(entry.id); 
		
		if (updatedItem)
		{
			$http.post("json/updated_item.json", entry)
				 .then (function success(response) // HTTP 200 OK
				 {
					if (response.data[0].status === 1)
					{
						updatedItem.completed = entry.completed; 
						updatedItem.itemName = entry.itemName; 
						updatedItem.date = entry.date; 
						
						console.log ("Status >> " + response.data[0].status)
					}
					
				 });
				 
				 /*
					// Client side coding
					updatedItem.completed = entry.completed; 
					updatedItem.itemName = entry.itemName; 
					updatedItem.date = entry.date; 
				 */
			
		}
		else 
		{
			// Storing the id to the file 
			$http.get("json/added_item.json")
				 .then (function success(response) // HTTP 200 OK
				 {
					entry.id = response.data[0].newID; 
					
					// How to print the JSON obj in console
					console.log (">> " + JSON.stringify(response.data[0].newID)); 
					console.log(angular.toJson(response.data[0].newID, true));
					
					/*
						// For multiple items in the JSON file. 
						for (var item in $scope.myData)
						{
							console.log("$$$ " + $scope.myData[item].newID);
						}
					*/
					
				 },
				 function error(response, status)
				 {
					 alert("Can't retrieved added_item.json !!!"); 
				 });
			
			// entry.id = groceryService.getNewId();  	// Removing the client side
			groceryService.groceryItems.push (entry); 
		}
		
	};
	
	return groceryService; 
	
});


// ================================== Controllers  ==================================

app.controller("HomeController", ["$scope", "GroceryService", function($scope, GroceryService)
{
	$scope.appTitle = "Grocery List"; 
	
	// Adding the dummy data to the list -- Handle by service. 
	$scope.groceryItems = GroceryService.groceryItems;
	
	// Creating the toggle for Completed and Uncompleted Check mark 
	$scope.markCompleted = function(entry)
	{
		GroceryService.markCompleted(entry);
	};
	
	// Removing the item from the list 
	$scope.removeItem = function (entry)
	{
		GroceryService.removeItem(entry); 
	};
	
	// Watching the data changes 
	$scope.$watch(function()
	{
		return GroceryService.groceryItems; 
	}, 
	function (groceryItems)
	{
		$scope.groceryItems = groceryItems; 
	}); 
	
	// 
	
	/*
		// Dummy Data
		// Adding the Implicit item and its name display it on Add Item => textbox. 
		$scope.groceryItem = {id: 9, completed: true, itemName: "Vodka", date: new Date()};
	
	*/
}]);

app.controller("GroceryListItemController", ["$scope", "$routeParams", "$location", "GroceryService", function($scope, $routeParams, $location, GroceryService)
{
	// Adding the new item 
	if (!$routeParams.id)
	{
		$scope.groceryItem = {id: 0, completed: false, itemName: "", date: new Date()};
	}
	else // Editing the item 
	{
		// Using => underscore.min.js
		$scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
	}
	
	
	// Save Function will save the item at the service
	$scope.save = function ()
	{
		GroceryService.save($scope.groceryItem); 
		
		$location.path ("/");  	// Diverting to Home page
	};
	
	// For Debugging 
	console.log ($scope.groceryItems); 
	
	/*
	// Dummy data for initial project 
	
	$scope.groceryItems = [
		{completed: true, itemName: "Milk", date:"2017-08-04"}, 
		{completed: true, itemName: "Cookies", date:"2017-06-04"}, 
		{completed: true, itemName: "Ice Creams", date:"2017-08-01"}, 
		{completed: true, itemName: "Potatoes", date:"2017-08-04"}, 
		{completed: true, itemName: "Cereal", date:"2017-03-04"}, 
		{completed: true, itemName: "Bread", date:"2017-01-04"}, 
		{completed: true, itemName: "Eggs", date:"2017-12-04"}, 
		{completed: true, itemName: "Coffee", date:"2017-03-04"}, 
	
	]
	*/
	
	// Getting the ID from HTTP protocol
	// $scope.rp = "Route parameter value : " + $routeParams.id; 
}])



// ================================== END OF METHODS ==================================
; 



