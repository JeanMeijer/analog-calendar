"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
  defaultTaskValues,
  taskFormSchema,
  useAppForm,
} from "@/components/tasks/form";
import { getErrorMessage, toTaskRequest } from "@/components/tasks/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/lib/trpc/client";

interface TaskFormProps {
  accountId: string;
  categories: { id: string; title: string }[];
  defaultCategoryId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({
  accountId,
  categories,
  defaultCategoryId,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation(
    trpc.tasks.createTask.mutationOptions({
      onMutate: async (newTask) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({
          queryKey: trpc.tasks.list.queryKey(),
        });

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(
          trpc.tasks.list.queryKey(),
        );

        // Optimistically update to the new value
        queryClient.setQueryData(trpc.tasks.list.queryKey(), (old: any) => {
          if (!old?.accounts) return old;

          return {
            ...old,
            accounts: old.accounts.map((account: any) => {
              if (account.id === newTask.accountId) {
                return {
                  ...account,
                  tasks: [
                    {
                      id: `temp-${Date.now()}`, // Temporary ID
                      title: newTask.task.title,
                      categoryId: newTask.categoryId,
                      categoryTitle:
                        old.accounts
                          .find((acc: any) => acc.id === newTask.accountId)
                          ?.tasks?.find(
                            (task: any) =>
                              task.categoryId === newTask.categoryId,
                          )?.categoryTitle || "Uncategorized",
                      status: newTask.task.status,
                      notes: newTask.task.notes,
                      due: newTask.task.due,
                      completed: newTask.task.completed,
                    },
                    ...account.tasks,
                  ],
                };
              }
              return account;
            }),
          };
        });

        // Return a context object with the snapshotted value
        return { previousData };
      },
      onError: (err, newTask, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.tasks.list.queryKey(),
            context.previousData,
          );
        }
        toast.error("Failed to create task");
        console.error(err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.queryKey() });
        onSuccess?.();
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: trpc.tasks.list.queryKey() });
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      ...defaultTaskValues,
      categoryId: defaultCategoryId || categories[0]?.id || "",
    },
    validators: {
      onChange: taskFormSchema,
    },
    onSubmit: async ({ value }) => {
      createTaskMutation.mutate({
        accountId,
        categoryId: value.categoryId,
        task: toTaskRequest(value),
      });
    },
  });

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <SidebarMenuItem className="group/item">
      <div className="relative w-full">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-transparent p-0 text-neutral-400 hover:bg-transparent hover:text-white dark:bg-transparent dark:hover:bg-transparent"
          aria-label="Close"
        >
          <X className="h-3 w-3" />
        </Button>
        <form
          className="mt-2 flex flex-col"
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await form.handleSubmit();
          }}
        >
          <div className="space-y-2">
            <form.Field name="title">
              {(field) => (
                <div>
                  <Label htmlFor={field.name} className="sr-only">
                    Title
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Title"
                    className="rounded-md border-none bg-transparent shadow-none placeholder:text-neutral-400 focus:ring-0 dark:bg-transparent dark:focus:ring-0"
                    autoFocus
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className="mt-1 ml-3 text-xs text-red-500">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="notes">
              {(field) => (
                <div>
                  <Label htmlFor={field.name} className="sr-only">
                    Description
                  </Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Description"
                    className="min-h-[60px] resize-none rounded-md border-none bg-transparent shadow-none focus:ring-0 dark:bg-transparent dark:focus:ring-0"
                  />
                </div>
              )}
            </form.Field>

            <div className="flex gap-1">
              <form.Field name="due">
                {(field) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto flex-1 justify-start rounded-full border-none bg-neutral-800 text-left font-normal"
                      >
                        <CalendarIcon className="size-4" />
                        {field.state.value
                          ? format(field.state.value, "dd MMM")
                          : "Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.state.value}
                        onSelect={(date) => {
                          field.handleChange(date);
                          field.handleBlur();
                        }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </form.Field>

              <form.Field name="categoryId">
                {(field) => (
                  <div className="flex-1">
                    <Label htmlFor={field.name} className="sr-only">
                      Category
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        field.handleBlur();
                      }}
                    >
                      <SelectTrigger className="rounded-full border-none bg-neutral-800 shadow-none">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="line-clamp-1">
                              {category.title}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors.length > 0 && (
                      <span className="mt-1 text-xs text-red-500">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </span>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="icon"
                    className="size-9 rounded-full bg-neutral-600/20 hover:bg-neutral-600 disabled:opacity-50"
                    disabled={!canSubmit || isSubmitting}
                  >
                    <Plus />
                  </Button>
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </SidebarMenuItem>
  );
}

export function AddTask({
  accountId,
  categoryId,
  categories,
  isOpen,
  onOpen,
  onSuccess,
  onCancel,
}: {
  accountId: string;
  categoryId: string;
  categories: { id: string; title: string }[];
  isOpen: boolean;
  onOpen?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  if (isOpen) {
    return (
      <TaskForm
        accountId={accountId}
        categories={categories}
        defaultCategoryId={categoryId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
  }

  return (
    <SidebarMenuItem className="group/item">
      <SidebarMenuButton onClick={onOpen} className="hover:bg-neutral-600/20">
        <div className="relative flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          <span className="line-clamp-1 block select-none">Add task</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
