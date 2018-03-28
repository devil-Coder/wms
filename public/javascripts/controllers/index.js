var app = angular.module('wms',["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider.when("/",{
        controller : "editorController"
    })
    .when("/run",{
            controller : "editorController",
            templateUrl : "/ejs/editor/run.ejs"
        })
    .when("/submit",{
        controller : "editorController",
        templateUrl : "/ejs/editor/submit.ejs"
    })
        .otherwise({
        template : "URL not found !"
    });
});

app.controller('wmsctrl',['$scope','$http','$location','$routeParams','$interval','$timeout',function ($scope,$http,$location,$routeParams,$interval,$timeout) {

    console.log("controller loaded");
    $scope.getregistered = function () {
        console.log('verifying..',$scope.worker);
        if($scope.worker.experience >=3 && $scope.worker.languages>=2){
            $http.post('/register',$scope.worker).then(successCallback, errorCallback);

            function successCallback(response) {
                $scope.regData = response.data;
                if($scope.regData.code ==0){
                    $scope.message = {
                        content : "Success! Yout UID is "+ $scope.regData.uid+'. Please remember this for login.',
                        error : false
                    };
                }else{
                    $scope.message = {
                        content : "Something went wrong!",
                        error : true
                    }
                }
            }
            function errorCallback(error) {
                console.log("Data could not be Obtained !" + error);
            }
        }
        else{
            $scope.message = {
                content : "Sorry you don't fullfill the recruitment criteria.",
                error : true
            }
        }
    }
    $scope.getLogin = ()=>{
        console.log('verifying your credentials...');
        $http.post('/login',$scope.workerLogin).then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.loginData = response.data;
            if($scope.loginData.code ==0){
                $scope.message = {
                    content : $scope.loginData.message,
                    error : false
                };
                window.location.href = '/dashboard';
            }else{
                $scope.message = {
                    content : $scope.loginData.message,
                    error : true
                }
            }
        }
        function errorCallback(error) {
            console.log("Data could not be Obtained !" + error);
        }
    }
}]);
