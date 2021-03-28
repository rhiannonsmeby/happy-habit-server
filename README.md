# Happy Habit Server

### Live App: 
### Client Repo: https://github.com/rhiannonsmeby/happy-habit

### Summary
The Happy Habit application helps users manage their feelings by providing a user-friendly interface for logging moods and coping exercises. 

### Technology Used
* Node.js
* Express
* PostgreSQL

### API Documentation
#### Base URL: 

#### Responses
This API returns json responses in the following format
```javascript
{
    "error": "message"
}
```

#### Endpoints
```javascript
/api/auth
```
The Auth endpoint is for verifying user details at login

```javascript
/api/user
```
The User endpoint is for user registration

```javascript
/api/entry
```
Returns the entries that are assigned to the user


#### Status codes
* 200 OK
* 201 CREATED
* 204 DELETED
* 400 BAD REQUEST
* 404 NOT FOUND
* 500 INTERNAL SERVER ERROR