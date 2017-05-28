<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Validator ;

class AuthenticateController extends Controller
{
     public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => 'authenticate']);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('username', 'password');
        $validator=$this->validator($credentials) ;
        if($validator->fails()){    
             $errors=$validator->errors();
             return response()->json(compact('errors'),405) ; 
        } 

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'username' =>'bail|required|min:8|max:25|alpha_num',
            'password' => 'bail|required|min:8|max:30',
        ]);
    
    }

    public function getAuthenticatedUser()
    {
        try {

            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }
        $user->flag=$user->flag ;
        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }
}
