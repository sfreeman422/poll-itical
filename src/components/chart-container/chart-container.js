import React from "react";
import LineGraph from "../graphs/LineGraph";
import USMap from "../maps/USMap";

const generateDataPoints = (data) => {
  const dataPoints = [];
  const choices = {};
  // Generates a map of our choices and the datapoints associated with them.
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].answers.length; j++) {
      if (choices[data[i].answers[j].choice]) {
        choices[data[i].answers[j].choice].push({
          x: new Date(data[i].endDate),
          y: +data[i].answers[j].pct,
        });
      } else {
        choices[data[i].answers[j].choice] = [
          { x: new Date(data[i].endDate), y: +data[i].answers[j].pct },
        ];
      }
    }
  }

  Object.keys(choices).forEach((key) => {
    dataPoints.push({
      name: key,
      type: "spline",
      showInLegend: true,
      xValueFormatString: "MM/DD/YY",
      dataPoints: choices[key],
    });
  });

  return dataPoints;
};

const generateOptions = (title, data) => {
  const options = {
    animationEnabled: true,
    theme: "light1",
    zoomEnabled: true,
    title: {
      text: title,
    },
    axisY: {
      title: "%",
    },
    legend: {
      cursor: "pointer",
    },
    toolTip: {
      shared: true,
      contentFormatter: (e) => {
        const sorted = e.entries.sort((a, b) => b.dataPoint.y - a.dataPoint.y);
        let string = "";
        for (let i = 0; i < sorted.length; i++) {
          if (i === 0) {
            string += `<strong>${sorted[
              i
            ].dataPoint.x.toDateString()}</strong><br/>`;
          }
          string += `<span>${sorted[i].dataSeries.options.name}: ${sorted[i].dataPoint.y}%</span><br/>`;
        }
        return string;
      },
    },
    data: generateDataPoints(data),
  };
  return options;
};

const generateGenByState = (data) => {
  const mapObj = {};
  if (data) {
    for (let i = 0; i < data.length; i++) {
      if (mapObj[data[i].state]) {
        mapObj[data[i].state].push(data[i]);
      } else if (data[i].state !== "National") {
        mapObj[data[i].state] = [data[i]];
      }
    }
  }
  return mapObj;
};

const ChartContainer = ({ data }) => {
  return (
    <div className="chartContainer">
      <div className="map">
        <USMap data={generateGenByState(data["president-general"])} />
      </div>
      <div className="graphs">
        {Object.keys(data).map((key, i) => {
          const options = generateOptions(key, data[key]);
          return <LineGraph key={`linegraph-key-${i}`} options={options} />;
        })}
      </div>
    </div>
  );
};

export default ChartContainer;
