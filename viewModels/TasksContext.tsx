import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TaskItem } from '../models/TaskItem';

const COLLECTION = 'tasks';

type TasksContextValue = {
  tasks: TaskItem[];
  loading: boolean;
  addTask: (task: Omit<TaskItem, 'id'>) => Promise<void>;
  updateTask: (task: TaskItem) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleCompleted: (task: TaskItem) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

// holds all the tasks for the whole app. it sets up one live firestore
// listener so the list stays updated, and gives every screen functions to
// add, edit, delete and check off tasks
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  // listen to the tasks collection in real time. onSnapshot gives back an
  // unsubscribe function, so returning it here stops listening when the
  // provider goes away (like removing the listener in deinit in swift)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION),
      // runs every time the data changes. turns each firestore doc into a
      // TaskItem (timestamps -> dates), sorts them and saves the list
      (snapshot) => {
        const next: TaskItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            assignedTo: data.assignedTo,
            dueDate: data.dueDate?.toDate() ?? new Date(),
            dateAdded: data.dateAdded?.toDate() ?? new Date(),
            completed: data.completed ?? false,
          };
        });
        // not done tasks first, then earliest due date first
        next.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
        setTasks(next);
        setLoading(false);
      },
      // if something goes wrong (like the test mode rules expired) log it
      // and stop the loading spinner so the app doesnt get stuck
      (error) => {
        console.error('Firestore listener error:', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // adds a new task to firestore. firestore makes the id, and we turn the
  // dates into timestamps first
  const addTask = async (task: Omit<TaskItem, 'id'>) => {
    await addDoc(collection(db, COLLECTION), {
      ...task,
      dueDate: Timestamp.fromDate(task.dueDate),
      dateAdded: Timestamp.fromDate(task.dateAdded),
    });
  };

  // saves the edited name, assignee, due date and completed status for a
  // task that already exists. throws if theres no id
  const updateTask = async (task: TaskItem) => {
    if (!task.id) throw new Error('Cannot update a task without an id');
    await updateDoc(doc(db, COLLECTION, task.id), {
      name: task.name,
      assignedTo: task.assignedTo,
      dueDate: Timestamp.fromDate(task.dueDate),
      completed: task.completed,
    });
  };

  // deletes the task with this id from firestore
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  // flips a task between done and not done. throws if theres no id
  const toggleCompleted = async (task: TaskItem) => {
    if (!task.id) throw new Error('Cannot toggle a task without an id');
    await updateDoc(doc(db, COLLECTION, task.id), { completed: !task.completed });
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleCompleted }}>
      {children}
    </TasksContext.Provider>
  );
}

// hook any screen can call to get the tasks + functions. throws an error if
// you forgot to wrap the app in TasksProvider
export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used inside a TasksProvider');
  return ctx;
}
