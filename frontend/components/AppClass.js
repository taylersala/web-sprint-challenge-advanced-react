import React, { Component } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;
const initialMoveMsg = '';
const emailValid = true;

class AppFunctional extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      moveMsg: initialMoveMsg,
    };
  }

  getXY() {
    const { index } = this.state;
    let x = (index % 3) + 1;
    let y;

    if (index < 3) y = 1;
    else if (index >= 3 && index < 6) y = 2;
    else if (index >= 6 && index < 9) y = 3;

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
      steps: initialSteps,
      index: initialIndex,
      moveMsg: initialMoveMsg,
    });
    this.updateMessage();
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

  move(evt) {
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState({
        index: nextIndex,
        steps: this.state.steps + 1,
        message: initialMessage,
      });
      this.updateMessage();
      this.setState({ moveMsg: initialMoveMsg });
    } else {
      this.setState({
        moveMsg: `You can't go ${direction}`,
        message: initialMessage,
      });
    }
  }

  updateMessage() {
    const message = this.getXYMessage();
    this.setState({ message });
  }

  onChange(evt) {
    const newEmail = evt.target.value;
    this.setState({ email: newEmail });
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { email, steps } = this.state;

    if (!email) {
      this.setState({ moveMsg: "Ouch: email is required" });
      return;
    }

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
      .then((response) => response.json())
      .then((data) => {
        console.log('res:', data);
        this.updateMessage();
      })
      .catch((error) => {
        console.error('Error w/ request:', error);
      });
  }

  gridMap() {
    const { index } = this.state;

    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
      <div
        key={idx}
        className={`square${idx === index ? ' active' : ''}`}
      >
        {idx === index ? 'B' : null}
      </div>
    ));
  }

  getMoveMessage() {
    const { steps } = this.state;
    return `You moved ${steps} ${steps === 1 ? 'time' : 'times'}`;
  }

  render() {
    const { className } = this.props;
    const { moveMsg, email } = this.state;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="steps">{this.getMoveMessage()}</h3>
          <h3 id="coordinates">{this.getXYMessage()}</h3>
        </div>
        <div id="grid">{this.gridMap()}</div>
        <div className="info">
          {moveMsg && <h3 id="message">{moveMsg}</h3>}
        </div>
        <div id="keypad">
          <button id="left" onClick={(evt) => this.move(evt)}>LEFT</button>
          <button id="up" onClick={(evt) => this.move(evt)}>UP</button>
          <button id="right" onClick={(evt) => this.move(evt)}>RIGHT</button>
          <button id="down" onClick={(evt) => this.move(evt)}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={(evt) => this.onSubmit(evt)}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            onChange={(evt) => this.onChange(evt)}
            value={email}
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}

export default AppFunctional;
