import CanvasJSReact from "../../assets/canvasjs.react";
import "./LineGraph.css";

const { CanvasJSChart } = CanvasJSReact;

export const LineGraph = ({ options }: any) => {
  let chart; // Do we need this?
  const toggleDataSeries = (e: any) => {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  };

  return (
    <div className="lineChart">
      {options?.data?.length ? (
        <CanvasJSChart
          options={{
            ...options,
            legend: { itemClick: toggleDataSeries },
          }}
          onRef={(ref: any) => (chart = ref)}
        />
      ) : (
        <div className="no-data">
          <h1>{options.title.text}</h1>
          <div>No data available to display</div>
        </div>
      )}
    </div>
  );
};

// class LineGraph extends React.Component {
//   constructor(props) {
//     super(props);
//     this.chart = undefined;
//   }

//   toggleDataSeries = (e) => {
//     if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
//       e.dataSeries.visible = false;
//     } else {
//       e.dataSeries.visible = true;
//     }
//     this.chart.render();
//   };

//   render() {
//     this.props.options.legend.itemclick = (e) => this.toggleDataSeries(e);
//     return (
//       <div className="lineChart">
//         <CanvasJSChart
//           options={this.props.options}
//           onRef={(ref) => (this.chart = ref)}
//         />
//       </div>
//     );
//   }
// }

// export default LineGraph;
