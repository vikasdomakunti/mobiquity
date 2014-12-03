mobiquity
=========


Note: Please select date in the range of 12-01-2014 to 12-302014 for testing perpose.


Functionalities 
1. User selects the date required to list the event list on that date. 
> The selected date is used and ajax call is made to Google API to retrieve list and filter according to date selected
2. List out the events to particular hard coded google user
> The events are retrieved in the previous function using the ajax call setting the user. The events are displayed in the table form.
3. Here the user select addEvent function to insert event on user calendar on Google to specified date.
> A ClientID is created for web service to make API calls.
> The user credentials like clientID and APIKey for the API call is retrieved from the API dashboard .
> Authorization is made and OAuth token is retrieved from Google server and in the callback function API invoke function is called.
> The API call is made specifying version, calendarID and resource array Object is passed to the API call .

Errors.

API call is giving an error call "Unauthorized login" even after the API call to Google is authorized.
Tried to fix the error but could not figure it what is actually wrong with API call.


Author :Vikas Domakunti
