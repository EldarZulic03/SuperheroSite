import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import { set } from 'mongoose';
import Link from 'next/link';



export default function Landing() {
  return (
    <>
      <Head>
        <title>Superhero Database</title>
        <meta charSet='utf=8'/>
        <meta name="description" content="Web app to showcase the REST Api I built along with the front and back-end frameworks" />
        <link rel="stylesheet" href="placeholder" />
      </Head>
      <main className={styles.main}>

        <Link href='/loginPage'>
          <button type="button">Login</button>
        </Link>
        <Link href='/index.html'>
            <button type="button">Guest Home Page</button>
        </Link>

      </main>
      </>
  )
}
