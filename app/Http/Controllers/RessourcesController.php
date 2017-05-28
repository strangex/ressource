<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Validator ;
use App\Ressource ;
use Storage ;


class RessourcesController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }
    public function getRessources(){  
    	return Ressource::all() ;

    }
     public function register(Request $request){  
     	$ressource=new Ressource ;
		$ressource->title=$request->title ;
		$ressource->edition=$request->edition ;
		$ressource->pub_date=$request->pub_date ;
		$ressource->research=$request->research ;
		$ressource->reference=$request->reference ;
		$ressource->author=$request->author ;
		$ressource->user_id=$request->user_id ;

     	
     	if(!$request->hasFile('file') && $request->link==null){
     		 $errors=collect(["error"=>"Link and article can't be empty!!"]);
             return response()->json(compact('errors'),405) ; 
     	}
    
		if($request->hasFile("file")){
			$path=Storage::disk('local')->putFile('articles', $request->file, 'private');
			$ressource->article=basename($path) ;
		}

		if($request->link){
			$ressource->link=$request->link ;
		}

		$ressource->save() ;
    }

    public function getArticle($name){
       return response()->download(storage_path('app/private/articles/'.$name));
    }
}
