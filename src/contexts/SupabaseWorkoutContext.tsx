import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

// Types
export interface Set {
  id: string;
  reps: number;
  weight: number;
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

interface WorkoutContextType {
  workouts: Workout[];
  currentWorkout: Workout | null;
  startNewWorkout: (name: string) => void;
  addExerciseToWorkout: (workoutId: string, exerciseName: string) => void;
  addSetToExercise: (workoutId: string, exerciseId: string) => void;
  updateSet: (workoutId: string, exerciseId: string, setId: string, updatedSet: Partial<Set>) => void;
  completeWorkout: (workoutId: string) => void;
  deleteWorkout: (workoutId: string) => void;
  deleteExercise: (workoutId: string, exerciseId: string) => void;
  deleteSet: (workoutId: string, exerciseId: string, setId: string) => void;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch workouts from Supabase when user changes
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) {
        setWorkouts([]);
        setCurrentWorkout(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the database workouts into the app format
        // In a real app, you would fetch exercises and sets in separate queries
        // For this demo, we'll keep using the existing structure but store the main workout data
        const formattedWorkouts: Workout[] = data.map(workout => ({
          id: workout.id,
          name: workout.name,
          date: new Date(workout.date),
          isCompleted: workout.is_completed,
          exercises: [], // In a real app, fetch these from a related table
        }));

        setWorkouts(formattedWorkouts);

        // Set the current workout to the most recent incomplete workout if it exists
        const incompleteWorkout = formattedWorkouts.find(w => !w.isCompleted);
        if (incompleteWorkout) {
          setCurrentWorkout(incompleteWorkout);
        } else {
          setCurrentWorkout(null);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load workouts. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [user]);

  // Start a new workout
  const startNewWorkout = async (name: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a workout',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newWorkout: Workout = {
        id: uuidv4(),
        name,
        date: new Date(),
        exercises: [],
        isCompleted: false,
      };

      // Insert the workout into Supabase
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          id: newWorkout.id,
          user_id: user.id,
          name: newWorkout.name,
          date: newWorkout.date.toISOString(),
          is_completed: newWorkout.isCompleted,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setWorkouts(prev => [newWorkout, ...prev]);
      setCurrentWorkout(newWorkout);
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to create workout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Add exercise to workout
  const addExerciseToWorkout = (workoutId: string, exerciseName: string) => {
    setWorkouts(prev => 
      prev.map(workout => {
        if (workout.id === workoutId) {
          const newExercise: Exercise = {
            id: uuidv4(),
            name: exerciseName,
            sets: [],
          };
          
          return {
            ...workout,
            exercises: [...workout.exercises, newExercise],
          };
        }
        return workout;
      })
    );

    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(prev => {
        if (prev) {
          const newExercise: Exercise = {
            id: uuidv4(),
            name: exerciseName,
            sets: [],
          };
          
          return {
            ...prev,
            exercises: [...prev.exercises, newExercise],
          };
        }
        return prev;
      });
    }
  };

  // Add set to exercise
  const addSetToExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(prev => 
      prev.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                const newSet: Set = {
                  id: uuidv4(),
                  reps: 0,
                  weight: 0,
                  isCompleted: false,
                };
                
                return {
                  ...exercise,
                  sets: [...exercise.sets, newSet],
                };
              }
              return exercise;
            }),
          };
        }
        return workout;
      })
    );

    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(prev => {
        if (prev) {
          return {
            ...prev,
            exercises: prev.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                const newSet: Set = {
                  id: uuidv4(),
                  reps: 0,
                  weight: 0,
                  isCompleted: false,
                };
                
                return {
                  ...exercise,
                  sets: [...exercise.sets, newSet],
                };
              }
              return exercise;
            }),
          };
        }
        return prev;
      });
    }
  };

  // Update set
  const updateSet = (workoutId: string, exerciseId: string, setId: string, updatedSet: Partial<Set>) => {
    setWorkouts(prev => 
      prev.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
                    if (set.id === setId) {
                      return { ...set, ...updatedSet };
                    }
                    return set;
                  }),
                };
              }
              return exercise;
            }),
          };
        }
        return workout;
      })
    );

    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(prev => {
        if (prev) {
          return {
            ...prev,
            exercises: prev.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
                    if (set.id === setId) {
                      return { ...set, ...updatedSet };
                    }
                    return set;
                  }),
                };
              }
              return exercise;
            }),
          };
        }
        return prev;
      });
    }
  };

  // Complete workout
  const completeWorkout = async (workoutId: string) => {
    if (!user) return;
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('workouts')
        .update({ is_completed: true })
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setWorkouts(prev => 
        prev.map(workout => {
          if (workout.id === workoutId) {
            return { ...workout, isCompleted: true };
          }
          return workout;
        })
      );

      if (currentWorkout?.id === workoutId) {
        setCurrentWorkout(null);
      }

      toast({
        title: 'Success',
        description: 'Workout completed successfully!',
      });
    } catch (error) {
      console.error('Error completing workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete workout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete workout
  const deleteWorkout = async (workoutId: string) => {
    if (!user) return;
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));

      if (currentWorkout?.id === workoutId) {
        setCurrentWorkout(null);
      }
      
      toast({
        title: 'Success',
        description: 'Workout deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete exercise
  const deleteExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(prev => 
      prev.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.filter(exercise => exercise.id !== exerciseId),
          };
        }
        return workout;
      })
    );

    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(prev => {
        if (prev) {
          return {
            ...prev,
            exercises: prev.exercises.filter(exercise => exercise.id !== exerciseId),
          };
        }
        return prev;
      });
    }
  };

  // Delete set
  const deleteSet = (workoutId: string, exerciseId: string, setId: string) => {
    setWorkouts(prev => 
      prev.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.filter(set => set.id !== setId),
                };
              }
              return exercise;
            }),
          };
        }
        return workout;
      })
    );

    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(prev => {
        if (prev) {
          return {
            ...prev,
            exercises: prev.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.filter(set => set.id !== setId),
                };
              }
              return exercise;
            }),
          };
        }
        return prev;
      });
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      currentWorkout,
      startNewWorkout,
      addExerciseToWorkout,
      addSetToExercise,
      updateSet,
      completeWorkout,
      deleteWorkout,
      deleteExercise,
      deleteSet,
      isLoading,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
