import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import React, { useState } from "react";
import { preferences } from "./preferences";
import { genreLabels, Program, ServiceId, serviceIds, TVSchedule } from "./types";
import { getFormattedDate } from "./utils";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

const serviceIdLogos = {
  g1: "https://www.nhk.or.jp/common/img/media/gtv-100x50.png",
  e1: "https://www.nhk.or.jp/common/img/media/etv-100x50.png",
  s1: "https://www.nhk.or.jp/common/img/media/bs1-100x50.png",
  s2: "https://www.nhk.or.jp/common/img/media/bs1m-100x50.png",
  s5: "https://www.nhk.or.jp/common/img/media/bs4k-100x50.png",
  s6: "https://www.nhk.or.jp/common/img/media/bs8k-100x50.png",
} satisfies { [key in ServiceId]: string };

const serviceIdLabels = {
  g1: "ＮＨＫ総合",
  e1: "ＮＨＫＥテレ",
  s1: "ＮＨＫＢＳ",
  s2: "ＮＨＫ ＢＳ(１０２ｃｈ)",
  s5: "ＮＨＫ ＢＳプレミアム４Ｋ",
  s6: "ＮＨＫ ＢＳ８Ｋ",
} satisfies { [key in ServiceId]: string };

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

function SearchBarDropdown({ onChange }: { onChange: (newValue: ServiceId) => void }): React.JSX.Element {
  return (
    <List.Dropdown
      tooltip="Select a Service"
      storeValue={true}
      onChange={(newValue) => onChange(newValue as ServiceId)}
    >
      {serviceIds.map((sid) => {
        return <List.Dropdown.Item key={sid} title={serviceIdLabels[sid]} value={sid} icon={serviceIdLogos[sid]} />;
      })}
    </List.Dropdown>
  );
}

function ProgramDetail({ program }: { program: Program }): React.JSX.Element {
  const cast = parseAct(program.act);

  return (
    <Detail
      markdown={buildMarkdown(program)}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Service"
            text={program.service.name}
            icon={`https:${program.service.logo_s.url}`}
          />
          <Detail.Metadata.Label
            title="Airtime"
            text={`${getFormattedDate(new Date(program.start_time), "HH:mm")} - ${getFormattedDate(new Date(program.end_time), "HH:mm")}`}
          />
          <Detail.Metadata.TagList title="Genres">
            {program.genres.map((genre) => {
              return <Detail.Metadata.TagList.Item key={genre} text={genreLabels[genre]} />;
            })}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          {Object.keys(cast).map((role) => (
            <Detail.Metadata.TagList key={role} title={role}>
              {cast[role].map((name) => {
                return <Detail.Metadata.TagList.Item key={name} text={name} />;
              })}
            </Detail.Metadata.TagList>
          ))}
        </Detail.Metadata>
      }
    />
  );
}

function buildMarkdown(program: Program): string {
  const lines: string[] = [];

  lines.push(`## ${program.title}`);
  if (program.subtitle.length > 0 && program.subtitle !== program.content) {
    lines.push(`### ${program.subtitle}`);
  }
  lines.push("---");
  lines.push("\n");
  if (program.content.length > 0) {
    lines.push(program.content);
  } else {
    lines.push("No content available");
  }

  return lines.join("\n");
}

type Cast = {
  [role: string]: string[];
};

function parseAct(act: string): Cast {
  const matches = act.matchAll(/【(.*?)】/g);
  const roles = Array.from(matches, (match) => match[1]);

  const result: Cast = {};

  for (let i = 0; i < roles.length; i++) {
    result[roles[i]] = [];

    const startMarker = `【${roles[i]}】`;
    const endMarker = i === roles.length - 1 ? "$" : `【${roles[i + 1]}】`;
    const pattern = new RegExp(`${startMarker}(.*?)${endMarker}`);
    const matches = act.match(pattern);
    const extractedString = matches ? matches[1] : "";

    extractedString
      .split("，")
      .filter((name) => name.length > 0)
      .forEach((name) => result[roles[i]].push(name));
  }

  return result;
}
