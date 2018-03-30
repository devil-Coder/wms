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
        .when("/login",{
            templateUrl : "/ejs/admin/login.ejs"
        })
        .when("/dashboard",{
            controller : "wmsctrl",
            templateUrl : "/ejs/admin/dashboard.ejs"
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
            $scope.user.netSalary = $scope.user.dailyPay*30 - ($scope.user.numberOfLeave*50);
            console.log($scope.user);
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
    $scope.getLeaveData = ()=>{
        $http.get('/applyleave').then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.prevLeave = response.data;
            console.log($scope.prevLeave);
        }
        function errorCallback(error) {
            console.log("Data could not be Obtained !" + error);
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
    $scope.getLoginPage = ()=>{
        $location.path('/login');
    }
    $scope.verifyAdmin = (admin)=>{
        console.log(admin);
        if(admin.uname == 'admin' && admin.password == 'admin'){
            $scope.message = 'success';
            $location.path('/dashboard');
        }else{
            $scope.message = "Invalid credentials";
        }
    }

    $scope.getLeave = ()=>{
        $http.get('/fetchleave').then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.leaves = response.data;
        }
        function errorCallback(error) {
            console.log("Data could not be Obtained !" + error);
        }
    }

    $scope.approveLeave = (id,email,from,to)=>{
        var data = {
            leaveID :id,
            email : email,
            from : from,
            to : to
        }
        console.log(data);
        $http.post('/approveLeave',data).then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.leaves = response.data;
            console.log($scope.leaves);
        }
        function errorCallback(error) {
            console.log("Data could not be Obtained !" + error);
        }
    }

    $scope.deleteLeave = (id,email)=>{
        $http.post('/deleteLeave',{leaveID : id,email:email}).then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.leaves = response.data;
        }
        function errorCallback(error) {
            console.log("Data could not be Obtained !" + error);
        }
    }
}]);
