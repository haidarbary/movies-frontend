import React from "react";
import { Audio } from 'react-loader-spinner'

function Loading(props) {
  return (
    <div>
      <Audio
        height="200"
        width="200"
        radius="9"
        color="blue"
        ariaLabel="Fetching Bubble"
        aria-busy="true"      
        wrapperStyle
        wrapperClass
      />      
    </div>
  );
}

export default Loading;
