import React from "react";
import CanvasJSReact from "../../assets/canvasjs.react";

const { CanvasJS } = CanvasJSReact;
const { CanvasJSChart } = CanvasJSReact;
const LineGraph = ({ options }) => {
  console.log("options in graph", options);
  return (
    <div className="lineChart">
      <CanvasJSChart options={options} />
    </div>
  );
};

export default LineGraph;
