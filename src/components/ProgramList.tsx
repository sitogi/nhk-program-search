import { Action, ActionPanel, Cache, Icon, List } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { Program, ServiceId } from "../types";
import { getFormattedDate } from "../utils";
import { ProgramDetail } from "./ProgramDetail";
import { SearchBarDropdown } from "./ServiceSelectSearchBar";

const cache = new Cache();

type Props = {
  customFilters?: ((program: Program) => boolean)[];
};

export function ProgramList({ customFilters = [] }: Props): React.JSX.Element {
  const [serviceId, setServiceId] = useState<ServiceId>("g1");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const programs = (JSON.parse(cache.get(serviceId) ?? "[]") as Program[]) ?? [];
    const afterCurrentTime = programs.filter((p) => new Date(p.end_time) > new Date());
    const filtered = afterCurrentTime.filter((p) => customFilters.every((f) => f(p)));
    setPrograms(filtered);
    setIsLoading(false);
  }, [serviceId]);

  return (
    <List isLoading={isLoading} searchBarAccessory={<SearchBarDropdown onChange={setServiceId} />}>
      {programs.map((p) => {
        return (
          <List.Item
            key={p.id}
            icon={{
              source: Icon.Document,
            }}
            title={p.title}
            accessories={[
              {
                text: `${getFormattedDate(new Date(p.start_time), "MM-DD")} ${getFormattedDate(new Date(p.start_time), "HH:mm")}~${getFormattedDate(new Date(p.end_time), "HH:mm")}`,
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
