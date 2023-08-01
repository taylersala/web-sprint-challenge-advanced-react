import React, {useState} from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.

    let x = (index % 3) + 1
    let y = Math.floor(index / 3) + 1;
    return { x, y }
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY();
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

  // function getNextIndex(state, direction) {
  //   // This helper takes a direction ("left", "up", etc) and calculates what the next index
  //   // of the "B" would be. If the move is impossible because we are at the edge of the grid,
  //   // this helper should return the current index unchanged.
  //   const { index } = state;
  //   const gridMap = {
  //     left: -1,
  //     up: -3,
  //     right: 1,
  //     down: 3,
  //   };
  // const nextIndex = index + (gridMap[direction] || 0);
  // console.log("Current index:", index);
  // console.log("Direction:", direction);
  // console.log("Calculated nextIndex:", nextIndex);
  // return nextIndex >= 0 && nextIndex <= 8 ? nextIndex : index;
  // }

  function getNextIndex(state, direction) {
  const { index } = state;
  const gridMap = {
    left: -1,
    up: -3,
    right: 1,
    down: 3,
  };
  const nextIndex = index + (gridMap[direction] || 0);

  if (nextIndex >= 0 && nextIndex <= 8) {
    return nextIndex;
  } else {
    
    return index;
  }
}
  

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.textContent.toUpperCase();
  const nextIndex = getNextIndex({ index }, direction);

  // Checking if my next index is within  range
  if (nextIndex >= 0 && nextIndex <= 8) {
    setIndex(nextIndex);
    setSteps((prevSteps) => prevSteps + 1);
    setMessage(''); 
    updateMessage();
  } else {
    // for npm test
    setMessage(`You can't go ${direction}`);
  }
}

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
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Server response:', data);
        reset(); // Reset the state after a successful submission
      })
      .catch((error) => {
        console.error('Error sending POST request:', error);
      });
  
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{message}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
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
