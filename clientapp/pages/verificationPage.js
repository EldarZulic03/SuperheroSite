import React, { useState } from 'react';
import Link from 'next/link';


export default function VerificationPage() {
  return (
    <div>
      <h2>YOUR EMAIL HAS BEEN SUCCESSFULLY VERIFIED!</h2>
      <Link href="/">
        <button type='button'>Home</button>
        </Link>
    </div>
  );
}

