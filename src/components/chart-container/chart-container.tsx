import { LineGraph } from "../graphs/LineGraph";
import USMap from "../maps/USMap";
import { MapObject } from "../../models/map-object";
import { PollResponse } from "../../models/poll-response";
import { ChartChoices, ChartDataPoints } from "./data-points.model";
import { PollResponsesByState } from "./poll-response-by-state.model";
import "./chart-container.css";

const generateDataPoints = (data: PollResponse[]): ChartDataPoints[] => {
  const dataPoints: ChartDataPoints[] = [];
  const choices: ChartChoices = {};
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

const generateOptions = (title: string, data: PollResponse[]) => {
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
      contentFormatter: (e: any) => {
        const sorted = e.entries.sort(
          (a: any, b: any) => b.dataPoint.y - a.dataPoint.y
        );
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

const generatePollResponsesByState = (
  data: PollResponse[]
): PollResponsesByState => {
  const mapObj: PollResponsesByState = {};

  if (data) {
    for (let i = 0; i < data.length; i++) {
      if (!!data[i].state && data[i].state !== "National") {
        if (mapObj[data[i].state as string]) {
          mapObj[data[i].state as string].push(data[i]);
        } else {
          mapObj[data[i].state as string] = [data[i]];
        }
      }
    }
  }

  return mapObj;
};

export interface ChartContainerProps {
  data: MapObject;
}

const ChartContainer = ({ data }: ChartContainerProps) => {
  return (
    <div className="chart-container">
      <div className="map">
        <USMap data={generatePollResponsesByState(data["president-general"])} />
      </div>
      <div className="graphs">
        {Object.keys(data).map((key, i) => (
          <LineGraph
            key={`linegraph-key-${i}`}
            options={generateOptions(key, data[key])}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartContainer;
