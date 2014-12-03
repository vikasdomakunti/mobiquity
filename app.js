/**
 * Author : Vikas Domakunti
 * Date : 12-03-2014
 *
 */


var app = angular.module('calendar', []);

var date = null;

app.controller('MainCtrl', function($scope) {
    // Conditional boolean variables to control the display
    $scope.eventShow = true;
    $scope.eventsAvailable = false;

    // Variable to retrieve user input for event entry and pass it as resource in API
    $scope.event = {};

    //Varibale to list the events on a particular date
    $scope.events = [];

    //Bootstrap function used for the datepicker and setting the format of the datepicker.
    date = $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true,
        todayBtn: true
    });


    // Function to insert a event to the user calendar using Google  calendar API.
    $scope.insertFn = function(event) {

        // Web application ID, apiKey and scope for the OAuth for the API request to read/write function .
        var clientId = "873419949212-sj00s3h6o00gdud14d0ptsi1s566557f.apps.googleusercontent.com";

        var apiKey = "AIzaSyAbaRj-kePCoIoOPYXTKV5Z0xa0TUGmCXs";

        var scopes = "https://www.googleapis.com/auth/calendar";

        //Setting the APIKey .
        gapi.client.setApiKey(apiKey);
        window.setTimeout(auth, 1);

        // Function triggered after the timeout.
        function auth() {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: true
            }, handleAuthResult);
        }



        //Function invoked in callback when Authorization is succesfull .
        function handleAuthResult(authResult) {
            if (authResult) {
                // Access token has been successfully retrieved, requests can be sent to the API
                makeApiCall();

            } else {
                // No access token could be retrieved, alerting the user.
                alert("Authorization failed");
            }
        }

        //Call to the calendar.events.insert API 
        function makeApiCall() {
            gapi.client.load('calendar', 'v3', function() {
                var request = gapi.client.calendar.events.insert({
                    'calendarId': 'vdomakunti@gmail.com',
                    'resource': $scope.event
                });
                request.execute(function(resp) {
                    $scope.event = {};
                    $scope.eventShow = true;

                    console.log(resp);


                });
            });
        }



    }


    //Function to toggle the div elements on the HTML .
    $scope.reset = function(event) {
        $scope.eventShow = true;
        $scope.eventsAvailable = false;
    }

    $scope.eventAdd = function() {
        $scope.eventShow = false;

    }


    //Function invokation when ever there is change in the date.
    $('.datepicker').datepicker().on('changeDate', function(e) {

        //AJAX call to retrieve events list from the Google calendar.
        $scope.$digest();
        $.ajax({
            url: "https://www.googleapis.com/calendar/v3/calendars/vdomakunti%40gmail.com/events",
            data: {
                key: "AIzaSyAbaRj-kePCoIoOPYXTKV5Z0xa0TUGmCXs"
            },
            contentType: "application/json",
            type: "GET",

            //Success callback function to set the values and assign.
            success: function(response) {
                $scope.events = [];
                if (response.items) {
                    $scope.eventsAvailable = true;
                } else if (!response.items) {
                    console.log("false");
                    $scope.eventsAvailable = false;
                }
                $scope.$digest();
                responseFilter(response);
            },
            error: function(xhr) {

            }
        });

    });


    // Function used to filter the events from list to a specific date.
    var responseFilter = function(response) {
        var eventList = response.items;


        var selectDate = $('.datepicker').datepicker('getDate');
        for (var i = 0; i < eventList.length; i++) {

            //Checking which value pair is available date or dateTime in the event.
            if (eventList[i].start.date) {
                var itr = new Date(Date.parse(eventList[i].start.date));
            } else if (eventList[i].start.dateTime) {
                var itr = new Date(Date.parse(eventList[i].start.dateTime));
            }


            //Checking wheather date is same as required date.
            if (selectDate.getFullYear() == itr.getFullYear() && selectDate.getDate() == itr.getDate() && selectDate.getDay() == itr.getDay()) {
                $scope.events.push({
                    start: eventList[i].start.dateTime ? new Date(Date.parse(eventList[i].start.dateTime)).toLocaleString() : new Date(Date.parse(eventList[i].start.date)).toLocaleString(),
                    end: eventList[i].end.dateTime ? new Date(Date.parse(eventList[i].end.dateTime)).toLocaleString() : new Date(Date.parse(eventList[i].end.date)).toLocaleString(),
                    summary: eventList[i].summary
                });
                $scope.$digest();
            }


        }


    };
});
