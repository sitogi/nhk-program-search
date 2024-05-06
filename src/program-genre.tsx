import { Action, ActionPanel, Detail, Form, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import React, { useState } from "react";
import { ProgramDetail } from "./components/ProgramDetail";
import { SearchBarDropdown } from "./components/ServiceSelectSearchBar";
import { preferences } from "./preferences";
import { genreLabels, genreMajorCategoryLabels, ServiceId, TVSchedule } from "./types";
import { getFormattedDate } from "./utils";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

export default function Command() {
  const [selectedMajorCategories, setSelectedMajorCategories] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (submitted) {
    return <ProgramList displayGenres={selectedGenres} handleOnBack={() => setSubmitted(false)} />;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Search Programs" onSubmit={() => setSubmitted(true)} />
        </ActionPanel>
      }
    >
      <Form.Description
        title="Import / Export"
        text="Exporting will back-up your preferences, quicklinks, snippets, floating notes, script-command folder paths, aliases, hotkeys, favorites and other data."
      />
      <Form.TagPicker
        id="majorCategories"
        title="Genre Major Categories"
        value={selectedMajorCategories}
        onChange={(newValue) => {
          setSelectedMajorCategories(newValue);
          setSelectedGenres(selectedGenres.filter((genre) => newValue.includes(genre.substring(0, 2))));
        }}
      >
        {Array.from(genreMajorCategoryLabels).map(([key, label]) => {
          return <Form.TagPicker.Item key={key} value={key} title={label} />;
        })}
      </Form.TagPicker>
      <Form.TagPicker
        id="genres"
        title="Genres"
        value={selectedGenres}
        onChange={(newValue) => setSelectedGenres(newValue)}
      >
        {Array.from(genreLabels).map(([key, label]) => {
          if (selectedMajorCategories.includes(key.substring(0, 2))) {
            return <Form.TagPicker.Item key={key} value={key} title={label} />;
          }
          return null;
        })}
      </Form.TagPicker>
    </Form>
  );
}

function ProgramList({
  displayGenres,
  handleOnBack,
}: {
  displayGenres: string[];
  handleOnBack: () => void;
}): React.JSX.Element {
  const [serviceId, setServiceId] = useState<ServiceId>("g1");
  const { isLoading, data, error } = useFetch<TVSchedule>(
    `${END_POINT}/${preferences.area}/tv/${getFormattedDate(new Date(), "YYYY-MM-DD")}.json?key=${preferences.apiKey}`,
  );

  if (error !== undefined) {
    return <Detail markdown={`Sorry. An error occurred. \n>${error.message}`} />;
  }

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
      {data?.list[serviceId]
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