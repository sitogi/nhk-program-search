import { Cache, updateCommandMetadata } from "@raycast/api";
import fetch from "node-fetch";
import { preferences } from "./preferences";
import { Program, serviceIds, TVSchedule } from "./types";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

async function fetchUnreadNotificationCount() {
  console.log("fetched");
  return Math.random() * 10;
}

const cache = new Cache();

export default async function Command() {
  const count = await fetchUnreadNotificationCount();
  await updateCommandMetadata({ subtitle: `Unread Notifications: ${count}` });

  // if (cache.has(KEY_ALL_PROGRAMS)) {
  //   console.log("すでにキャッシュが作成済みなので何もしません。");
  //   console.log("保存済みキャッシュ");
  //   console.log(cache.get(KEY_ALL_PROGRAMS));
  // } else {
  // cache.set(
  //   KEY_ALL_PROGRAMS,
  //   JSON.stringify({
  //     g1: [
  //       {
  //         id: "1",
  //         event_id: "1",
  //         start_time: "2022-01-01T00:00:00+09:00",
  //         end_time: "2022-01-01T01:00:00+09:00",
  //         area: { id: "130", name: "東京" },
  //         service: {
  //           id: "g1",
  //           name: "ＮＨＫ総合１・東京",
  //           logo_s: { url: "https://example.com/logo.png", width: "100", height: "100" },
  //           logo_m: { url: "https://example.com/logo.png", width: "100", height: "100" },
  //           logo_l: { url: "https://example.com/logo.png", width: "100", height: "100" },
  //         },
  //         title: "タイトル",
  //         subtitle: "サブタイトル",
  //         content: "内容",
  //         act: "出演者",
  //         genres: ["0803"],
  //       },
  //     ],
  //     e1: [],
  //     s1: [],
  //     s2: [],
  //     s5: [],
  //     s6: [],
  //   } satisfies ServicePrograms),
  // );

  // キャッシュのリセット
  serviceIds.forEach((sid) => {
    cache.remove(sid);
  });

  // return;

  // 現在の日付 ~ １週間分の日付の文字列 YYYY-MM-DD の配列を作成する
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });
  const { area, apiKey } = preferences;

  for (const date of dates) {
    const response = await fetch(`${END_POINT}/${area}/tv/${date}.json?key=${apiKey}`);
    const data = (await response.json()) as TVSchedule;

    console.log(date);

    serviceIds.forEach((sid) => {
      const existed = JSON.parse(cache.get(sid) ?? "[]") as Program[];
      console.log("existed length", existed.length);
      cache.set(sid, JSON.stringify([...existed, ...data.list[sid]]));
      console.log(`set ${sid}`);
    });
  }

  const g1Programs = JSON.parse(cache.get("g1") ?? "[]") as Program[];
  console.log(g1Programs[30]);
  console.log("finish");

  // }

  // 読み込めなければ新規作成する
  // データがあるか確認する
  // なければ、一週間分取得する
}
