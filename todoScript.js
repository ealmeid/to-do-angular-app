var ToDoApp = angular.module('ToDoApp', [])
var scope;
var isFile = false;
ToDoApp.controller('ToDoController', ['$scope' , function($scope){

  $scope.ToDoList = [
    {
      "task" : "Do Laundry",
      "complete" : false,
      "description" : "Grab clothes from basket and put into washing machine."
    }
  ];

  $scope.CompletedList = [];

  $scope.addTask = function(){
    console.log($scope.ToDoList);
    $scope.ToDoList.forEach(function (task){
        if(task.task === $scope.task){
          window.alert("You have entered a duplicate task, please try again!");
          throw new Error('Duplicate task entered into textbox');
        }
        if(!$scope.task){
          window.alert("You must enter a task name, please try again!");
          throw new Error('Invalid task name entered');
        }
    });
    $scope.ToDoList.push({"task" : $scope.task, "complete" : false, "description" : $scope.description});
    $scope.task = "";
    $scope.description = "";
  }

  $scope.addJSONTasks = function(){
    //console.log('hi');
    if(!isFile){
      window.alert("Error! List cannot be found. Add or re-add your JSON file in the drop box. Thank you.")
    }
    isFile=false;
  }

  $scope.completeTask = function(){
    //console.log("hi");
    var tempList = $scope.CompletedList;
    var tempToDoList = $scope.ToDoList;
    //var tempList2 = $scope.ToDoList;
    $scope.CompletedList = tempToDoList.filter(function(todo){
        return todo.complete;
    })

    angular.forEach(tempList, function(x){
        $scope.CompletedList.push(x);
    })

    //console.log(JSON.stringify(tempList2));
    //console.log(JSON.stringify($scope.CompletedList));

    $scope.ToDoList = $scope.ToDoList.filter(function(todo){
        return !todo.complete;
    })
    /*
    angular.forEach($scope.ToDoList, function(x) {
                if (x.complete) $scope.todoList.remove(x);
            });
    */
  }

  $scope.clearCompleteTasks = function(){
    $scope.CompletedList = {};
  }

}]);

var dropBox;

window.onload=function(){
  dropBox=document.getElementById("dropBox");
  dropBox.ondragcenter = ignoreDrag;
  dropBox.ondragover = ignoreDrag;
  dropBox.ondrop = drop;
}

function ignoreDrag(e){
  e.stopPropagation();
  e.preventDefault();
}

function drop(e){
  e.stopPropagation();
  e.preventDefault();

  var data = e.dataTransfer;
  var files = data.files;

  processFiles(files);
}

function processFiles(files){

  var file = files[0];

  var reader = new FileReader();

  reader.onload = function(e){
    filterTodos(e.target.result);
  };

  reader.readAsText(file);

}

function filterTodos(textfile){

  var tasks = JSON.parse(textfile);
  //console.log(tasks);
  var appElement = document.querySelector('[ng-app=ToDoApp]');
  var $scope = angular.element(appElement).scope();
  var scopeTasks = [];
  var isDuplicate = 1;
  $scope.ToDoList.forEach(function (task){
    scopeTasks.push(task.task);
  });
  console.log(scopeTasks);
  //console.log($scope);
  if(scopeTasks.length==0){
    angular.forEach(tasks,function(x){
      $scope.ToDoList.push(x);
    });
  }
  else{
  angular.forEach(tasks, function(x) {
    for(i = 0; i < scopeTasks.length; i++){
      if(x.task==scopeTasks[i]){
        //console.log('no');
        //console.log(scopeTasks[i]);
        //console.log(x.task);
        window.alert('You have entered a duplicate task at index: ' + i + ',\n Task name is: ' + x.task + '\n  Please try again!');
        isDuplicate = 0;
      }
    }
    if(isDuplicate==1){
      $scope.ToDoList.push(x);
    }
    isDuplicate=1;
  });
  }
  isFile = true;

}
