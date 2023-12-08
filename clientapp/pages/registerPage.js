import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function  RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle register logic 

    fetch('/superheroes/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        })
        .then((res) => {
          if(!res.ok){
              return res.json().then((data) => {
                  throw new Error(data.error);
              })
          }
          return res.json();
      })
      .then((data) => {
          console.log(data);
          localStorage.setItem('token', data.token);
          alert('You have successfully Registered, Make Sure to Verify!');
          router.push('/');
      }).catch((err) => alert(err));

    console.log(`Username: ${username}, Password: ${password}`);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  
  return (
    <div>
      <h2>Register</h2>
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
      <Link href="/loginPage">
        <button type='button'>Already Have an Account? Login</button>
      </Link>
      <Link href="/">
        <button type='button'>Home</button>
        </Link>
    </div>
  );
}

