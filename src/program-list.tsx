import { preferences } from "./preferences";
import { getFormattedDate } from "./utils";
import fetch from "node-fetch";
import useSWR from "swr";
import { ActionPanel, Detail, Icon, List } from "@raycast/api";
import { Program } from "./types";

const endpoint = 'https://api.nhk.or.jp/v2/pg/list';

export default function Command() {
  const apiKey = preferences.apiKey;
  const area = preferences.area;

  const { data, error } = useSWR(
    `${endpoint}/${area}/g1/${getFormattedDate(new Date(), 'YYYY-MM-DD')}.json?key=${apiKey}`,
    (url) => fetcher(url),
  );

  if (error !== undefined) {
    return <Detail markdown={`Sorry. An error occurred. \n>${error.message}`} />;
  }

  return (
    <List
      isLoading={data === undefined}
    >
      {data?.list?.g1.map((p) => {
        return (
          <List.Item
            key={p.id}
            icon={{
              source: Icon.Document,
            }}
            title={p.title}
            detail={<List.Item.Detail markdown={`### ${p.title}\n\n---\n\n${p.content}`} />}
            actions={
              <ActionPanel title={p.title}>
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}

const fetcher = async (url: string): Promise<Program> => {
  const res = await fetch(url);
  return (await res.json()) as Program;
};
