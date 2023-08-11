import React, {useState} from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
// let messageToDisplay = '';
const initialMoveMsg = '';

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [moveMsg, setMoveMsg] = useState(initialMoveMsg);

  
  

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.

    let x = (index % 3) + 1
    let y
    if (index < 3) y = 1
    else if (index >= 3 && index < 6) y = 2
    else if (index >= 6 && index < 9) y = 3
    return [ x, y ]
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const  [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
    updateMessage();
  }

// console.log("Current index:", index);
// console.log("Direction:", direction);
// console.log("Calculated nextIndex:", nextIndex);
  

function getNextIndex(direction) {
  switch (direction) {
    case 'up':
      return (index < 3) ? index : index - 3
    case 'down':
      return (index > 5) ? index : index + 3
    case 'left':
      return (index % 3 === 0) ? index : index - 1
    case 'right':
      return ((index - 2) % 3 === 0) ? index : index + 1
  }
}

  function move(evt) {
  const direction = evt.target.id;
  const nextIndex = getNextIndex(direction);

  
  // Checking if my next index is within the range
  if (nextIndex !== index) {
    setIndex(nextIndex);
    setSteps(steps + 1);
    setMessage(initialMessage);
    updateMessage();
    } else {
      setMoveMsg(`You can't go ${direction}`);
      setMessage(initialMessage);
    }
  
  }
  //  else {
  //  // setMessage(`You can't go ${direction}`);
  //   messageToDisplay = setMessage(`You can't go ${direction}`);
  //   console.log('message to display value: ', messageToDisplay)
  // }


// function updateMoveMessage() {
//   if (nextIndex !== index) {
//     setMessage(`You can't go ${direction}`);
//   }
// }
 

  function updateMessage(){
    const message = getXYMessage();
    setMessage(message);
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    const { x, y } = getXY();
  
    const payload = {
      x,
      y,
      steps,
      email,
    };
  
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('res:', data);
        updateMessage();
      })
      .catch((error) => {
        console.error('Error w/ request:', error);
      });
  }
  
function gridMap() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
      <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
        {idx === index ? 'B' : null}
      </div>
    ));
  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="steps">You moved {steps} times</h3>
        <h3 id="coordinates">{ getXYMessage() }</h3>
      </div>
      <div id="grid">{ gridMap() }</div>
      <div className="info">
      {moveMsg && <h3 id="message">{moveMsg}</h3>}
      </div>
      <div id="keypad"> 
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
