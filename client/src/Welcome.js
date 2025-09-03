import React from 'react';

function Welcome(props) {
  return ( // What is displayed on the screen
    <div>
      <h1>Hello {props.name}!</h1>
      <p>Welcome to app TripPlannerClient.</p>
    </div>
  );
}
// Can import the component in other files
export default Welcome;
