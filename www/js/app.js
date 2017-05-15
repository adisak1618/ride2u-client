// Initialize app
console.log('hi');
var myApp = new Framework7();
var $$ = Dom7;
var $$$ = Framework7.$;
//map
var factory = {};
var activitymap;
var base_url = "http://128.199.151.123:8080/";

console.log(localStorage.getItem('token'));

//add token to url
// $$('#add_form.ajax-submit').on('beforeSubmit', function (e) {
//   var activityvalidurl = base_url+"api/activity?token="+Cookies.get('token');
//   console.log(activityvalidurl);
//   $$('#add_form.ajax-submit').prop('action', activityvalidurl);
//   console.log($$('#add_form.ajax-submit').prop('action'));
// });

//Hide Toolbar in login page


$$(document).on('pageInit', function (e) {
  // Do something here when page loaded and initialized
  console.log("PAGE");
})

//logout
$$('.logout').click(function (e) {
  // Do something here when page loaded and initialized
  factory.logout();
})
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true,
  domCache: true
});

var recordView = myApp.addView('#Record', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var profile = myApp.addView('.view-profile', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  domCache: true ,
  dynamicNavbar: true
});
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(device.cordova);

    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    // var onSuccess = function(position) {
    //
    //     var location_text = 'Latitude: '          + position.coords.latitude          + '<br/>\n' +
    //           'Longitude: '         + position.coords.longitude         + '<br/>\n' +
    //           'Altitude: '          + position.coords.altitude          + '<br/>\n' +
    //           'Accuracy: '          + position.coords.accuracy          + '<br/>\n' +
    //           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br/>\n' +
    //           'Heading: '           + position.coords.heading           + '<br/>\n' +
    //           'Speed: '             + position.coords.speed             + '<br/>\n' +
    //           'Timestamp: '         + position.timestamp                + '<br/>\n';
    //
    //
    //
    // };
    //
    //
    // // onError Callback receives a PositionError object
    // function onError(error) {
    //     alert('code: '    + error.code    + '\n' +
    //           'message: ' + error.message + '\n');
    // }
    // navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // var watchID = navigator.geolocation.watchPosition(onSuccess, onError);

}





// on mappicker popup start

$$('.popup-map').on('open', function () {
  factory.mappicker();
});



// Detect file input support
var isFileInputSupported = (function () {
 // Handle devices which falsely report support
 if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
   return false;
 }
 // Create test element
 var el = document.createElement("input");
 el.type = "file";
 return !el.disabled;
})();

// Add 'fileinput' class to html element if supported
if (isFileInputSupported) {
 document.documentElement.className += " fileinput";
}

//pop-up modal add when click button
$$('#selected_map_button').click(function(){
  myApp.popup('.popup-map');
});
//on select button has been click
$$('#mappickerbutton').click(function(e){
  console.log($$('input[name="location"]').val());
  select_location = map.getCenter().lat()+","+map.getCenter().lng();
  console.log(select_location);

  $$("input[name='location']").val(select_location);
  myApp.closeModal('.popup-map');
  factory.selectedmap(map.getCenter().lat(),map.getCenter().lng());
//(6.384900740623628, 99.78931707763672)

  geocoder.geocode({'location': map.getCenter()},function(results, status){
          if (status === google.maps.GeocoderStatus.OK) {
            console.log(results);

          }else{
            console.log('no results');
            return false;
          }
        });
  e.preventDefault();
});






$$("#login-form").submit(function(e){
  e.preventDefault();

  var formData = myApp.formToJSON('#login-form');
  //alert(JSON.stringify(formData));
  console.log(formData);
  $$.ajax({
    url:base_url+"api/authen/login",
    method:'POST',
    dataType:'json',
    data:formData,
    success:function(data, status, xhr){
      console.log(data);

      if(data.code == 0){
        $$('#login-modal .error-message span').html(data.message).css('display', 'inline');
        setTimeout(function(){ $$('#login-modal .error-message span').hide(); }, 3000);
      }else if(data.code == 200){
        console.log(data);
        console.log("user id "+data._id);
        // Cookies.set('token', data.token, { expires: 1, path: '' });
        // Cookies.set('name', data.name, { expires: 1, path: '' });
        // Cookies.set('email', data.email, { expires: 1, path: '' });
        // Cookies.set('id', data._id, { expires: 1, path: '' });
        localStorage.setItem('token',data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', data.email);
        localStorage.setItem('id', data._id);
        factory.isLogin();
      }else{
        $$('#login-modal .error-message span').html("Unknow error!!!").css('display', 'inline');
      }

    }
  });

});

$$("#signup-form").submit(function(e){
  e.preventDefault();

  var formData = myApp.formToJSON('#signup-form');
  //alert(JSON.stringify(formData));
  console.log(formData);
  $$.ajax({
    url:base_url+"api/authen/signup",
    method:'POST',
    dataType:'json',
    data:formData,
    success:function(data, status, xhr){
      console.log(data);


        $$('#login-modal .error-message span').html('signup success!').css('display', 'inline');
        setTimeout(function(){ $$('#login-modal .error-message span').hide(); }, 3000);


    },
    error: function(e){
      $$('#login-modal .error-message span').html('signup fail').css('display', 'inline');
      setTimeout(function(){ $$('#login-modal .error-message span').hide(); }, 3000);
    }
  });

});




 factory = {
  selectedmap: function(lat,lng){

    $$('#selected_map').show();
    selected_map = new google.maps.Map(document.getElementById('selected_map'), {
      center: {lat: lat, lng: lng},
      zoom: 12,
      scaleControl: false,
      disableDefaultUI: true,
    });
  },
  mappicker:function(){

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 13.689609718442133, lng: 460.54022831344605},
      zoom: 8
    });
  },
  activityMap:function(){
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 13.689609718442133, lng: 460.54022831344605},
      zoom: 8
    });
  },

  isLogin: function (){
      if(localStorage.getItem('token') && localStorage.getItem('name') && localStorage.getItem('email')){
        myApp.closeModal();
        return true;
      }else{
        myApp.loginScreen()
        return false;
      }
  },
  logout: function(){
    localStorage.removeItem('token', { path: '' });
    localStorage.removeItem('name', { path: '' });
    localStorage.removeItem('email', { path: '' });
    localStorage.removeItem('id', { path: '' });
    this.isLogin();
  }
}
factory.isLogin();

$('#signupbutton').click(function(){
    $('#signup-contianer').show();
    $('#login-contianer').hide();
});

$('#signupbuttonsubmit').click(function(){
    $('#signup-contianer').hide();
    $('#login-contianer').show();
});

// $('#inserimagefile').click(function(){
//     navigator.camera.getPicture(
//       function(imageData){
//         console.log("on success");
//         console.log(imageData);
//         $('#inserimagefile').attr('src',imageData);
//
//       },
//       function(){
//         console.log("on error");
//     },{
//
//     sourceType: 0
//     });
// });
