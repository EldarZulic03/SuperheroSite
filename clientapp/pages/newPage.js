import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function NewPage() {
    
    const router = useRouter();
    useEffect(() => {

    

        const token = localStorage.getItem('token');

        fetch('/superheroes/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        })
        .then(response => {
            if(!response.ok){
                return response.json().then(data => {
                    throw new Error(`Error: ${data.error}`);
                })
            }})
        .then(data => {  
            alert('Authentication Successful!');
            console.log(data.message);
        })
        .catch(error => {
            console.log(error.message);
            alert('You must be logged in to view this page');
            router.push('/');
        });
    },[]);

  return (
    <div>
      <h2>New Page</h2>
    </div>
  );
}

