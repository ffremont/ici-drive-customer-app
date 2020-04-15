import React from 'react';
import './Partner.scss';
import {
  useParams
} from "react-router-dom";


function Partner() {
  let { id } = useParams();
  console.log(id);

  return (
    <div className="partner">
      partner
    </div>
  );
}

export default Partner;
