import { Action, ActionPanel, Cache, Icon, List } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { ProgramDetail } from "./components/ProgramDetail";
import { SearchBarDropdown } from "./components/ServiceSelectSearchBar";
import { Program, ServiceId } from "./types";
import { getFormattedDate } from "./utils";

const cache = new Cache();

export default function Command() {
  const [serviceId, setServiceId] = useState<ServiceId>("g1");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setPrograms((JSON.parse(cache.get(serviceId) ?? "[]") as Program[]) ?? []);
    setIsLoading(false);
  }, [serviceId]);

  return (
    <List isLoading={isLoading} searchBarAccessory={<SearchBarDropdown onChange={setServiceId} />}>
      {programs
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
                  text: `${getFormattedDate(new Date(p.start_time), "MM-DD")}`,
                },
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
