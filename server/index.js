const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors())



//If an account with the matching userName exists then return an account object. Otherwise return -1
const getUserAccount = (userName) => {
  if(!fs.existsSync('accounts.txt')) return -1;
  let content = fs.readFileSync('accounts.txt', { encoding: 'utf8', flag: 'r' });
  if (content === '') return -1;
  let accountArray = content.split('\n');
  let accounts = [];
  for (let account of accountArray) {
    let accountTemp = account.split(',');
    let accountObj = { userName: accountTemp[0], password: accountTemp[1] };
    accounts.push(accountObj);
  }
  let accountIndex = accounts.findIndex((account) => { return account.userName === userName });
  if (accountIndex !== -1) {
    return accounts[accountIndex];
  } else {
    return -1;
  }
}

//Given a user name and password create a hash and store it in the accounts file. Return status message if successful.
//Return error message otherwise.
const createUserAccount = (userName, password) => {
  const saltRounds = 10;
  let hash = bcrypt.hashSync(password, saltRounds);
  console.log(getUserAccount(userName));

  if (!fs.existsSync('accounts.txt')) {
    fs.writeFile('accounts.txt', `${userName},${hash}\n`, (err) => {
      if (err) throw err;
      return `Successfully created account for ${userName}`;
    })
  } else if (getUserAccount(userName) !== -1) {
    return `User: '${userName}' already exists. Please login or enter a different username.`
  } else{
    fs.appendFileSync('accounts.txt', `${userName},${hash}\n`);
    return `Successfully created account for ${userName}`;
  }
}

//Given a userName and password check if user exists and if it does then compare passwords. Returns an authentication obj with
//authorization result and message
const authenticateUser = (userName, password, res) => {
  let userAccount = getUserAccount(userName);
  let resultObj = {auth: false, message: ''};

  if(userAccount === -1){
    resultObj.message = `No account found for '${userName}'. Please register first. `
  } else if (!bcrypt.compareSync(password, userAccount.password)){
    resultObj.message = `Incorrect password. Please try again.`
  } else {
    resultObj.auth = true;
    resultObj.message = `User authenticated.`;
  }
  return resultObj;
}

app.post('/', (req, res) => {
  //Pull username and password out of request headers
  let userName = req.get('userName');
  let password = req.get('password');

  res.json(createUserAccount(userName, password));
})

app.get('/', (req, res) => {
  let userName = req.get('userName');
  let password = req.get('password');
  
  res.json(authenticateUser(userName, password, res))
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))