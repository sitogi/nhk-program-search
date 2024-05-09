import { Action, ActionPanel, Cache, Form, Icon, List } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { ProgramDetail } from "./components/ProgramDetail";
import { SearchBarDropdown } from "./components/ServiceSelectSearchBar";
import { genreLabels, Program, ServiceId } from "./types";
import { getFormattedDate } from "./utils";

export default function Command() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (submitted) {
    return <ProgramList displayGenres={selectedGenres} handleOnBack={() => setSubmitted(false)} />;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Search Programs"
            onSubmit={async (input) => {
              setSelectedGenres(input.genres);
              setSubmitted(true);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TagPicker id="genres" title="Genres" defaultValue={[]} storeValue>
        {Array.from(genreLabels).map(([key, label]) => (
          <Form.TagPicker.Item key={key} value={key} title={label} />
        ))}
      </Form.TagPicker>
    </Form>
  );
}

const cache = new Cache();

function ProgramList({
  displayGenres,
  handleOnBack,
}: {
  displayGenres: string[];
  handleOnBack: () => void;
}): React.JSX.Element {
  const [serviceId, setServiceId] = useState<ServiceId>("g1");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setPrograms((JSON.parse(cache.get(serviceId) ?? "[]") as Program[]) ?? []);
    setIsLoading(false);
  }, [serviceId]);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<SearchBarDropdown onChange={setServiceId} />}
      actions={
        <ActionPanel title="title">
          <Action title="Back to Genre Select" onAction={handleOnBack} />
        </ActionPanel>
      }
    >
      {programs
        ?.filter((p) => p.genres.some((g) => displayGenres.includes(g)))
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
