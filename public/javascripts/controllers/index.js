var app = angular.module('wms',['ngRoute','ngCookies']);

app.config(function($routeProvider){
    $routeProvider.when("/",{
        controller : "wmsctrl"
    })
    .when("/payslip",{
            controller : "wmsctrl",
            templateUrl : "/ejs/dashboard/payslip.ejs"
        })
    .when("/bank",{
        templateUrl : "/ejs/dashboard/bank.ejs"
    })
        .when("/leave",{
            controller : "wmsctrl",
            templateUrl : "/ejs/dashboard/leave.ejs"
        })
        .otherwise({
        template : "URL not found !"
    });
});

app.controller('wmsctrl',['$scope','$http','$location','$routeParams','$interval','$timeout','$cookies',function ($scope,$http,$location,$routeParams,$interval,$timeout,$cookies) {

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
    $scope.getUserInfo=()=>{
        $http.get('/user').then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.user = response.data;
        }
        function errorCallback(error) {
            console.log("Data could not be Obtained !" + error);
        }
    }
    $scope.setPin = ()=>{
        if($scope.user.pin.length>6  || $scope.user.pin.length<4 ){
            $scope.message = {
                content : "PIN must be 4-6 character long!",
                error : true
            };
        }else{
            $http.post('/updatepin',$scope.user).then(successCallback, errorCallback);

            function successCallback(response) {
                $scope.pinData = response.data;
                if($scope.pinData.code ==0){
                    $scope.message = {
                        content : $scope.pinData.message,
                        error : false
                    };
                }else{
                    $scope.message = {
                        content : $scope.pinData.message,
                        error : true
                    }
                }
            }
            function errorCallback(error) {
                console.log("Data could not be Obtained !" + error);
            }
        }
    }
    $scope.applyLeave = ()=>{
        $http.post('/applyleave',$scope.leaveDates).then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.leaveData = response.data;
            if($scope.leaveData.code ==0){
                $scope.message = {
                    content : $scope.leaveData.message,
                    error : false
                };
            }else{
                $scope.message = {
                    content : $scope.leaveData.message,
                    error : true
                }
            }
        }
        function errorCallback(error) {
            console.log("Data could not be Obtained !" + error);
        }
    }
}]);
