import { Task } from "./task.ts";

export const commentToDiscord = async (parameter: {
  readonly discordWebHookUrl: string;
  readonly userMap: ReadonlyMap<string, string>;
  readonly task: Task;
}) => {
  const userMap = new Map([...parameter.userMap]);
  userMap.delete(parameter.task.userId);
  await fetch(parameter.discordWebHookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      content: `**${parameter.userMap.get(parameter.task.userId)}**が**「${
        parameter.task.name
      }」**を完了！ ${getRandomCongratulatoryWord(new Set(userMap.values()))}`,
    }),
  });
};

/**
 * ランダムなねぎらいの言葉
 */
const getRandomCongratulatoryWord = (
  userNameSet: ReadonlySet<string>
): string => {
  const user = [...userNameSet][Math.floor(Math.random() * userNameSet.size)];
  const congratulatoryWords = [
    "お疲れー。",
    "まあ頑張ったんじゃない？",
    "偉業の国…なんちゃって",
    "はいはい。次は？",
    `${user}も喜んでるよ。`,
    `${user}に負けるな！`,
    `${user}も感激してる。`,
    `${user}、褒めてあげて？`,
    `一方Kish.はまだ寝てるみたい。`,
    `これには${user}もにっこり。`,
    `${user}もびっくりしてるよ。`,
    `じゃあ…そこの${user}さん、コメントをどうぞ`,
    `${user}が焦ってる！`,
    `${user}、これってすごいの？`,
    "特別にささやまくんから笹をプレゼント。",
    `${user}　スーパーハイテンションになった！`,
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
  ];
  return congratulatoryWords[
    Math.floor(Math.random() * congratulatoryWords.length)
  ];
};
