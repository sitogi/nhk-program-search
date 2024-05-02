type Logo = {
  url: string;
  width: string;
  height: string;
};

type Service = {
  id: string;
  name: string;
  logo_s: Logo;
  logo_m: Logo;
  logo_l: Logo;
};

type Area = {
  id: string;
  name: string;
};

type Event = {
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

type EventGroup = {
  g1: Event[];
};

export type Program = {
  list: EventGroup;
};
