import { Cache, updateCommandMetadata } from "@raycast/api";
import fetch from "node-fetch";
import { preferences } from "./preferences";
import { ErrorResponseBody, Program, serviceIds, TVSchedule } from "./types";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

async function fetchUnreadNotificationCount() {
  console.log("fetched");
  return Math.random() * 10;
}

const cache = new Cache();

export default async function Command() {
  // TODO: last updated とかに変えるのと、場所移動 (成功したら更新する)
  const count = await fetchUnreadNotificationCount();
  await updateCommandMetadata({ subtitle: `Unread Notifications: ${count}` });

  // キャッシュのリセット
  // TODO: ここではリセットではなく退避にしておいて、更新失敗したら復元してあげるのが優しいかも
  serviceIds.forEach((sid) => {
    cache.remove(sid);
  });

  // 現在の日付 ~ １週間分の日付の文字列 YYYY-MM-DD の配列を作成する
  const dates = Array.from({ length: 7 }, (_, i) => {
    // JST で取得
    const jstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    jstDate.setDate(jstDate.getDate() + i);
    return jstDate.toISOString().split("T")[0];
  });
  const { area, apiKey } = preferences;

  for (const date of dates) {
    // TODO: エラーハンドリングする
    const response = await fetch(`${END_POINT}/${area}/tv/${date}.json?key=${apiKey}`);
    if (!response.ok) {
      console.error("failed to fetch");
      const errorResponse = (await response.json()) as ErrorResponseBody;
      console.error(errorResponse);
      // 08:43:50.013 { error: { code: 1, message: 'Invalid parameters' } }
      // という型式できていたので、このメッセージをトースト？に出してあげる

      return;
    }
    const data = (await response.json()) as TVSchedule;

    serviceIds.forEach((sid) => {
      const existed = JSON.parse(cache.get(sid) ?? "[]") as Program[];
      console.log("existed length", existed.length);
      cache.set(sid, JSON.stringify([...existed, ...data.list[sid]]));
      console.log(`set ${sid}`);
    });
  }

  console.log("finish");
}
