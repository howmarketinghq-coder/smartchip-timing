export interface Event {
  id: string;
  name: string;
  date: Date | string;
  courses: string[];
  status: "upcoming" | "active" | "past";
  certificateImg?: string | null;
  photoCertImg?: string | null;
  siteUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Split {
  point: string;
  time: string;
  passTime: string;
  pace: string;
}

export interface Record {
  id: string;
  eventId: string;
  bib: string;
  name: string;
  course: string;
  gender: "M" | "F";
  finishTime: string;
  speed: number;
  pace: string;
  splits: Split[];
  createdAt?: Date;
}

export interface Poster {
  id: string;
  eventId?: string | null;
  type: "hero" | "next";
  imageUrl: string;
  link?: string | null;
  order: number;
  createdAt?: Date;
}

export interface Ranking {
  overallRank: number;
  genderRank: number;
  totalCourse: number;
  totalGender: number;
  myRecord: string;
  top3: {
    rank: number;
    bib: string;
    name: string;
    time: string;
  }[];
  genderLabel: string;
}
