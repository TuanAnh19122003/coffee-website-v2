'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';

const Home = () => (
  <div className="App">
    <h1>Hello world</h1>
    <Button type="primary" href='/admin'>Admin</Button>
    <Button href="/coffee"> User </Button>
  </div>
);

export default Home;