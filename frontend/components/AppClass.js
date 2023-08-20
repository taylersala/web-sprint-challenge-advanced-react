import React, { Component } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;
//const initialMoveMsg = '';
const emailValid = true;

class AppClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      isEmailValid: emailValid,
    };
  }

  getXY() {
    let x = (this.state.index % 3) + 1;
    let y;
    if (this.state.index < 3) y = 1;
    else if (this.state.index >= 3 && this.state.index < 6) y = 2;
    else if (this.state.index >= 6 && this.state.index < 9) y = 3;
    return [x, y];
  }

  getXYMessage() {
    const [x, y] = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset() {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  }

  getNextIndex(direction) {
    const { index } = this.state;

    switch (direction) {
      case 'up':
        return index < 3 ? index : index - 3;
      case 'down':
        return index > 5 ? index : index + 3;
      case 'left':
        return index % 3 === 0 ? index : index - 1;
      case 'right':
        return (index - 2) % 3 === 0 ? index : index + 1;
      default:
        return index;
    }
  }

  move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
        message: initialMessage,
      }));
    } else {
      this.setState({ message: `You can't go ${direction}` });
    }
  };

  updateMessage() {
    const message = this.getXYMessage();
    this.setState({ message });
  }

  onChange = (evt) => {
    const newEmail = evt.target.value;
    this.setState({ email: newEmail });
    // this.isEmailValid(this.validateEmail(newEmail));
  };

  validateEmail(email) {
    return true; // TODO: actually validate!
  }

  onSubmit = (evt) => {
    evt.preventDefault();

    if (!this.state.email) {
      this.setState({ message: 'Ouch: email is required' });
      return;
    }

    this.setState({ email: initialEmail });

    const [x, y] = this.getXY();

    const payload = {
      x,
      y,
      steps: this.state.steps,
      email: this.state.email,
    };

    console.log(payload);

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
        this.setState({ message: data.message });
      })
      .catch((error) => {
        console.error('Error w/ request:', error);
      });
  };

  gridMap() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
      <div
        key={idx}
        className={`square${idx === this.state.index ? ' active' : ''}`}
      >
        {idx === this.state.index ? 'B' : null}
      </div>
    ));
  }

  getMoveMessage() {
    const { steps } = this.state;
    if (steps === 1) {
      return `You moved ${steps} time`;
    } else {
      return `You moved ${steps} times`;
    }
  }

  render() {
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="steps">{this.getMoveMessage()}</h3>
          <h3 id="coordinates">{this.getXYMessage()}</h3>
        </div>
        <div id="grid">{this.gridMap()}</div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
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
          <button id="reset" onClick={() => this.reset()}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            onChange={this.onChange}
            value={this.state.email}
          />
          <button id="submit" type="submit">
            Submit NOW
          </button>
        </form>
      </div>
    );
  }
}

export default AppClass;
