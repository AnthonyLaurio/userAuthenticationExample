# userAuthenticationExample
Steps to run: 
1. run npm install in both the server and authenticationTest directories.
2. start the server with 'nodemon index.js'
3. start the react-app with 'npm start'

The accounts database will be empty at first so you will need to create an account first.
After registering you can then login with your username and password.

Account information is stored in the accounts.txt file in the server.
Account passwords are hashed using bcrypt for safer storage.