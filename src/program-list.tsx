import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import React, { useState } from "react";
import { ProgramDetail } from "./components/ProgramDetail";
import { SearchBarDropdown } from "./components/ServiceSelectSearchBar";
import { preferences } from "./preferences";
import { ServiceId, TVSchedule } from "./types";
import { getFormattedDate } from "./utils";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

export default function Command() {
  const [serviceId, setServiceId] = useState<ServiceId>("g1");
  const { isLoading, data, error } = useFetch<TVSchedule>(
    `${END_POINT}/${preferences.area}/tv/${getFormattedDate(new Date(), "YYYY-MM-DD")}.json?key=${preferences.apiKey}`,
  );

  if (error !== undefined) {
    return <Detail markdown={`Sorry. An error occurred. \n>${error.message}`} />;
  }

  return (
    <List isLoading={isLoading} searchBarAccessory={<SearchBarDropdown onChange={setServiceId} />}>
      {data?.list[serviceId]
        ?.filter((p) => new Date(p.end_time) > new Date())
        .map((p) => {
          return (
            <List.Item
              key={p.id}
              icon={{
                source: Icon.Document,
              }}
              title={p.title}
              accessories={[
                {
                  text: `${getFormattedDate(new Date(p.start_time), "HH:mm")} ~ ${getFormattedDate(new Date(p.end_time), "HH:mm")}`,
                },
              ]}
              actions={
                <ActionPanel title={p.title}>
                  <Action.Push title="Show Detail" target={<ProgramDetail program={p} />} />
                </ActionPanel>
              }
            />
          );
        })}
    </List>
  );
}
