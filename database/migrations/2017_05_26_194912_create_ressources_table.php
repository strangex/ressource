<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRessourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('ressources', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->unique();
            $table->string('author');
            $table->string('edition');
            $table->string('pub_date');
            $table->string('research');
            $table->string('link')->nullable();
            $table->string('article')->nullable();
            $table->string('reference');
            $table->unsignedInteger('user_id') ;
            $table->foreign('user_id')->references('id')->on('users');

            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ressources');
    }
}
