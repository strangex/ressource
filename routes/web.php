<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});

Auth::routes() ;
/****/
Route::post('/authenticate', 'AuthenticateController@authenticate');
Route::get('/authenticate', 'AuthenticateController@getAuthenticatedUser');
/****/
Route::post('/register', 'UserController@register');
//Route::post('/reset', 'Auth\ForgotPasswordController@getResetToken');
/****/
Route::post('/registerR', 'RessourcesController@register');
Route::get('/ressource', 'RessourcesController@getRessources');
Route::get('/download/{name}', 'RessourcesController@getArticle');

/*******/
/*$this->post('/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
//$this->get('reset/{token}', 'Auth\ResetPasswordController@showResetForm');
$this->post('reset', 'Auth\ResetPasswordController@reset');*/

//route('password.email')
/*
  Route::get('password/reset', 'ForgotPasswordController@showLinkRequestForm')->name('password.reset');
    Route::post('password/email', 'ForgotPasswordController@sendResetLinkEmail')->name('password.email');

    Route::get('password/reset/{token}', 'ResetPasswordController@showResetForm')->name('password.reset.token');
    Route::post('password/reset', 'ResetPasswordController@reset');
 */