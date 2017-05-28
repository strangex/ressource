(function() {

    'use strict';

    angular
        .module('articlesApp')
        .controller('HomeController', HomeController);


    function HomeController($auth, $rootScope, $state, $scope, $mdDialog,$interval, $timeout, $http) {

        var vm = this;
        $("#dialog").css('margin-top','10%') ;

        $scope.temp="../template/signin.html" ;

        vm.cancelE=function(){
           $("#dialog").css('margin-top','10%') ;
           $scope.temp="../template/signin.html" ;
        }
        vm.forgotten=function(){
             vm.password="" ;
             vm.username="" ;
             $scope.temp="../template/email.html" ;
        }
        vm.emailMe=function(){
            
        }
       
        vm.registerV=function(){
             vm.password="" ;
             vm.username="" ;
             $scope.temp="../template/register.html" ;
             $("#dialog").css('margin-top','5%') ;
        } ;
        vm.cancel=function(){
             $scope.temp="../template/signin.html" ;
             $("#dialog").css('margin-top','10%') ;
        } ;
        vm.validate=function(ev){
          ev.preventDefault() ;
          if(vm.password!=vm.check){
               alertify.error("Invalid Request, passwords don't match") ;
              return false ;
          }
          if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Invalid Request, please verify the assigned fields') ;
                  return false ;  
          }
          var udata={'first_name':vm.fname, 'last_name':vm.lname, 'email':vm.email, 'profession':vm.profession, 'username':vm.username, 'password':vm.password} ;

          $http.post("/register", udata).then(function successCallback(response) {
                  alertify.notify('Successfully Registred, Please Check your inbox', 'message', 10) ; 
                 
                  vm.fname="";  vm.lname="";  vm.email="";  vm.profession=""; vm.username="" ; vm.password="" ;
                  vm.cancel() ;
                }, function errorCallback(response) {
                    var errs=response.data.errors ;   
                    if(errs.uEmail) {
                        vm.register.email.$setValidity('server', false);
                        vm.emlerr=errs.uEmail;  
                       $timeout(function() {
                           vm.register.email.$setValidity('server', true);
                       }, 2000);
                    }
                    else if(errs.first_name){
                        vm.register.fname.$setValidity('server', false);
                        vm.ferr=errs.first_name[0];
                        $timeout(function() {
                           vm.register.fname.$setValidity('server', true);
                        }, 2000);
                    } 
                    else if(errs.username) {
                        vm.register.username.$setValidity('server', false);
                        vm.userr=errs.username[0];
                        $timeout(function() {
                             vm.register.username.$setValidity('server', true);
                         }, 2000);
                    }
                    else if(errs.email) {
                        vm.register.email.$setValidity('server', false);
                        vm.emlerr=errs.email[0];
                       $timeout(function() {
                           vm.register.email.$setValidity('server', true);
                       }, 2000);
                    }                
           }) ;

        }
        vm.login = function() {
           if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Invalid Request, please verify your credentials') ;
                  return false ;  
            }
            var credentials = {
                  username: vm.username,
                  password: vm.password
              }
              $auth.login(credentials).then(function(data) {
                    $http.get('authenticate').then(function successCallback(response) {
                        var udata=response.data ;
                        var user=udata.user ;
                        localStorage.setItem('userId', user.id);
                        $state.go("dash");
                        alertify.notify('Successfully Logged In', 'message', 10) ; 
                      }, function errorCallback(response) {
                            console.log(response) ;
                      });
                }).catch(function(response) {
                        var issue=response.data ;
                        if(issue.error){
                          alertify.error(issue.error,10); 
                          return false;
                        }
                        var errs=response.data.errors ;
                        if(errs.username){
                          console.log(errs.username) ;
                          alertify.error(errs.username[0],10); 
                          $scope.sign['username'].$setValidity('server', false);
                          vm.usrerr=errs.username[0]; 
                        } 
                        else if(errs.password ) {
                          alertify.error(errs.password[0],10); 
                          $scope.sign['password'].$setValidity('server', false);
                          vm.passerr=errs.password[0]; 
                        }
                });

           }

    }
   
  

})();


