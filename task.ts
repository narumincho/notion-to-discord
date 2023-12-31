import { Client } from "https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts";

export type Task = {
  readonly id: string;
  readonly name: string;
  readonly lv: "Lv. 1" | "Lv. 10";
  readonly userId: string;
};

export const getTasksCompleted = async (
  notionClient: Client,
  warnLog: (text: string) => void
): Promise<ReadonlyArray<Task>> => {
  const task: Task[] = [];
  let cursor: string | undefined = undefined;
  while (true) {
    const taskCompleted = await notionClient.databases.query({
      database_id: "09570165012942c8bf11b78f71b52683",
      start_cursor: cursor,
      filter: {
        type: "status",
        property: "ステータス",
        status: {
          equals: "完了",
        },
      },
    });
    task.push(
      ...taskCompleted.results.flatMap<Task>((page) => {
        if (!("properties" in page)) {
          return [];
        }
        const nameProperty = page.properties["名前"];
        if (nameProperty.type !== "title") {
          warnLog(`名前がタイトルじゃない ${nameProperty.type}`);
          return [];
        }

        const userProperty = page.properties["ユーザー"];
        if (userProperty.type !== "relation") {
          warnLog(`ユーザーがリレーションじゃない ${userProperty.type}`);
          return [];
        }

        const lvProperty = page.properties["Lv"];
        if (lvProperty.type !== "select") {
          warnLog(`Lvがセレクトじゃない ${lvProperty.type}`);
          return [];
        }

        return [
          {
            id: page.id,
            name: nameProperty.title.map((item) => item.plain_text).join(""),
            lv: lvProperty.select?.name as Task["lv"],
            userId: userProperty.relation[0].id,
          },
        ];
      })
    );
    if (!taskCompleted.next_cursor) {
      return task;
    }
    cursor = taskCompleted.next_cursor;
  }
};

export const setTaskCompletedAndCommented = async (
  notionClient: Client,
  taskId: string
): Promise<void> => {
  await notionClient.pages.update({
    page_id: taskId,
    properties: {
      ステータス: { type: "status", status: { name: "完了(コメント済み)" } },
    },
  });
};
