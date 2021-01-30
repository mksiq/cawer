# CAWER
caw caw

### API in NodeJS / with DB in MongoDB
Hosted on [Heroku](https://cawer-msiqueira.herokuapp.com)

Authentication done using JWT.

### Integration tests by Jest.
For future feature create mocks for unit testing.

## Routes available
Content-type for routes: "application/x-www-form-urlencoded;charset=UTF-8"

### Users
* _POST_ /register-user for sign up . Expects fields as username, password, email, and alias.
* _POST_ /login for login. Expect fields as username and password. Returns token jwt.
* _GET_ /self to receive user information. Must receive token and returns user data.
* _GET_ /user/:id . Must receive token in headers. Expect id parameter and returns user information.
* _PUT_ /update-user update user information. Must receive token in headers, new user data in body and returns updated data.
* _DELETE_ /update-user update user information. Must receive token token in headers and returns updated data.

### Chats
* _GET_ /chats returns list of all chat logged user has. Must receive token token in headers.
* _GET_ /chats/:id returns a single chat that has both the user id and the user logged in. Must receive token token in headers.

### Messages
* _GET_ /messages/:id returns all messages linked to a chat id, user logged in must be part of that chat. Must receive token token in headers.
* _GET_ /messages/by-user/ must receive user name as req.query. Returns all messages in a chat that has both logged user and query username. Must receive token token in headers.
* _POST_ /messages/send sends a message. Sender is logged user in token and must receive req.query as user id to be the recipient and message itself as content field. returns updated message with time and id.
* _POST_ /messages/user/send sames as above but instead of req.query.id receives req.query.username so it is easier to send messages.

