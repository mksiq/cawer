# CAWER
caw caw

### API in NodeJS / with DB in MongoDB
Hosted on [Heroku](https://cawer-msiqueira.herokuapp.com)

Authentication done using JWT

### Integration tests by Jest.
For future feature create mocks for unit testing

## Routes available
Content-type for routes: "application/x-www-form-urlencoded;charset=UTF-8"
### Users
* /register-user for sign up . Expects fields as username, password, email, and alias
* /login for login. Expect fields as username and password. Returns token jwt
* /self for user information. Must receive token and returns user data
* /user/:id . Expect id parameter and returns
