var app = angular.module("ap",[]);

app.controller("con",function($scope){
  $scope.class = "red";
  $scope.changeClass = function(){
    if ($scope.class === "red")
      $scope.class = "blue";
    else
      $scope.class = "red";
  };
});