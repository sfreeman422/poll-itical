import { PollResponse } from "../../models/poll-response";
import { electoralVotes } from "./data/electoralvotes";

type GeneratedResultsState = keyof typeof electoralVotes | "total";

export interface AllGeneratedResults {
  results: GeneratedResults;
  total: GeneratedResultsTotal;
}
export interface GeneratedResults {
  [key: GeneratedResultsState]: GeneratedResultsData;
}

export interface GeneratedResultsData {
  winner?: string;
  winnerScore: number;
  loserScore: number;
  difference: number;
  votes: number;
  color?: string;
  poll?: PollResponse;
}

export interface GeneratedResultsTotal {
  biden: number;
  trump: number;
  total: number;
}
