'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { redirect, useRouter } from 'next/navigation'

function page() {
  const { push } = useRouter();

  useEffect(() => {
     push('/coffee');
  }, []);
  return (
    <div className="App">
      {/* <h1>Hello world</h1>
      <Button type="primary" href='/admin'>Admin</Button>
      <Button href="/coffee"> User </Button> */}
    </div>
  )
}

export default page