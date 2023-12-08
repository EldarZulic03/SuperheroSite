import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  

  const router = useRouter();
  
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
            router.push('/');
        }).catch((err) => alert(err));

    // console.log(`Username: ${username}, Password: ${password}`);
  }
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const resendEmail = (event) => {
    event.preventDefault();
    fetch('/superheroes/resend-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
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
            alert('Email Sent!');
        }).catch((err) => alert(err));


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
      <button type='button' onClick={resendEmail}>Resend Verification Email</button>
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

