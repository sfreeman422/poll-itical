import React, { useEffect, useState } from "react";
import ChartContainer from "./components/chart-container/chart-container";
import filterAndSort from "./helpers/filterAndSort";
import "./app.css";
import { PollResponse } from "./models/poll-response";
import { MapObject } from "./models/map-object";
export interface ResultFilter {
  age: string;
}

export const App = () => {
  const [data, setData] = React.useState<MapObject>({});

  useEffect(() => {
    fetch("https://projects.fivethirtyeight.com/polls/polls.json")
      .then((data) => data.json())
      .then((json: PollResponse[]) => setData(filterAndSort(json)))
      .catch((e) => console.error(e));
  }, []);

  const [age, setAge] = useState("90");
  const [calcType, setCalcType] = useState("latest");

  const filter = { age };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pollitical</h1>
        <p>Polling Info from FiveThirtyEight Over Time</p>
        <div>
          Time Period:{" "}
          <select onChange={(e) => setAge(e.target.value)} value={age}>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
            <option value="120">120 Days</option>
            <option value="all">All Available Data</option>
          </select>
          <br />
          Calculation Type:{" "}
          <select
            onChange={(e) => setCalcType(e.target.value)}
            value={calcType}
          >
            <option value="average">Average</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </header>
      <div className="content">
        <ChartContainer data={data} filter={filter} calcType={calcType} />
      </div>
    </div>
  );
};
