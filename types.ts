// screens in the tasks tab stack. TaskDetails only gets the task id and then
// looks up the newest version from context
export type TasksStackParamList = {
  TasksList: undefined;
  TaskDetails: { taskId: string };
};

// the two bottom tabs
export type RootTabParamList = {
  Tasks: undefined;
  NewTask: undefined;
};
