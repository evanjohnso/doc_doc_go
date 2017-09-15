import { DocDoc } from './../js/logic.js';

$(document).ready(function() {
alert('doc loaded');
  $("#userInput").submit(function(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    alert('form submit');
    let location = $('input[name="userInputLocation"]').val();
    let condition = $('input[name="userInputCondition"]').val();
    console.log(location);
    console.log(condition);
    $('input').val('');
    DocDoc.homies();
  });

});
