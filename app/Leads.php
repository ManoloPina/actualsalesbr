<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Leads extends Model {

	protected $table = 'leads';
  protected $fillable = ['nome', 'email', 'telefone', 'regiao', 'nascimento', 'score'];

}
