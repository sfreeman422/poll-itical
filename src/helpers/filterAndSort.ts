import { MapObject } from "../models/map-object";
import { PollResponse } from "../models/poll-response";

const filterAndSort = (data: PollResponse[]) => {
  const mapObj: MapObject = {};

  for (let i = 0; i < data.length; i++) {
    if (mapObj[data[i].type]) {
      mapObj[data[i].type].push(data[i]);
    } else {
      mapObj[data[i].type] = [data[i]];
    }
  }
  sort(mapObj);
  return mapObj;
};

const sort = (obj: MapObject) => {
  Object.keys(obj).forEach((key) =>
    obj[key].sort((a, b) => {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    })
  );
};

export default filterAndSort;
