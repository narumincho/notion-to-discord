import { Task } from "./task.ts";

export const commentToDiscord = async (parameter: {
  readonly discordWebHookUrl: string;
  readonly userMap: ReadonlyMap<string, string>;
  readonly task: Task;
}) => {
  await fetch(parameter.discordWebHookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      content: `**${parameter.userMap.get(parameter.task.userId)}**が**「${
        parameter.task.name
      }」**を完了！ ${getRandomCongratulatoryWord()}`,
    }),
  });
};

const congratulatoryWords: ReadonlySet<string> = new Set([
  "お疲れー。",
  "まあ頑張ったんじゃない？",
  "偉業の国…なんちゃって",
  "はいはい。次は？",
  "Tomopiloくんも喜んでるよ。",
  "つるちゃんぬに負けるな！",
  "しの抹茶くんも感激してる。",
  "お餅くん、褒めてあげて？",
  "一方Kish.はまだ寝てるみたい。",
  "これにはヤソくんもにっこり。",
  "らこちゃんもびっくりしてるよ。",
  "じゃあ…そこのKish.さん、コメントをどうぞ",
  "MINA君が焦ってる！",
  "猪瀬君、これってすごいの？",
  "特別にささやまくんから笹をプレゼント。",
  "A2は　スーパーハイテンションになった！",
  "はいはいえらいえらい。",
  "褒めればいいんでしょ褒めれば。すごいねー。",
  "もっと早くやれたような気はするけど。",
  "お疲れさま。頑張ったじゃない。",
  "ん。頑張ったねー。",
  "まだやることあるでしょ？",
  "…にやにやしないでよ。気持ち悪い。",
  "で？",
  "通知うざくない？大丈夫？",
  "やる気を感じる。",
  "で、君は？",
  "カレーうどんくらいなら奢るけど。遠慮しなくていいよ。",
  "まだまだこっから！",
  "いいぞいいぞいいぞ！って感じ。",
  "う〜ん これは :aiseru: かも。",
  "ガンガンいきましょ！",
  "可不ちゃんって呼ぶな！",
]);

/**
 * ランダムなねぎらいの言葉
 */
const getRandomCongratulatoryWord = (): string =>
  [...congratulatoryWords][
    Math.floor(Math.random() * congratulatoryWords.size)
  ];
