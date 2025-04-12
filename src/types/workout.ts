
export interface Set {
  id: string;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  isCompleted: boolean;
}
