export const serviceIds = [
  "g1",
  // "g2",
  "e1",
  // "e2",
  // "e3",
  "s1",
  "s2",
  "s5",
  "s6",
] as const;
export type ServiceId = (typeof serviceIds)[number];

type ServiceLogo = {
  url: string;
  width: string;
  height: string;
};

type Service = {
  id: ServiceId;
  name: string;
  logo_s: ServiceLogo;
  logo_m: ServiceLogo;
  logo_l: ServiceLogo;
};

type Area = {
  id: string;
  name: string;
};

export type Program = {
  id: string;
  event_id: string;
  start_time: string;
  end_time: string;
  area: Area;
  service: Service;
  title: string;
  subtitle: string;
  content: string;
  act: string;
  genres: string[];
};

type ServicePrograms = {
  [key in ServiceId]: Program[];
};

export type TVSchedule = {
  list: ServicePrograms;
};
