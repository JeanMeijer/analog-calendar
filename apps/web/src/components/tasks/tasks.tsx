"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { useResizeObserver } from "@react-hookz/web";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { AddTask } from "@/components/tasks/task-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export type Task = {
  id: string;
  title?: string;
  categoryId?: string;
  categoryTitle?: string;
  status?: string;
  completed?: string;
  notes?: string;
  due?: string;
};

function useTaskList() {
  const trpc = useTRPC();

  return useQuery(trpc.tasks.list.queryOptions());
}

export function Tasks() {
  const { data, isLoading } = useTaskList();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openAddTask, setOpenAddTask] = useState<{
    accountId: string;
    categoryId: string;
  } | null>(null);

  const updateTaskMutation = useMutation(
    trpc.tasks.updateTask.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.queryKey() });
      },
    }),
  );

  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (!data) {
    return null;
  }

  // Helper to group and sort tasks by category
  function getGroupedCategories(tasks: Task[]) {
    const grouped = tasks.reduce(
      (acc, task) => {
        const categoryId = task.categoryId || "";
        (acc[categoryId] ||= []).push(task);
        return acc;
      },
      {} as Record<string, Task[]>,
    );

    return Object.keys(grouped)
      .sort((a, b) => {
        if (a === "") return 1;
        if (b === "") return -1;
        return a.localeCompare(b);
      })
      .map((categoryId) => ({
        id: categoryId,
        title: grouped[categoryId]?.[0]?.categoryTitle ?? "Uncategorized",
        tasks: grouped[categoryId],
      }));
  }

  return (
    <div className="relative flex scrollbar-hidden flex-1 flex-col gap-2 overflow-auto">
      {data.accounts.map((account, index) => {
        const groupedCategories = getGroupedCategories(account.tasks);
        return (
          <Fragment key={account.name}>
            <SidebarGroup key={account.name} className="py-0">
              <Collapsible
                defaultOpen={index === 0}
                className="group/collapsible"
              >
                <AccountName name={account.name} />
                <CollapsibleContent>
                  <SidebarGroupContent>
                    {groupedCategories.map((category) => (
                      <div key={category.id}>
                        <SidebarGroupLabel className="pl-2 text-xs text-muted-foreground">
                          {category.title}
                        </SidebarGroupLabel>
                        <SidebarMenu>
                          {(category.tasks ?? []).map((item: Task) => (
                            <TaskItem
                              key={item.id}
                              item={item}
                              accountId={account.id}
                              categoryId={category.id}
                              updateTaskMutation={updateTaskMutation}
                            />
                          ))}
                          {openAddTask?.accountId === account.id &&
                          openAddTask?.categoryId === category.id ? (
                            <AddTask
                              accountId={account.id}
                              categoryId={category.id}
                              categories={groupedCategories.map((cat) => ({
                                id: cat.id,
                                title: cat.title,
                              }))}
                              onSuccess={() => setOpenAddTask(null)}
                              onCancel={() => setOpenAddTask(null)}
                              isOpen={true}
                            />
                          ) : (
                            <AddTask
                              accountId={account.id}
                              categoryId={category.id}
                              categories={groupedCategories.map((cat) => ({
                                id: cat.id,
                                title: cat.title,
                              }))}
                              onOpen={() =>
                                setOpenAddTask({
                                  accountId: account.id,
                                  categoryId: category.id,
                                })
                              }
                              isOpen={false}
                            />
                          )}
                        </SidebarMenu>
                      </div>
                    ))}
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
            <SidebarSeparator className="mx-0" />
          </Fragment>
        );
      })}
    </div>
  );
}

function TasksSkeleton() {
  const accountsData = [{ tasks: 3 }, { tasks: 2 }];

  return (
    <div className="flex flex-col gap-2 pb-2">
      {accountsData.map((account, accountIndex) => (
        <div key={accountIndex}>
          <div className="flex items-center gap-2 px-2 py-2">
            <Skeleton className="animate-shimmer h-4 w-24 bg-neutral-500/20" />
            <div className="ml-auto">
              <Skeleton className="h-4 w-4 bg-neutral-500/20" />
            </div>
          </div>
          <div className="space-y-1 pl-0.5">
            {Array.from({ length: account.tasks }).map((_, taskIndex) => (
              <div
                key={taskIndex}
                className="flex items-center gap-2 px-2 py-2"
              >
                <Skeleton className="h-4 w-4 rounded bg-neutral-500/20" />
                <Skeleton className="animate-shimmer h-4 flex-1 bg-neutral-500/20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AccountName({ name }: { name: string }) {
  const nameParts = useMemo(() => {
    if (name.includes("@")) {
      const parts = name.split("@");
      return [parts[0], `@${parts[1]}`];
    }
    return [name, ""];
  }, [name]);

  return (
    <SidebarGroupLabel
      asChild
      className="group/label w-full text-sm hover:bg-sidebar-accent"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <span className="truncate">{nameParts[0]}</span>
        <span className="mr-1 block flex-1 text-left">{nameParts[1]}</span>
        <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
    </SidebarGroupLabel>
  );
}

function TaskItem({
  item,
  accountId,
  categoryId,
  updateTaskMutation,
}: {
  item: Task;
  accountId: string;
  categoryId: string;
  updateTaskMutation: any;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const isOptimistic = item.id.startsWith("temp-");

  // Check for text truncation whenever the element resizes
  useResizeObserver(textRef, () => {
    const element = textRef.current;
    if (element) {
      setIsTextTruncated(element.scrollWidth > element.clientWidth);
    }
  });

  const tooltipProps = {
    side: "bottom" as const,
    align: "start" as const,
    sideOffset: 8,
    className: "bg-sidebar-accent text-sidebar-accent-foreground",
    children: item.title,
  };

  return (
    <SidebarMenuItem key={item.id} className="group/item">
      <SidebarMenuButton
        asChild
        tooltip={isTextTruncated ? tooltipProps : undefined}
        className={cn("hover:bg-neutral-600/20", {
          "opacity-70": isOptimistic,
        })}
      >
        <div className="relative">
          <Checkbox
            className="dark:border-neutral-700"
            checked={!!item.completed}
            disabled={isOptimistic}
            onCheckedChange={(checked: boolean) => {
              updateTaskMutation.mutate({
                accountId,
                categoryId,
                task: {
                  ...item,
                  status: checked ? "completed" : "needsAction",
                  completed: checked ? new Date().toISOString() : undefined,
                },
              });
            }}
          />
          <span
            ref={textRef}
            className={cn("line-clamp-1 block select-none", {
              "line-through opacity-50": !!item.completed,
            })}
          >
            {item.title}
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
