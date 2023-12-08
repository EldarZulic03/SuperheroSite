import React, { useState } from 'react';
import Link from 'next/link';


export default function changePasswordPage2() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    fetch('/superheroes/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'), // send the token in the Authorization header
      },
      body: JSON.stringify({ email,password,newPassword }),
    })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.error);
        });
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      alert('Your password has been successfully changed!');
    })
    .catch((err) => alert(err));
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };
  
  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
            Email:
            <input type="text" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          Old Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <label>
          New Password:
          <input type="password" value={newPassword} onChange={handleNewPasswordChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <Link href="/">
        <button type='button'>Home</button>
        </Link>
    </div>
  );
}

