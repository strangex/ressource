<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User ;
use Validator ;
use Illuminate\Support\Facades\Password;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['register','reset']]);
    }

   

    public function register(Request $request){
    	

    	$credentials=$request->only('first_name','last_name','profession','email','username','password') ;
    	$validator=$this->validator($credentials) ;
		if($validator->fails()){    
	        $errors=$validator->errors();
	        return response()->json(compact('errors'),405) ; 
		}
        $users=User::select('email')->get() ;
        foreach($users as $user){
            $user->email=decrypt($user->email) ;
            if($user->email==$request->email) {
                 $errors=collect(["uEmail"=>"Email has already been taken!"]);
                return response()->json(compact('errors'),405) ; 
            }
        }
        $user=new User ;
		$user->first_name=encrypt($request->first_name) ;
		$user->last_name=encrypt($request->last_name) ;
		$user->profession=encrypt($request->profession) ;
		$user->email=encrypt($request->email) ;
		$user->username=$request->username ;
		$user->password=bcrypt($request->password) ;

		$user->save() ;

    }
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'first_name' =>'bail|required|min:3|max:25',
            'last_name' => 'bail|required|min:3|max:30',
            'profession' => 'bail|required|min:5|max:30',
            'email' => 'bail|required|email|min:8|max:30',
            'username' => 'bail|required|unique:users|min:6|max:30',
            'password' => 'bail|required|min:8|max:30'
        ]);
    
    }
    protected function emailValidator(array $data){
         return Validator::make($data, [
            'email' => 'bail|required|email|min:8|max:30'
        ]);
    }
}
