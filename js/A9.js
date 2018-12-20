/*
File: /~vini0709/A9/js/A9.js
91.461 GUI Programming I  Assignment# 9: Implementing a Bit of Scrabble with Drag-and-Drop
Vinishaben Patel, Umass Lowell Computer Science, Vinishaben_Patel@student.uml.edu
Copyright (c) 2018 by Vinishaben Patel. All rights reserved.
updated by VP on December 19, 2018 at 10:00 PM
Description: implementation scrabble game using drag and drog UI widgets
*/

"use strict";
/* from assignment help file */
var pieces = [
  {"letter":"A", "value":1,  "amount":9},
  {"letter":"B", "value":3,  "amount":2},
  {"letter":"C", "value":3,  "amount":2},
  {"letter":"D", "value":2,  "amount":4},
  {"letter":"E", "value":1,  "amount":12},
  {"letter":"F", "value":4,  "amount":2},
  {"letter":"G", "value":2,  "amount":3},
  {"letter":"H", "value":4,  "amount":2},
  {"letter":"I", "value":1,  "amount":9},
  {"letter":"J", "value":8,  "amount":1},
  {"letter":"K", "value":5,  "amount":1},
  {"letter":"L", "value":1,  "amount":4},
  {"letter":"M", "value":3,  "amount":2},
  {"letter":"N", "value":1,  "amount":6},
  {"letter":"O", "value":1,  "amount":8},
  {"letter":"P", "value":3,  "amount":2},
  {"letter":"Q", "value":10, "amount":1},
  {"letter":"R", "value":1,  "amount":6},
  {"letter":"S", "value":1,  "amount":4},
  {"letter":"T", "value":1,  "amount":6},
  {"letter":"U", "value":1,  "amount":4},
  {"letter":"V", "value":4,  "amount":2},
  {"letter":"W", "value":4,  "amount":2},
  {"letter":"X", "value":8,  "amount":1},
  {"letter":"Y", "value":4,  "amount":2},
  {"letter":"Z", "value":10, "amount":1},
  {"letter":"Blank", "value":0,  "amount":2}
];

var words = new Array(8);
var current = 0;
var tilecount = 0;
var TOTAL;
var bool = false;

$(document).ready(function () {
  Create_Board(); //random tiles
  Drag_Drop(); //draggables and droppables
  update_Word(words); // change
});

function Create_Board() {

  var letter;
  var rand;
  var remaining = 7 - current;

  // Save_Word();
  //seven tiles
  for (var i = 0; i < remaining; i++) {
    rand = Math.floor((Math.random() * 25));      //random number
    letter = pieces[rand].letter;
    $("#holder").append(" <img id=\"" + letter + "\" class=\"rack\" src=\"images/" + letter + ".jpg\">")
    current++;
  }
  Drag_Drop();
}


function Drag_Drop() {
  //allow the tiles to be dropped on the rack
  $("#holder").droppable({accept: '.rack', out: Letters});

  function Letters(event, ui) {
    current--;
  }

  //makes letters draggable and if not a valid droppable then revert
  $(".rack").draggable({snap: ".block", snapMode: "inner", revert: 'invalid'});

  function Drag(event, ui) {
    if (ui.draggable.attr("id") == words[$(this).attr("id")]) {
      //remove tile from board
      words[$(this).attr("id")] = ""; //make it blank
      tilecount--;
    }
    update_Word(words);
  }

  //blocks can be drag back onto the board
  $(".block").droppable({accept: '.rack', drop: Drop, out: Drag});

  //when a tile is dropped
  function Drop(event, ui) {
    var letter = ui.draggable.prop('id');          //assign id to letter
    var element = $(this).attr("id");              // assign id to element
    var number = parseInt(element);
    tilecount++;
    if (typeof words[number - 1] === 'undefined' && typeof words[number + 1] === 'undefined' && tilecount < 1) {
      ui.draggable.draggable({revert: true});
    } else {
      words[number] = letter;
      update_Word(words);
    }


  }
}

// updates word
function update_Word(words) {
  var current_word = "";
  for (var i = 0; i < words.length; i++) {
    if (typeof words[i] === 'undefined') {

    } else {
      current_word += words[i];
    }
  }
  if (words) {
    document.getElementById('word').innerHTML = current_word;
    update_Score(words);
  }
  //submit();
}

function submit(){

  find_word();
  var submitted = document.getElementById('word').innerHTML;
  submitted = submitted.toLowerCase();
  if ( dict[submitted] ) {
    bool = true;
  }else{
    bool = false;
  }

}

function update_Score(words) {
  var total = 0;
  var add = 0;
  var dw = 0;
  //look through the array
  for (var i = 0; i < words.length; i++) {
    //find the letter
    for (var j = 0; j < pieces.length; j++) {
      //if it's here
      console.log(words[i]);
      if (words[i] != "" && (words[i] == pieces[j].letter)) {
        //if i == 2 double letter score
        if (i == 2) {
          add = pieces[j].value * 2;
          total = total +  add;
        }if (i == 5) {
          dw++;
          add = pieces[j].value;
          total = total + add;
        }if(i!=2 && i != 5){
          total = total + pieces[j].value;
        }
      }
    }
  }
  if(dw!=0)
  {
    total = total * 2;
  }

  document.getElementById('score').innerHTML = total.toString();
  document.getElementById("score").style.color = "white";
}

function reset_tiles() {
  if(bool === true) {
    TOTAL += parseInt(document.getElementById('score').innerHTML);
    document.getElementById('total').innerHTML = "Total score: " + TOTAL;
    //   restart();
  }
  restart();
}

function restart(){
  var letter;
  var rand;
  var add  = 7;
  var string ="";

  current = 7;

  for(var i =0; i< words.length;i++)
  {
    words[i]="";
  }

  for(var i = 0; i < 7; i++)
  {
    rand = Math.floor((Math.random() * 25));      //random number 1-25
    letter = pieces[rand].letter;                 //letter at random number
    string = string + (" <img id=\""+ letter + "\" class=\"rack\" src=\"images/" + letter + ".jpg\">");
  }

  document.getElementById('holder').innerHTML = string;
  Drag_Drop();
  document.getElementById('score').innerHTML = " ";
  document.getElementById('word').innerHTML = " ";
  document.getElementById('message').innerHTML = " ";
}

function next_word() {
  restart();
  document.getElementById('totalscore').innerHTML = "";
}

var dict = {};

// Do a jQuery Ajax request for the text dictionary
$.get( 'dist/dictionary.txt', function( txt ) {
  // Get an array of all the words
  var words = txt.split( "\n" );

  // And add them as properties to the dictionary lookup
  for ( var i = 0; i < words.length; i++ ) {
    dict[ words[i] ] = true;

  }
});

function find_word( words ) {
  // if in the dictionary
  if ( dict[ words ] ) {
    return words;
  }
  //not in the dictionary.
  return "_____";
}
