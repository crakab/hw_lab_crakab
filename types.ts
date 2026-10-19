// Route names and their params for the stack navigator. EditPerson only gets
// the person's id; the screen looks up the latest copy from context.
export type RootStackParamList = {
  People: undefined;
  EditPerson: { personId: string };
};
