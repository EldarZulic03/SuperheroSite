import React, { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle login logic here

    fetch('/superheroes/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            localStorage.setItem('token', data.token);
            alert('You have successfully logged in!');
            // redirect to home page
        })
        .catch((err) => console.log(err));

    console.log(`Username: ${username}, Password: ${password}`);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <label>
            Email:
            <input type="text" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

