import React from "react";
import CanvasJSReact from "../../assets/canvasjs.react";

const { CanvasJSChart } = CanvasJSReact;

class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.chart = undefined;
  }

  toggleDataSeries = e => {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    this.chart.render();
  };

  render() {
    this.props.options.legend.itemclick = e => this.toggleDataSeries(e);
    return (
      <div className="lineChart">
        <CanvasJSChart
          options={this.props.options}
          onRef={ref => (this.chart = ref)}
        />
      </div>
    );
  }
}

export default LineGraph;
