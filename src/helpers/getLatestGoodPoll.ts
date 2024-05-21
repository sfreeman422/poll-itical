import { DateTime } from "luxon";
import { PollResponse } from "../models/poll-response";

export const getLatestGoodPoll = (
  arr: PollResponse[],
  age: string,
  calcType: string
): any | undefined => {
  const ageAsNum = +age;
  const goodPolls = arr.filter((poll) => {
    if (age === "all") {
      return true;
    } else if (poll.endDate) {
      const diffDays =
        DateTime.fromISO(poll.endDate).diffNow("days").toObject()?.days ||
        -ageAsNum;

      return diffDays > -ageAsNum;
    }
    return false;
  });

  if (goodPolls.length > 0) {
    if (calcType === "average") {
      return getAverage(goodPolls);
    }
    return goodPolls.sort((a, b) => a.endDate.localeCompare(b.endDate))[0];
  }
  return undefined;
};

export const getAverage = (arr: PollResponse[]) => {
  let totalJoe = 0;
  let quantityJoe = 0;
  let totalTrump = 0;
  let quantityTrump = 0;
  for (const poll of arr) {
    for (const answer of poll.answers) {
      if (answer.choice.toLowerCase() === "biden") {
        totalJoe += +answer.pct;
        quantityJoe += 1;
      } else if (answer.choice.toLowerCase() === "trump") {
        totalTrump += +answer.pct;
        quantityTrump += 1;
      }
    }
  }
  return {
    answers: [
      {
        choice: "biden",
        pct: totalJoe / quantityJoe,
      },
      {
        choice: "trump",
        pct: totalTrump / quantityTrump,
      },
    ],
  };
};
