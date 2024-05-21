import { LineGraph } from "../graphs/LineGraph";
import USMap from "../maps/USMap";
import { MapObject } from "../../models/map-object";
import { PollResponse } from "../../models/poll-response";
import {
  ChartChoices,
  ChartChoicesCoordinates,
  ChartDataPoints,
} from "./data-points.model";
import { PollResponsesByState } from "./poll-response-by-state.model";
import "./chart-container.css";
import { ResultFilter } from "../../app";
import { DateTime } from "luxon";

const getAverageDataPoints = (dataPoints: ChartChoicesCoordinates[]) => {
  const returnObj: Record<string, ChartChoicesCoordinates[]> = {};

  dataPoints.forEach((dp) => {
    if (returnObj[dp.x.toISOString()]) {
      returnObj[dp.x.toISOString()].push(dp);
    } else {
      returnObj[dp.x.toISOString()] = [dp];
    }
  });

  return Object.keys(returnObj).map((key) => {
    const sum = returnObj[key].reduce((acc, curr) => acc + curr.y, 0);
    return {
      x: new Date(key),
      y: sum / returnObj[key].length,
    };
  });
};

const generateDataPoints = (
  data: PollResponse[],
  filter: ResultFilter
): ChartDataPoints[] => {
  const dataPoints: ChartDataPoints[] = [];
  const choices: ChartChoices = {};

  const filtered = data.filter((poll) => {
    if (filter.age === "all") {
      return true;
    } else if (poll.endDate) {
      const diffDays =
        DateTime.fromISO(poll.endDate).diffNow("days").toObject()?.days ||
        -filter.age;
      return diffDays > -filter.age;
    }
    return false;
  });
  // Generates a map of our choices and the datapoints associated with them.
  for (let i = 0; i < filtered?.length; i++) {
    for (let j = 0; j < filtered?.[i].answers.length; j++) {
      if (choices[filtered?.[i].answers[j].choice]) {
        choices[filtered?.[i].answers[j].choice].push({
          x: new Date(filtered?.[i].endDate),
          y: +filtered?.[i].answers[j].pct,
        });
      } else {
        choices[filtered?.[i].answers[j].choice] = [
          {
            x: new Date(filtered?.[i].endDate),
            y: +filtered?.[i].answers[j].pct,
          },
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
      dataPoints:
        choices[key].length > 1
          ? getAverageDataPoints(choices[key])
          : choices[key],
    });
  });

  return dataPoints;
};

const generateOptions = (
  title: string,
  data: PollResponse[],
  filter: ResultFilter
) => {
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
    data: generateDataPoints(data, filter),
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
  filter: ResultFilter;
  calcType: string;
}

const ChartContainer = ({ data, filter, calcType }: ChartContainerProps) => {
  return (
    <div className="chart-container">
      <div className="map">
        <USMap
          data={generatePollResponsesByState(data["president-general"])}
          filter={filter}
          calcType={calcType}
        />
      </div>
      <div className="graphs">
        {Object.keys(data).map((key, i) => (
          <LineGraph
            key={`linegraph-key-${i}`}
            options={generateOptions(key, data[key], filter)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartContainer;
