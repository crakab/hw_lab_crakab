// one task in the firestore "tasks" collection. id is optional bc a new task
// doesnt have one until firestore makes it when we add it
export interface TaskItem {
  id?: string;
  name: string;
  assignedTo: string;
  dueDate: Date;
  dateAdded: Date;
  completed: boolean;
}

// checks that the name and the assignee both actually have something in them
// (not empty or just spaces). both the new task and edit screens use this
export function isValidTask(name: string, assignedTo: string): boolean {
  return name.trim().length > 0 && assignedTo.trim().length > 0;
}

// for .sort(), puts tasks in alphabetical order by name
export function compareTasksByName(a: TaskItem, b: TaskItem): number {
  return a.name.localeCompare(b.name);
}

// for .sort(), puts tasks in order by due date with the earliest one first
export function compareTasksByDueDate(a: TaskItem, b: TaskItem): number {
  return a.dueDate.getTime() - b.dueDate.getTime();
}

// two tasks count as the same if the name, assignee and due date match.
// it doesnt care about id, dateAdded or if its completed
export function areTasksEqual(a: TaskItem, b: TaskItem): boolean {
  return (
    a.name === b.name &&
    a.assignedTo === b.assignedTo &&
    a.dueDate.getTime() === b.dueDate.getTime()
  );
}
