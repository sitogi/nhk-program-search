import { getPreferenceValues } from "@raycast/api";

type Preferences = {
  domain: string;
  apiKey: string;
  projectKeys: string;
  repositoryKeys: string;
};

const values = getPreferenceValues<Preferences>();

export const preferences = {
  domain: values.domain,
  apiKey: values.apiKey,
  projectKeys: values.projectKeys.split(","),
  repositoryKeys: values.repositoryKeys.split(",").map((key) => {
    // `projectKey1:repositoryKey1, projectKey1:repositoryKey2` みたいな型式で指定する
    const strings = key.split(":");
    return {
      projectKey: strings[0],
      repositoryKey: strings[1],
    };
  }),
};

export type TargetRepo = (typeof preferences.repositoryKeys)[number];
