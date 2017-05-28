(function() {

    'use strict';

    angular
        .module('articlesApp')
        .controller('DashController', DashController);


    function DashController(FileUploader, $auth, $state, $scope, $mdDialog,$interval, $timeout, $http) {

      var vm = this;
      var ressources ;
      var rtable ;
      var userId=localStorage.getItem('userId') ;

      function getRessources(){
        $http({ method: 'GET', url: '/ressource'})
          .then(function successCallback(response) {
              ressources=response.data ;
                if(ressources.length!=0){
                      viewRessources(ressources) ;                   
                } else{
                      $scope.temp="../template/registerR.html" ;
                       $("#dialog").css({"margin-top":"-4%","max-width":"60%","margin-left":"22%"}) ;
                       $timeout(function() {
                             $("#viewId").css("display","none") ;
                             $("#linkView").css("width","100%") ;
                       }, 100);
                }
            }, function errorCallback(response) {
                console.log(response) ;
          });   
      }
      getRessources() ;

      function viewRessources(ressources){
          $scope.temp="../template/viewR.html" ;
          $scope.rdatas=ressources ;
          $("#dialog").css({"margin-top":"-6%","max-width":"85%","margin-left":"7%"}) ;
          $("#dialogContent").css("height","77%") ;
           $timeout(function() {
              vm.research="" ;
              rtable=$('#ressourcesT').DataTable({
                scrollY:        "200px",
                paging:true,
                "columnDefs": [
                  {
                      "targets": [5,6,7],
                      "visible": false,
                      "searchable": false
                }],
                hideEmptyCols: true

              });
            }, 100);
      }
      vm.download=function(name){
        $http({ method: 'GET', url: '/download/'+name, responseType: 'arraybuffer'})
          .then(function successCallback(response) {
                console.log(response) ;
                var blob = new Blob([response.data], {type:"application/pdf;charset=utf-8"});
                saveAs(blob, name);
            }, function errorCallback(response) {
                console.log(response) ;
        });   

      }
      vm.checkLink=function(){
        if(vm.rLinks){
          rtable.column(5).visible(true) ;
            $.fn.dataTable.ext.search.push(
             function(settings, data, dataIndex) {
              var udata=rtable.row(dataIndex).data();
               if(udata[5]==""){
                  return false
                }
                return true ;
             }
            );
            rtable.draw() ;
          return true ;
        }
        $.fn.dataTable.ext.search.pop() ;
        rtable.draw() ; 
        rtable.column(5).visible(false) ;
      }
      vm.checkArticle=function(){
        if(vm.rArticles){
          rtable.column(6).visible(true) ;
          $.fn.dataTable.ext.search.push(
             function(settings, data, dataIndex) {
                var udata=rtable.row(dataIndex).data();
                if(udata[7]==""){
                  return false
                }
                return true ;
             }
          );
          rtable.draw() ;
          return true ;
        }
         $.fn.dataTable.ext.search.pop() ;
         rtable.draw() ; 
        rtable.column(6).visible(false) ;
      }
     
      vm.back=function(){
            $scope.temp="../template/registerR.html" ;
            $("#dialog").css("margin-top","-4%") ;
            $("#dialogContent").css("height","inherit") ;
      }
      vm.validateReference=function(){
        $timeout(function() {
                rtable
                .column(3)
                .search(vm.reference).draw() ;

        }, 100);
      }
      vm.validateResearch=function(){   
         rtable
          .column(4)
          .search(vm.research).draw() ;
      }

      vm.viewR=function(){
        getRessources() ;
      }

      vm.cancelUpload=function(){
          $("#linkView").show() ;
          $(".importView").hide() ;
           uploader.clearQueue() ;
          $("#dialog").css({"max-width":"70%","margin-left":"15%"}) ;
      } ;

     function validFields () {
            vm.register.title.$setValidity('required', true);
            vm.register.title.$setValidity('minlength', true);
            vm.register.title.$setValidity('maxlength', true);
            vm.register.title.$setValidity('pattern', true);
               vm.register.author.$setValidity('required', true);
            vm.register.author.$setValidity('minlength', true);
            vm.register.author.$setValidity('maxlength', true);
            vm.register.author.$setValidity('pattern', true);
               vm.register.reference.$setValidity('required', true);
               vm.register.research.$setValidity('required', true);
              vm.register.edition.$setValidity('required', true);
            vm.register.edition.$setValidity('minlength', true);
            vm.register.edition.$setValidity('maxlength', true);
            vm.register.edition.$setValidity('pattern', true) ;                
               vm.register.pdate.$setValidity('required', true);
            vm.register.pdate.$setValidity('minlength', true);
            vm.register.pdate.$setValidity('maxlength', true);
            vm.register.pdate.$setValidity('pattern', true);
      };

     vm.validate=function(){
      if(!vm.link){
        alertify.error("Link can't be empty") ;
        return false ;
      }
      if($(".fields").hasClass('ng-invalid')){
              alertify.error('Invalid Request, please verify the assigned fields') ;
              return false ;  
      }
      var udata='{"user_id":"'+userId+'","title":"'+vm.title+'", "author":"'+vm.author+'", "reference":"'+vm.reference+'", "research":"'+vm.research+'","edition":"'+vm.edition+'", "pub_date":"'+vm.pdate+'","link":"'+vm.link+'"}' ;
      udata=JSON.parse(udata) ;
      $http.post("/registerR", udata).then(function successCallback(response) {
                  alertify.notify('Successfully Registred', 'message', 10) ; 
                  vm.title="" ; vm.author="";vm.reference="" ; vm.research="" ; vm.edition="" ; vm.pdate="" ;vm.link="" ;
                  $timeout(function() {
                        validFields() ;
                        getRessources() ;
                  }, 100);
                }, function errorCallback(response) {
                  console.log(response) ;
            }) ;
    }


		vm.import=function(){

      if($(".fields").hasClass('ng-invalid')){
              alertify.error('Invalid Request, please verify the assigned fields') ;
              return false ;  
       }
			$("#linkView").hide() ;
			$(".importView").show() ;
			$("#dialog").css({"max-width":"80%","margin-left":"10%"}) ;

			 uploader.onBeforeUploadItem=function(item) {
	      	   var udata={"user_id":userId,"title":vm.title,"author":vm.author,"reference":vm.reference,"research":vm.research,"edition":vm.edition, "pub_date":vm.pdate,"link":vm.link} ;
	           item.formData.push(udata);
	    	 }
		}

		 var uploader=$scope.uploader = new FileUploader({
            url: '/registerR',
            queueLimit:1,
            headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('satellizer_token')
            }

         });

         uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
              var validExts = new Array(".pdf");
        
              var fname = item.name.substring(item.name.lastIndexOf('.'));
              if (validExts.indexOf(fname) < 0) {
                alertify.error("Invalid file selected, valid files are of " +
                         validExts.toString() + " types.");
                return false;
              }
              else return this.queue.length < 10;
                  
            }
          });  
          uploader.filters.push({
              name: 'sizeFilter',
              fn: function(item /*{File|FileLikeObject}*/, options) {
                if(item.size >10485760 ){
                   alertify.error("Invalid file size must be less than 10 mb.",10);
                    return false;
                }
               else  return item.size <= 10485760 ;
              }   
          }) ;
          uploader.filters.push({
              name: 'numberFilter',
              fn: function(item /*{File|FileLikeObject}*/, options) {
                if (uploader.queue.length == 1) {
                    uploader.removeFromQueue(0);
                }
                return true ;
              }   
          }) ;
      	  
      	

	 	uploader.onSuccessItem = function(fileItem, response, status, headers) {
	           console.info('onSuccessItem',  response);
             alertify.notify('Successfully Uploaded', 'message', 10) ; 
             $("#linkView").show() ;
             $(".importView").hide() ;
             uploader.clearQueue() ;
             vm.title="" ; vm.author=""; vm.reference=""; vm.research=""; vm.edition="";vm.pdate="" ;
             $("#dialog").css({"max-width":"70%","margin-left":"15%"}) ;
             $timeout(function() {
                  validFields() ;
              }, 100);
     
	     };
	      
	 uploader.onErrorItem = function(fileItem, response, status, headers) {
	          console.log(response) ;

	            var errs=response.errors ;
	            if(errs.err){
	                alertify.error(errs.error,10); 
	            } 
	  };
    	 vm.triggerUpload=function(){
	           $("#uzone").click() ;
	     }
		$scope.references=null ;
		$scope.researches=null ;

		vm.loadReference=function(){
       vm.reference="" ;
			 return $timeout(function() {
                $scope.references =  $scope.references  || [
                  { name: 'Science Math A' },
                  { name: 'Science Math B' },
                  { name: 'Science Physique et Chimie' },
                  {name: 'Science de la Vie et de la Terre'}
                ];

          }, 650);
		}
		vm.loadResearch=function(){
       vm.research="" ;
			 return $timeout(function() {
                $scope.researches =  $scope.researches  || [
                  { name: 'Science Math A' },
                  { name: 'Science Math B' },
                  { name: 'Science Physique et Chimie' },
                  {name: 'Science de la Vie et de la Terre'}
                ];

          }, 650);
		}

		vm.logout = function(e) {
        	e.preventDefault() ;
     		$auth.logout().then(function() {  
           		localStorage.removeItem('userId');
           		localStorage.removeItem('satellizer_token');
		        $state.go('home') ;
		        return false ;
	    	});
  	 	 };
    }
   

})();


