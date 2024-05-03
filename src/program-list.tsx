import { preferences } from "./preferences";
import { getFormattedDate } from "./utils";
import fetch from "node-fetch";
import useSWR from "swr";
import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api";
import { Program, ServiceId, serviceIds, TVSchedule } from "./types";
import React, { useState } from "react";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

const fetcher = async (url: string): Promise<TVSchedule> => {
  const res = await fetch(url);
  return (await res.json()) as TVSchedule;
};

function buildTitle(program: Program): string {
  return `${getFormattedDate(new Date(program.start_time), "MM/DD HH:mm")}    ${program.title}`;
}

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
  const apiKey = preferences.apiKey;
  const area = preferences.area;

  const { data, error } = useSWR(
    `${END_POINT}/${area}/tv/${getFormattedDate(new Date(), "YYYY-MM-DD")}.json?key=${apiKey}`,
    (url) => fetcher(url),
  );

  if (error !== undefined) {
    return <Detail markdown={`Sorry. An error occurred. \n>${error.message}`} />;
  }

  return (
    <List isLoading={data === undefined} searchBarAccessory={<SearchBarDropdown onChange={setServiceId} />}>
      {data?.list[serviceId]?.map((p) => {
        return (
          <List.Item
            key={p.id}
            icon={{
              source: Icon.Document,
            }}
            title={buildTitle(p)}
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
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Airtime"
            text={`${getFormattedDate(new Date(program.start_time), "HH:mm")} - ${getFormattedDate(new Date(program.end_time), "HH:mm")}`}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.TagList title="Genres">
            {program.genres.map((genre) => {
              return <Detail.Metadata.TagList.Item key={genre} text={genre} />;
            })}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          {program.act.length > 0 && (
            <Detail.Metadata.TagList title="Actors">
              {program.act.split("，").map((act) => {
                return <Detail.Metadata.TagList.Item key={act} text={act} />;
              })}
            </Detail.Metadata.TagList>
          )}
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
