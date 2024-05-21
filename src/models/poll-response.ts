export interface PollResponse {
  id: string;
  subgroup: string;
  sampleSize?: string;
  population?: string;
  url?: string;
  created_at: string;
  startDate: string;
  endDate: string;
  pollster: string;
  pollsterRatingLink: any;
  partisan_pollster?: string;
  answers: Answer[];
  type: string;
  seat_name?: string;
  tracking: boolean;
  headToHead: boolean;
  sponsors: Sponsor[];
  internal: boolean;
  inAvg: boolean;
  politician?: string;
  path: string;
  hasAvg: boolean;
  partisan?: string;
  cycle?: string;
  state?: string;
  stage?: string;
  district?: string;
  subpopulation?: string;
}

export interface Answer {
  choice: string;
  pct: string;
  party?: string;
  incumbent?: boolean;
}

export interface Sponsor {
  sponsor: string;
  partisan?: string;
  internal?: boolean;
  url?: string;
  candidate?: boolean;
  endorsements?: string[];
}
