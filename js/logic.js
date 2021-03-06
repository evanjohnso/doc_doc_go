let apiKey = require('./../.env').apiKey;
import { CONSTANTS } from './../js/constants.js';

export let DocDoc = {
  getLatLon: (location, speciality) => {
    return new Promise( function(resolve, reject) {
      try {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode( { address: location }, function(results) {
          if (results.length == 0) {
            throw new Error(CONSTANTS.googleFail);
            // reject("Google's geocoder failed, the servers are down. We're all fucked.");
          }
          let lat = results[0].geometry.location.lat();
          let lng = results[0].geometry.location.lng();
          let coordinates = `${lat},${lng},15`;           //last parameter is the search radius
          sessionStorage.setItem(CONSTANTS.location, coordinates);
          //passing multiple arguments didn't work here..
          resolve(
          {
            coordinates: coordinates,
            speciality: speciality
          });
        });
      } catch (e) {
        console.log(e.message);
      }
    });
  },
  getDoctors: (previousPromise) => {
    console.log(previousPromise.speciality);
    console.log(previousPromise.coordinates);
    const url = CONSTANTS.baseURL + '/doctors';
    // https://api.betterdoctor.com/2016-03-01/doctors
    return new Promise( function(resolve, reject) {
      $.ajax( {
        url: url,
        method: "GET",
        data: {
          speciality_uid: previousPromise.speciality,
          location: previousPromise.coordinates,
          sort: 'distance-asc',
          skip: 0,
          limit: '15',
          user_key: apiKey
        },
        dataType: 'json',
        success: function(responseObject) {
          try {
            let scrubbedInfo = responseObject.data.map( function(doctor) {
              return {
                first: doctor.profile.first_name,
                last: doctor.profile.last_name,
                title: doctor.profile.title,
                speciality: doctor.specialties[0].name,
                picture: doctor.profile.image_url,
                website: doctor.practices.website,
                bio: doctor.profile.bio,
                uid: doctor.uid
              };
            });
            resolve(scrubbedInfo);
          } catch (e) {
            console.log(e.message);
          }
        },
        error: function(error) {
          reject("Request for specific doctors failed, our bad");
        }
      });
    });
  },
   getSpeciality: () => {
     const url = CONSTANTS.baseURL + '/specialties';
    //  `https://api.betterdoctor.com/2016-03-01/specialties`
      return new Promise( function(resolve, reject) {
      $.ajax( {
        url: url,
        method: "GET",
        data: {
          limit: 50,
          user_key: apiKey,
        },
        dataType: 'json',
        success: function(responseObject) {
          resolve(responseObject);
        },
        error: function(error) {
          reject("Request for medical specialties failed, our bad");
        }
      });
    });
  },
  callDoctor: (uid) => {
    const url = CONSTANTS.baseURL + `/doctors/${uid}`;
    // https://api.betterdoctor.com/2016-03-01/doctors/${uid}
    return new Promise( function(resolve, reject) {
      $.ajax( {
        url: url,
        method: "GET",
        data: {
          user_key: apiKey
        },
        dataType: 'json',
        success: function(doctorInfo) {
          resolve(doctorInfo.data);
        },
        error: function (errorObject) {
          reject("There was an error accessing this doctor.");
        }

      });
    });
  }
};
