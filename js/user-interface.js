var apiKey = require('./../.env').apiKey;

$(document).ready(function() {
promiseOne()
  .then(displayDropdown)              //displayDropdown callback function
  .catch(function(errorObject) {      //catch any rejections of promises
    alert(errorObject);
  });
  $("#userInput").submit(function(evt) {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    let location = $('input[name="userInputLocation"]').val();
    let condition = $('input[name="userInputCondition"]').val();
    $('input').val('');


  });





  function displayDropdown(jsonArray) {
      //split by dashes, join by spaces,
      //uppercase first letter
      let sorted = jsonArray.data.map( function(element) {
        let changing = element.uid.split('-').join(' ');
        return changing.toString().charAt(0).toUpperCase() + changing.toString().slice(1);
      });
      //alpha sort and append list options
      sorted.sort();
      sorted.forEach(function(element) {
        $('select[name="specialty"]').append(`<option value="${element}">${element}</option>`);
    });
  }
  function promiseOne() {
      return new Promise( function(resolve, reject) {
      $.ajax( {
        url: `https://api.betterdoctor.com/2016-03-01/specialties?limit=100&user_key=${apiKey}`,
        type: "GET",
        data: {
          format: 'json'
        },
        success: function(responseObject) {
          resolve(responseObject);
        },
        error: function(error) {
          reject("API request for physician specialties failed, our bad");
        }
      });
    });
  }
});
