import React, { useState } from 'react';
import Link from 'next/link';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle login logic 

    fetch('/superheroes/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password }),
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
            alert('You have successfully logged in!');
            // redirect to home page
        }).catch((err) => alert(err));

    // console.log(`Username: ${username}, Password: ${password}`);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
      <Link href='/registerPage'>
        <button type='button'>Don't Have an Account? Register</button>
      </Link>
      <Link href="/">
        <button type='button'>Home</button>
        </Link>
        <Link href='/changePasswordPage'>
            <button type='button'>Change Password</button>
        </Link>
    </div>
  );
}

