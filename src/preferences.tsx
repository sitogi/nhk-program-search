import { getPreferenceValues } from "@raycast/api";

type Preferences = {
  apiKey: string;
  area: string;
};

const values = getPreferenceValues<Preferences>();

export const preferences = {
  apiKey: values.apiKey,
  area: values.area
};
