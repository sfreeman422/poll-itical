import React from "react";
import ChartContainer from "./components/chart-container/chart-container";
import filterAndSort from "./helpers/filterAndSort";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    fetch("https://projects.fivethirtyeight.com/polls/polls.json")
      .then(data => data.json())
      .then(json => {
        const sortedData = filterAndSort(json);
        this.setState({ data: sortedData });
      })
      .catch(e => console.error(e));
  }

  render() {
    console.log(this.state.data);
    return (
      <div className="App">
        <header className="App-header">
          <h1>Pollitical</h1>
          <p>Polling Info from FiveThirtyEight Over Time</p>
        </header>
        <ChartContainer data={this.state.data} />
      </div>
    );
  }
}

export default App;
