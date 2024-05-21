import { PollResponse } from "../../models/poll-response";

export interface PollResponsesByState {
  [key: string]: PollResponse[];
}
