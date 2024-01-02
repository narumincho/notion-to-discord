import { Client } from "https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts";

export type Review = {
  readonly id: string;
  readonly body: string;
  readonly userId: string;
  readonly achievementRate100: number;
};

export const getReviewsSubmitted = async (
  notionClient: Client,
  cursor: string | undefined
): Promise<Review[]> => {
  const review: Review[] = [];
  while (true) {
    const reviewSubmitted = await notionClient.databases.query({
      database_id: "814cf4a5c7a7410b9c5d4a917880c39a",
      start_cursor: cursor,
      filter: {
        type: "select",
        property: "提出",
        select: {
          equals: "提出",
        },
      },
    });
    review.push(
      ...(await Promise.all(
        reviewSubmitted.results.flatMap<Promise<Review>>(async (page) => {
          if (!("properties" in page)) {
            return [];
          }

          const userProperty = page.properties["ユーザー"];
          if (userProperty.type !== "relation") {
            console.warn(`ユーザーがリレーションじゃない ${userProperty.type}`);
            return [];
          }

          const achievementRate100Property = page.properties["達成度"];
          if (achievementRate100Property.type !== "number") {
            console.warn(
              `達成度がnumberじゃない ${achievementRate100Property.type}`
            );
            return [];
          }

          notionClient.pages.retrieve({});

          return [
            {
              id: page.id,
              body: nameProperty.title.map((item) => item.plain_text).join(""),
              userId: userProperty.relation[0].id,
              achievementRate100: achievementRate100Property.number,
            },
          ];
        })
      ))
    );
    if (!reviewSubmitted.next_cursor) {
      return review;
    }
    cursor = reviewSubmitted.next_cursor;
  }
};
