import React from "react";
import ChartContainer from "./components/chart-container/chart-container";
import filterAndSort from "./helpers/filterAndSort";
import "./App.css";
import { PollResponse } from "./models/poll-response";
import { MapObject } from "./models/map-object";

export const App = () => {
  const [data, setData] = React.useState<MapObject>({});

  React.useEffect(() => {
    fetch("https://projects.fivethirtyeight.com/polls/polls.json")
      .then((data) => data.json())
      .then((json: PollResponse[]) => setData(filterAndSort(json)))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pollitical</h1>
        <p>Polling Info from FiveThirtyEight Over Time</p>
      </header>
      <ChartContainer data={data} />
    </div>
  );
};
