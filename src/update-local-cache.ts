import { Cache, showToast, Toast, updateCommandMetadata } from "@raycast/api";
import fetch from "node-fetch";
import { preferences } from "./preferences";
import { ErrorResponseBody, Program, serviceIds, TVSchedule } from "./types";
import { getFormattedDate } from "./utils";

const END_POINT = "https://api.nhk.or.jp/v2/pg/list";

const cache = new Cache();

export default async function Command() {
  // 現在の日付 ~ １週間分の日付の文字列 YYYY-MM-DD の配列を作成する
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const jstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    jstDate.setDate(jstDate.getDate() + i);
    return getFormattedDate(jstDate, "YYYY-MM-DD");
  });

  // prev cache data
  const prevCache: { [key: string]: Program[] } = {};
  serviceIds.forEach((sid) => {
    const data = JSON.parse(cache.get(sid) ?? "[]") as Program[];
    prevCache[sid] = data;
    return data;
  });

  serviceIds.forEach(cache.remove);

  for (const date of weekDates) {
    const response = await fetch(`${END_POINT}/${preferences.area}/tv/${date}.json?key=${preferences.apiKey}`);

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
      cache.set(sid, JSON.stringify([...existed, ...data.list[sid]]));
    });
  }

  await updateCommandMetadata({ subtitle: `Last Update: ${getFormattedDate(new Date(), "YYYY-MM-DD HH:mm")}` });
}
