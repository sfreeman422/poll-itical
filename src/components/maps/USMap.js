import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";
import { DateTime } from "luxon";

import { electoralVotes } from "./data/electoralvotes";
import allStates from "./data/allstates.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const defaultColor = "#DDD";
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

const getColorShade = (winner, loser, candidate) => {
  const blueColor = {
    20: "#003f9a",
    15: "#005ce1",
    10: "#2a81ff",
    5: "#71abff",
    0: "#b8d5ff",
  };

  const redColor = {
    20: "#a20004",
    15: "#e70005",
    10: "#ff2e33",
    5: "#ff7477",
    0: "#ffb9bb",
  };

  const difference = winner - loser;

  if (candidate === "trump") {
    if (difference >= 20) {
      return redColor[20];
    } else if (difference >= 15 && difference < 20) {
      return redColor[15];
    } else if (difference >= 10 && difference < 15) {
      return redColor[10];
    } else if (difference >= 5 && difference < 10) {
      return redColor[5];
    } else if (difference > 0 && difference < 5) {
      return redColor[0];
    } else if (difference === 0) {
      return defaultColor;
    }
  } else if (candidate === "biden") {
    if (difference >= 20) {
      return blueColor[20];
    } else if (difference >= 15 && difference < 20) {
      return blueColor[15];
    } else if (difference >= 10 && difference < 15) {
      return blueColor[10];
    } else if (difference >= 5 && difference < 10) {
      return blueColor[5];
    } else if (difference > 0 && difference < 5) {
      return blueColor[0];
    } else if (difference === 0) {
      return defaultColor;
    }
  } else {
    return defaultColor;
  }
};

const checkForRating = (desired, actual) => {
  const ratingThresholds = {
    A: { good: ["A"], bad: ["B", "C", "D"] },
    B: { good: ["A", "B"], bad: ["C", "D"] },
    C: { good: ["A", "B", "C"], bad: ["D"] },
    D: { good: ["A", "B", "C", "D"], bad: [] },
  };

  const split = actual.split("");
  let hasGoodRating = false;
  let hasBadRating = false;
  for (const goodRating of ratingThresholds[desired].good) {
    if (hasGoodRating) {
      break;
    } else {
      hasGoodRating = split.includes(goodRating);
    }
  }

  for (const badRating of ratingThresholds[desired].bad) {
    if (hasBadRating) {
      break;
    } else {
      hasBadRating = split.includes(badRating);
    }
  }

  return hasGoodRating && !hasBadRating;
};

const getLatestGoodPoll = (arr, age, rating) => {
  const ageAsNum = +age;
  const goodPolls = arr.filter((poll) => {
    const isRecent =
      age === "all"
        ? true
        : DateTime.fromISO(poll.endDate).diffNow("days").toObject().days >
          -ageAsNum;
    const passing = checkForRating(rating, poll.grade);
    return passing && isRecent;
  });
  return goodPolls.length > 1 ? goodPolls[goodPolls.length - 1] : undefined;
};

const generateResults = (data, filterData) => {
  const results = {};
  Object.keys(electoralVotes).forEach((key) => {
    if (data[key]) {
      const votesAvailable = electoralVotes[key];
      const latestGoodPoll = getLatestGoodPoll(
        data[key],
        filterData.age,
        filterData.rating
      );
      const latestResult = latestGoodPoll ? latestGoodPoll.answers : undefined;
      if (latestResult) {
        let winnerScore = 0;
        let loserScore = 0;
        let winner;
        for (let i = 0; i < latestResult.length; i++) {
          const pct = +latestResult[i].pct;
          if (pct > winnerScore) {
            loserScore = winnerScore;
            winnerScore = +latestResult[i].pct;
            winner = latestResult[i].choice.toLowerCase();
          } else if (pct < winnerScore) {
            loserScore = pct;
          } else if (pct === winnerScore) {
            loserScore = winnerScore;
          }
        }
        results[key] = {
          winner,
          winnerScore,
          loserScore,
          difference: winnerScore - loserScore,
          votes: votesAvailable,
          color: getColorShade(winnerScore, loserScore, winner),
          poll: latestGoodPoll,
        };
      }
    }

    const votes = {
      biden: 0,
      trump: 0,
      total: 0,
    };

    Object.keys(results).forEach((key) => {
      if (results[key].winner === "biden") {
        votes.biden += results[key].votes;
      } else if (results[key].winner === "trump") {
        votes.trump += results[key].votes;
      }
      if (results[key].votes) {
        votes.total += results[key].votes;
      }
    });

    results.total = {
      biden: votes.biden,
      trump: votes.trump,
      total: votes.total,
    };
  });
  return results;
};

const USMap = (props) => {
  const results = generateResults(props.data, {
    rating: props.rating,
    age: props.age,
  });
  const bidenVotes = results.total.biden;
  const trumpVotes = results.total.trump;

  return (
    <div>
      <h1>Latest Poll Results - General Election</h1>
      <h2>Electoral Votes</h2>
      <h3>Trump: {trumpVotes}</h3>
      <h3>Biden: {bidenVotes}</h3>
      <div>
        <div>
          <div className="colorBox red20"></div> 20% or more lead{" "}
          <div className="colorBox blue20"></div>
        </div>
        <div>
          <div className="colorBox red15"></div> 15%-20% lead{" "}
          <div className="colorBox blue15"></div>
        </div>
        <div>
          <div className="colorBox red10"></div> 10%-15% lead{" "}
          <div className="colorBox blue10"></div>
        </div>
        <div>
          <div className="colorBox red05"></div> 5%-10% lead{" "}
          <div className="colorBox blue05"></div>
        </div>
        <div>
          <div className="colorBox red00"></div> 1%-5% lead{" "}
          <div className="colorBox blue00"></div>
        </div>
      </div>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => {
                const color = results[geo.properties.name]
                  ? results[geo.properties.name].color
                  : defaultColor;
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
