import React from "react";
import LineGraph from "../graphs/LineGraph";

const generateDataPoints = data => {
  const dataPoints = [];
  const choices = {};
  // Generates a map of our choices and the datapoints associated with them.
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].answers.length; j++) {
      if (choices[data[i].answers[j].choice]) {
        choices[data[i].answers[j].choice].push({
          x: new Date(data[i].endDate),
          y: +data[i].answers[j].pct
        });
      } else {
        choices[data[i].answers[j].choice] = [
          { x: new Date(data[i].endDate), y: +data[i].answers[j].pct }
        ];
      }
    }
  }

  Object.keys(choices).forEach(key => {
    dataPoints.push({
      name: key,
      type: "spline",
      showInLegend: true,
      xValueFormatString: "MM/DD/YY",
      dataPoints: choices[key]
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
      text: title
    },
    axisY: {
      title: "%"
    },
    legend: {
      cursor: "pointer"
    },
    toolTip: {
      shared: true
    },
    data: generateDataPoints(data)
  };
  return options;
};

const ChartContainer = ({ data }) => {
  console.log("container data", data);
  return (
    <div className="chartContainer">
      {Object.keys(data).map((key, i) => {
        const options = generateOptions(key, data[key]);
        console.log("options right before graph", options);
        return <LineGraph key={`linegraph-key-${i}`} options={options} />;
      })}
    </div>
  );
};

export default ChartContainer;
