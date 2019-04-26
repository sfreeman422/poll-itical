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
          y: data[i].answers[j].pct
        });
      } else {
        choices[data[i].answers[j].choice] = [
          { x: new Date(data[i].endDate), y: data[i].answers[j].pct }
        ];
      }
    }
  }

  Object.keys(choices).forEach(key => {
    dataPoints.push({
      name: key,
      type: "spline",
      showInLegend: true,
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
    axisX: {
      valueFormatString: "MM/DD/YY",
      Title: "Date",
      lineThickness: 1
    },
    axisY: {
      title: "Percentage",
      lineThickness: 1
    },
    legend: {
      cursor: "pointer",
      itemclick: e => console.log(e)
    },
    toolTip: {
      shared: true
    },
    data: generateDataPoints(data)
  };
  console.log("options", options);
  return options;
};

const ChartContainer = ({ data }) => {
  console.log("container data", data);
  return (
    <div className="chartContainer">
      {Object.keys(data).map((key, i) => {
        const options = generateOptions(key, data[key]);
        return <LineGraph key={`linegraph-key-${i}`} options={options} />;
      })}
    </div>
  );
};

export default ChartContainer;
