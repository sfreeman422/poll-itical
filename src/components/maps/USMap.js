import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";

import { electoralVotes } from "./data/electoralvotes";
import allStates from "./data/allstates.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21],
};

const getColor = (state, data) => {
  let color = "#DDD";
  if (data[state]) {
    const latestResult = data[state][data[state].length - 1].answers;
    let winnerScore = 0;
    for (let i = 0; i < latestResult.length; i++) {
      if (
        latestResult[i].choice.toLowerCase() === "biden" &&
        +latestResult[i].pct > winnerScore
      ) {
        winnerScore = +latestResult[i].pct;
        color = "blue";
      } else if (
        latestResult[i].choice.toLowerCase() === "trump" &&
        +latestResult[i].pct > winnerScore
      ) {
        winnerScore = +latestResult[i].pct;
        color = "red";
      }
    }
  }
  return color;
};

const getElectoralVotes = (data, candidate) => {
  let votes = 0;
  let winner;
  Object.keys(electoralVotes).forEach((key) => {
    if (data[key]) {
      const votesAvailable = electoralVotes[key];
      const latestResult = data[key][data[key].length - 1].answers;
      let winnerScore = 0;
      for (let i = 0; i < latestResult.length; i++) {
        if (
          latestResult[i].choice.toLowerCase() === "biden" &&
          +latestResult[i].pct > winnerScore
        ) {
          winnerScore = +latestResult[i].pct;
          winner = "biden";
        } else if (
          latestResult[i].choice.toLowerCase() === "trump" &&
          +latestResult[i].pct > winnerScore
        ) {
          winnerScore = +latestResult[i].pct;
          winner = "trump";
        }
      }
      if (winner === candidate) {
        votes += votesAvailable;
      }
    }
  });
  return votes;
};

const USMap = (props) => {
  let trumpVotes = 0;
  let bidenVotes = 0;
  trumpVotes += getElectoralVotes(props.data, "trump");
  bidenVotes += getElectoralVotes(props.data, "biden");

  return (
    <div>
      <h1>Latest Poll Results - General Election</h1>
      <h2>Electoral Votes</h2>
      <h3>Trump: {trumpVotes}</h3>
      <h3>Biden: {bidenVotes}</h3>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => {
                const color = getColor(geo.properties.name, props.data);
                return (
                  <Geography
                    key={geo.rsmKey}
                    stroke="#FFF"
                    geography={geo}
                    fill={color}
                  />
                );
              })}
              {geographies.map((geo) => {
                const centroid = geoCentroid(geo);
                const cur = allStates.find((s) => s.val === geo.id);
                return (
                  <g key={geo.rsmKey + "-name"}>
                    {cur &&
                      centroid[0] > -160 &&
                      centroid[0] < -67 &&
                      (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                        <Marker coordinates={centroid}>
                          <text y="2" fontSize={14} textAnchor="middle">
                            {cur.id}
                          </text>
                        </Marker>
                      ) : (
                        <Annotation
                          subject={centroid}
                          dx={offsets[cur.id][0]}
                          dy={offsets[cur.id][1]}
                        >
                          <text x={4} fontSize={14} alignmentBaseline="middle">
                            {cur.id}
                          </text>
                        </Annotation>
                      ))}
                  </g>
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default USMap;
