import { Cache, showToast, Toast, updateCommandMetadata } from "@raycast/api";
import fetch from "node-fetch";
import { preferences } from "./preferences";
import { ErrorResponseBody, Program, serviceIds, TVSchedule } from "./types";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

const cache = new Cache();

export default async function Command() {
  // キャッシュのリセット

  // 現在の日付 ~ １週間分の日付の文字列 YYYY-MM-DD の配列を作成する
  const dates = Array.from({ length: 7 }, (_, i) => {
    // JST で取得
    const jstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    jstDate.setDate(jstDate.getDate() + i);
    return jstDate.toISOString().split("T")[0];
  });
  const { area, apiKey } = preferences;

  // prev cache data
  const prevCache: { [key: string]: Program[] } = {};
  serviceIds.forEach((sid) => {
    const data = JSON.parse(cache.get(sid) ?? "[]") as Program[];
    prevCache[sid] = data;
    return data;
  });

  serviceIds.forEach(cache.remove);

  for (const date of dates) {
    const response = await fetch(`${END_POINT}/${area}/tv/${date}.json?key=${apiKey}`);

    if (!response.ok) {
      const errorResponse = (await response.json()) as ErrorResponseBody;
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch data",
        message: errorResponse.error.message,
      });

      // restore prev data
      serviceIds.forEach((sid) => {
        cache.set(sid, JSON.stringify(prevCache[sid]));
      });

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

  await updateCommandMetadata({ subtitle: `Updated At: ${new Date().toISOString().split("T")[0]}` });
}
