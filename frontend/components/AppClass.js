import React from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  // Helper function to calculate the coordinates based on the index
  constructor(props) {
    super(props);

    // Initialize the component's state with the initialState
    this.state = initialState;
  }

  
  getXY = () => {
    // It is not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  // Helper function to get the message displaying the coordinates
  getXYMessage = () => {
    // It is not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  // Helper function to reset all states to their initial values
  reset = () => {
    this.setState(initialState);
  };

  // Helper function to calculate the next index based on the movement direction
  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { index } = this.state;
    const gridMap = {
      left: -1,
      up: -3,
      right: 1,
      down: 3,
    };
    const nextIndex = index + (gridMap[direction] || 0);
    return nextIndex >= 0 && nextIndex <= 8 ? nextIndex : index;
  };

  // Event handler for the movement buttons
  move = (evt) => {
    const direction = evt.target.textContent.toUpperCase();
    const nextIndex = this.getNextIndex(direction);

    this.setState(
      (prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
      }),
      () => {
        this.updateMessage(); // After updating state, update the message
      }
    );
  };

  // Helper function to update the message displaying the coordinates
  updateMessage = () => {
    const message = this.getXYMessage();
    this.setState({ message });
  };

  // Event handler for the email input field
  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  // Event handler for the form submission
  onSubmit = (evt) => {
    evt.preventDefault();

    const { email, index, steps } = this.state;
    const { x, y } = this.getXY();

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
        this.reset(); // Reset the state after a successful submission
      })
      .catch((error) => {
        console.error('Error sending POST request:', error);
      });
  };

  render() {
    const { className } = this.props;
    const { index, message, steps } = this.state;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{message}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>
            LEFT
          </button>
          <button id="up" onClick={this.move}>
            UP
          </button>
          <button id="right" onClick={this.move}>
            RIGHT
          </button>
          <button id="down" onClick={this.move}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}
