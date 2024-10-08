"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EditTaskDialog } from "./editTaskModal";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { DeleteTaskAlertDialog } from "./deleteTaskAlertDialog";
import { useToast } from "@/hooks/use-toast";
import { UndoTaskCompletionAlertDialog } from "./undoTaskCompletionDialog";

interface TaskDataProps {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

interface TaskCardProps extends TaskDataProps {
  task?: TaskDataProps[] | undefined;
  onTaskDelete: (taskId: number) => void;
  onTaskComplete: (taskId: number) => void;
  onUndoCompletion: (taskId: number) => void; // Corrected Typo
  onTaskEdit: (taskId: number, newName: string, newDescription: string) => void;
}

const TaskCard = ({
  id,
  name,
  description,
  completed,
  onTaskDelete,
  onTaskComplete,
  onUndoCompletion, // Corrected Typo
  onTaskEdit,
  createdAt,
  task,
}: TaskCardProps) => {
  const { toast } = useToast();

  // Handler for marking task as completed
  const completeTask = () => {
    onTaskComplete(id); // Notify parent that the task is completed
    toast({
      title: "Task completed",
      description: "Your task has been marked as completed",
    });
  };

  // Format the createdAt property
  const formattedDate = new Date(createdAt).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Card className="shadow-sm overflow-hidden relative min-h-[200px]">
        {!completed ? (
          <Button
            onClick={completeTask}
            variant="link"
            size="sm"
            title="Complete task"
            className="text-xs absolute bottom-0 right-0 m-2 no-underline duration-300 ease-in py-1 px-2 outline-none bg-gray-100"
          >
            <Check size={16} strokeWidth={1} />
          </Button>
        ) : (
          <UndoTaskCompletionAlertDialog
            taskId={id}
            tasks={task}
            onToggleComplete={() => onUndoCompletion(id)} // Correctly passed handler for undo
          />
        )}

        <CardHeader className="p-3 flex items-center flex-row">
          <div className="mr-auto">
            <CardTitle className="truncate text-base max-w-[200px]">
              {name}
            </CardTitle>
            <div className="text-xs md:flex-col md:items-start flex flex-row items-center md:gap-2">
              <div>Created {formattedDate}</div>

              <div
                className={`${
                  completed ? "bg-green-500" : "bg-yellow-500"
                } text-white leading-[1px] absolute bottom-0 left-0 m-2 p-2.5 shadow rounded-sm`}
              >
                {completed ? "Completed" : "Pending"}
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-row items-center gap-1">
              <EditTaskDialog
                taskDescription={description}
                taskId={id}
                taskName={name}
                onTaskEdit={onTaskEdit} // Pass onTaskEdit handler
              />
              <DeleteTaskAlertDialog
                taskId={id}
                onTaskDelete={onTaskDelete} // Pass the delete handler to the dialog
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3">
          <p className="text-gray-500 text-xs">{description}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default TaskCard;
