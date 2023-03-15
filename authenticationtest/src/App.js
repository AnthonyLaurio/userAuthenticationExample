import './App.css';
import React, { useState, useRef } from 'react';

function App() {
  const [auth, setAuth] = useState(false);
  const user = useRef({ userName: '', password: '' });
  const unregisteredUser = useRef({ userName: '', password: '' });

  const loginUser = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("userName", `${user.current.userName}`);
    myHeaders.append("password", `${user.current.password}`);

    fetch('http://localhost:3001', {
      method: "GET",
      headers: myHeaders
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json()
      })
      .then(data => {
        if (data.auth === false) {
          alert(data.message);
        } else {
          setAuth(true);
          console.log(data)
        }
      })
      .catch(errorMessage => { alert(errorMessage) });
  }

  const registerUser = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("userName", `${unregisteredUser.current.userName}`);
    myHeaders.append("password", `${unregisteredUser.current.password}`);

    fetch('http://localhost:3001', {
      method: "POST",
      headers: myHeaders
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('failed');
        }
        return response.json()
      })
      .then(data => {
        alert(data)
      })
      .catch(error => { console.log(error) })
  }
  return (
    <div className="App">
      <header className="App-header">
        <h2>Register a new user: </h2>
        <input type='text' onChange={(event) => { unregisteredUser.current.userName = event.target.value }} />
        <input type='text' onChange={(event) => { unregisteredUser.current.password = event.target.value }} />
        <button type='button' onClick={() => { registerUser() }}>Register</button>
        <h2>Login an exisiting user: </h2>
        <input type='text' onChange={(event) => { user.current.userName = event.target.value }} />
        <input type='text' onChange={(event) => { user.current.password = event.target.value }} />
        <button type='button' onClick={() => { loginUser() }}>Login</button>
        {auth ? <><h1>USER AUTHENTICATED</h1>
          <button type='button' onClick={() => { setAuth(false) }}>Logout</button></>
          : <h1>USER NOT AUTHENTICATED</h1>}
      </header>
    </div>
  );
}

export default App;
