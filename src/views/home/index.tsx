import React from 'react';
import './Home.scss';
import {
  Link
} from "react-router-dom";


function Home() {
  return (
    <div className="home">
      home
      <Link to="/login">go to login</Link>
    </div>
  );
}

export default Home;
