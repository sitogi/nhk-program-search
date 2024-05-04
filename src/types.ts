export const serviceIds = [
  "g1",
  // "g2",
  "e1",
  // "e2",
  // "e3",
  "s1",
  "s2",
  "s5",
  "s6",
] as const;
export type ServiceId = (typeof serviceIds)[number];

type ServiceLogo = {
  url: string;
  width: string;
  height: string;
};

type Service = {
  id: ServiceId;
  name: string;
  logo_s: ServiceLogo;
  logo_m: ServiceLogo;
  logo_l: ServiceLogo;
};

type Area = {
  id: string;
  name: string;
};

export type Program = {
  id: string;
  event_id: string;
  start_time: string;
  end_time: string;
  area: Area;
  service: Service;
  title: string;
  subtitle: string;
  content: string;
  act: string;
  genres: Genre[];
};

type ServicePrograms = {
  [key in ServiceId]: Program[];
};

export type TVSchedule = {
  list: ServicePrograms;
};

export const genreMajorCategories = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "14",
  "15",
] as const;
export type GenreMajorCategory = (typeof genreMajorCategories)[number];
export const genreMajorCategoryLabels = {
  "00": "ニュース/報道",
  "01": "スポーツ",
  "02": "情報/ワイドショー",
  "03": "ドラマ",
  "04": "音楽",
  "05": "バラエティ",
  "06": "映画",
  "07": "アニメ/特撮",
  "08": "ドキュメンタリー/教養",
  "09": "劇場/公演",
  "10": "趣味/教育",
  "11": "福祉",
  "14": "拡張",
  "15": "その他",
} satisfies { [key in GenreMajorCategory]: string };

// prettier-ignore
export const genres = [
  "0000", "0001", "0002", "0003", "0004", "0005", "0006", "0007", "0008", "0009", "0010", "0015",
  "0100", "0101", "0102", "0103", "0104", "0105", "0106", "0107", "0108", "0109", "0110", "0115",
  "0200", "0201", "0202", "0203", "0204", "0205", "0206", "0207", "0215",
  "0300", "0301", "0302", "0315",
  "0400", "0401", "0402", "0403", "0404", "0405", "0406", "0407", "0408", "0409", "0410", "0415",
  "0500", "0501", "0502", "0503", "0504", "0505", "0506", "0515",
  "0600", "0601", "0602", "0615",
  "0700", "0701", "0702", "0715",
  "0800", "0801", "0802", "0803", "0804", "0805", "0806", "0807", "0808", "0815",
  "0900", "0901", "0902", "0903", "0904", "0915",
  "1000", "1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009", "1010", "1011", "1012", "1015",
  "1100", "1101", "1102", "1103", "1104", "1105", "1106", "1115",
  "1400", "1401", "1403", "1404",
  "1515"
] as const;
export type Genre = (typeof genres)[number];

export const genreLabels = {
  "0000": "定時・総合",
  "0001": "天気",
  "0002": "特集・ドキュメント",
  "0003": "政治・国会",
  "0004": "経済・市況",
  "0005": "海外・国際",
  "0006": "解説",
  "0007": "討論・会談",
  "0008": "報道特番",
  "0009": "ローカル・地域",
  "0010": "交通",
  "0015": "その他",
  "0100": "スポーツニュース",
  "0101": "野球",
  "0102": "サッカー",
  "0103": "ゴルフ",
  "0104": "その他の球技",
  "0105": "相撲・格闘技",
  "0106": "オリンピック・国際大会",
  "0107": "マラソン・陸上・水泳",
  "0108": "モータースポーツ",
  "0109": "マリン・ウィンタースポーツ",
  "0110": "競馬・公営競技",
  "0115": "その他",
  "0200": "芸能・ワイドショー",
  "0201": "ファッション",
  "0202": "暮らし・住まい",
  "0203": "健康・医療",
  "0204": "ショッピング・通販",
  "0205": "グルメ・料理",
  "0206": "イベント",
  "0207": "番組紹介・お知らせ",
  "0215": "その他",
  "0300": "国内ドラマ",
  "0301": "海外ドラマ",
  "0302": "時代劇",
  "0315": "その他",
  "0400": "国内ロック・ポップス",
  "0401": "海外ロック・ポップス",
  "0402": "クラシック・オペラ",
  "0403": "ジャズ・フュージョン",
  "0404": "歌謡曲・演歌",
  "0405": "ライブ・コンサート",
  "0406": "ランキング・リクエスト",
  "0407": "カラオケ・のとど自慢",
  "0408": "民謡・邦楽",
  "0409": "童謡・キッズ",
  "0410": "民族音楽・ワールドミュージック",
  "0415": "その他",
  "0500": "クイズ",
  "0501": "ゲーム",
  "0502": "トークバラエティ",
  "0503": "お笑い・コメディ",
  "0504": "音楽バラエティ",
  "0505": "旅バラエティ",
  "0506": "料理バラエティ",
  "0515": "その他",
  "0600": "洋画",
  "0601": "邦画",
  "0602": "アニメ",
  "0615": "その他",
  "0700": "国内アニメ",
  "0701": "海外アニメ",
  "0702": "特撮",
  "0715": "その他",
  "0800": "社会・時事",
  "0801": "歴史・紀行",
  "0802": "自然・動物・環境",
  "0803": "宇宙・科学・医学",
  "0804": "カルチャー・伝統文化",
  "0805": "文学・文芸",
  "0806": "スポーツ",
  "0807": "ドキュメンタリー全般",
  "0808": "インタビュー・討論",
  "0815": "その他",
  "0900": "現代劇・新劇",
  "0901": "ミュージカル",
  "0902": "ダンス・バレエ",
  "0903": "落語・演芸",
  "0904": "歌舞伎・古典",
  "0915": "その他",
  "1000": "旅・釣り・アウトドア",
  "1001": "園芸・ペット・手芸",
  "1002": "音楽・美術・工芸",
  "1003": "囲碁・将棋",
  "1004": "麻雀・パチンコ",
  "1005": "車・オートバイ",
  "1006": "コンピュータ・TVゲーム",
  "1007": "会話・語学",
  "1008": "幼児・小学生",
  "1009": "中学生・高校生",
  "1010": "大学生・受験",
  "1011": "生涯教育・資格",
  "1012": "教育問題",
  "1015": "その他",
  "1100": "高齢者",
  "1101": "障害者",
  "1102": "社会福祉",
  "1103": "ボランティア",
  "1104": "手話",
  "1105": "文字(字幕)",
  "1106": "音声解説",
  "1115": "その他",
  "1400": "BS/地上デジタル放送用番組付属情報",
  "1401": "広帯域 CS デジタル放送用拡張",
  "1403": "サーバー型番組付属情報",
  "1404": "IP 放送用番組付属情報",
  "1515": "その他",
} satisfies { [key in Genre]: string };
