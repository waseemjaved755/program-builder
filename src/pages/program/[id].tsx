"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, ArrowUpDown, Trash2, Search } from "lucide-react"

interface Exercise {
  name: string
  sets: number
  reps: number | string
  rest: number
}

interface Circuit {
  circuit: string
  type: string
  exercises: Exercise[]
}

interface WorkoutDay {
  day: number
  circuits: Circuit[]
}

interface WeekPlan {
  week: number
  workouts: WorkoutDay[]
}

interface ProgramData {
  user_id: string
  program: {
    program_name: string
    duration_weeks: number
    days_per_week: number
    session_duration_minutes: number
    training_style: string[]
    fitness_level: string
    primary_focus: string[]
    secondary_focus: string[]
    equipment: string[]
    location: string
    progressively_challenging: boolean
    workout_plan: WeekPlan[]
  }
}

// Static test data (Will be replaced with the API Actual data)
const staticData: ProgramData = {
  user_id: "b9e8a5fb-7a8d-4ea5-b668-ab74902c4dbc",
  program: {
    program_name: "Test Full Body Program",
    duration_weeks: 3,
    days_per_week: 3,
    session_duration_minutes: 30,
    training_style: ["Bodyweight only"],
    fitness_level: "Beginner",
    primary_focus: ["Full Body"],
    secondary_focus: ["Cardio"],
    equipment: ["Yoga Mat", "Resistance Bands"],
    location: "Home",
    progressively_challenging: true,
    workout_plan: [
      {
        week: 1,
        workouts: [
          {
            day: 1,
            circuits: [
              {
                circuit: "A",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Barbell Bench Press",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
              {
                circuit: "B",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Cable Pullover",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
              {
                circuit: "C",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Cable Pullover",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
              {
                circuit: "D",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Cable Pullover",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
              {
                circuit: "E",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Lat Pulldowns",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
            ],
          },
          {
            day: 2,
            circuits: [
              {
                circuit: "A",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Barbell Bench Press",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
              {
                circuit: "B",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Cable Pullover",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        week: 2,
        workouts: [
          {
            day: 1,
            circuits: [
              {
                circuit: "A",
                type: "Regular Set",
                exercises: [
                  {
                    name: "Barbell Bench Press",
                    sets: 3,
                    reps: "12, 10, 8",
                    rest: 95,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}

const exercisesToRecord = [
  "Hip Bridges",
  "Foam Rolling",
  "Burpees",
  "Shoulder Press",
  "Sled Push",
  "Resistance Band Walk",
  "Lunges",
  "Hip Bridges",
  "Jump Squats",
  "Deadlifts",
  "Push-Ups",
]

export default function ProgramViewer() {
  const [selectedWeek, setSelectedWeek] = useState(1)

  
  const weekData =
    staticData.program.workout_plan.find((w) => w.week === selectedWeek) || staticData.program.workout_plan[0]

  
  const getDayName = (day: number) => {
    switch (day) {
      case 1:
        return "Upper Body"
      case 2:
        return "Lower Body"
      case 3:
        return "Rest"
      default:
        return "Full Body"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        
        <div className="flex items-center justify-between p-4 bg-white">
          <div className="flex space-x-2">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedWeek === week ? "bg-indigo-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Week {week}
              </button>
            ))}
            <button className="px-2 py-2 rounded-md bg-white">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-md border border-indigo-500 text-indigo-500 bg-white">
              Re-generate
            </button>
            <button className="px-4 py-2 rounded-md bg-indigo-500 text-white">Export</button>
          </div>
        </div>

        <div className="flex">
          
          <div className="flex-1 p-4">
            
            {weekData.workouts.map((workout, index) => (
              <div key={index} className="mb-6">
                
                <div className="flex items-center justify-between bg-indigo-100 p-4">
                  <h2 className="text-lg font-medium">
                    Day {workout.day} - {getDayName(workout.day)}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <ArrowUpDown className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                
                <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
                  <div className="p-4 font-medium text-gray-700">Circuits</div>
                  <div className="p-4 font-medium text-gray-700">Exercise</div>
                  <div className="p-4 font-medium text-gray-700">Sets</div>
                  <div className="p-4 font-medium text-gray-700">Reps</div>
                  <div className="p-4 font-medium text-gray-700">Rest Time</div>
                  <div className="p-4 font-medium text-gray-700">Notes</div>
                  <div className="p-4 flex justify-end">
                    <button className="flex items-center text-indigo-600 hover:text-indigo-800">
                      <Plus className="h-4 w-4 mr-1" />
                      <span className="text-indigo-600">Circuit</span>
                    </button>
                  </div>
                </div>

                
                {workout.circuits.map((circuit, cIdx) => (
                  <div key={cIdx}>
                    
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
                      <div className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                        {circuit.type}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    
                    {circuit.exercises.map((exercise, exIdx) => (
                      <div key={exIdx} className="grid grid-cols-7 items-center border-b border-gray-200 bg-white">
                        <div className="p-4 font-medium">{circuit.circuit}</div>
                        <div className="p-4">{exercise.name}</div>
                        <div className="p-4">{exercise.sets}</div>
                        <div className="p-4">12, 10, 8</div>
                        <div className="p-4">95, 115, 135</div>
                        <div className="p-4">1-3-1 tempo</div>
                        <div className="flex justify-end space-x-2 p-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ArrowUpDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            
            <div className="mt-8 flex justify-center space-x-4 pb-8">
              <button className="w-48 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Reset to Default
              </button>
              <button className="w-48 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                Apply Changes
              </button>
            </div>
          </div>

          
          <div className="w-80 bg-white p-6 border-l border-gray-200">
            <h2 className="text-xl font-bold mb-6">Exercises Needed To Record (88)</h2>

            
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                placeholder="Search exercise"
              />
            </div>

            
            <div className="space-y-6">
              {exercisesToRecord.map((exercise, index) => (
                <div key={index} className="text-gray-800">
                  {exercise}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
