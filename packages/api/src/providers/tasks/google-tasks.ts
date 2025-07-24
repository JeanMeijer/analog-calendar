import { GoogleTasks } from "@repo/google-tasks";

import type {
  Category,
  ProviderOptions,
  Task,
  TaskProvider,
} from "../interfaces";

export class GoogleTasksProvider implements TaskProvider {
  public providerId = "google" as const;
  private static readonly TASK_LIST_ID_REGEX = /lists\/(.*?)\/tasks/;
  private client: GoogleTasks;

  constructor({ accessToken }: ProviderOptions) {
    this.client = new GoogleTasks({
      accessToken,
    });
  }

  async categories() {
    const { items } = await this.client.tasks.v1.users.me.lists.list();

    if (!items) return [];

    return items
      .filter((category) => category.id && category.title)
      .map((category) => ({
        id: category.id!,
        provider: "google",
        title: category.title,
        updated: category.updated,
      }));
  }

  async tasks(): Promise<Task[]> {
    const { items: categories } =
      await this.client.tasks.v1.users.me.lists.list();

    const results = await Promise.all(
      categories?.map(async (category) => {
        return await this.client.tasks.v1.lists.tasks.list(category.id!);
      }) ?? [],
    );

    const tasks = results.flatMap((result) => result.items ?? []);

    return tasks
      .filter((task) => task.id && task.title)
      .map((task) => {
        const categoryId = GoogleTasksProvider.TASK_LIST_ID_REGEX.exec(
          task.selfLink ?? "",
        )?.[1];

        return {
          id: task.id!,
          categoryId,
          categoryTitle: categories?.find(
            (category) => category.id === categoryId,
          )?.title,
          title: task.title,
          status: task.status,
          completed: task.completed,
          notes: task.notes,
          due: task.due,
        };
      });
  }

  async tasksForCategory(category: Category): Promise<Task[]> {
    const { items } = await this.client.tasks.v1.lists.tasks.list(category.id!);

    if (!items) return [];

    return items
      .filter((task) => task.id && task.title)
      .map((task) => ({
        id: task.id!,
        categoryId: category.id!,
        categoryTitle: category.title,
        title: task.title,
        status: task.status,
        completed: task.completed,
        notes: task.notes,
        due: task.due,
      }));
  }

  async createTask(category: Category, task: Omit<Task, "id">): Promise<Task> {
    const { id } = await this.client.tasks.v1.lists.tasks.create(
      category.id!,
      task,
    );
    return {
      id: id!,
      categoryId: category.id!,
      ...task,
    };
  }

  async updateTask(category: Category, task: Partial<Task>): Promise<Task> {
    const map = { completed: "completed", notStarted: "needsAction" } as const;
    const status = task.status
      ? (map[task.status as keyof typeof map] ?? "")
      : undefined;

    const { id } = await this.client.tasks.v1.lists.tasks.update(task.id!, {
      tasklist: category.id!,
      ...task,
      ...(status && { status }),
    });

    return {
      id: id!,
      categoryId: category.id!,
      ...task,
      ...(status && { status }),
    };
  }

  async deleteTask(category: Category, taskId: string): Promise<void> {
    await this.client.tasks.v1.lists.tasks.delete(taskId, {
      tasklist: category.id!,
    });
    return;
  }
}
