import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";

export default function ProgramPage() {
  const router = useRouter();
  const { id } = router.query;

  const programWrapper = useSelector((state: RootState) => state.program.program);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Handle actual structure
  const program = programWrapper; // No nested .program
  const weeks = program?.weeks || [];
  const currentWeek = weeks[0]; // Future: make this dynamic for week selection
  const days = currentWeek?.workouts || [];

  useEffect(() => {
    console.log("Loaded program:", programWrapper);
  }, [programWrapper]);

  if (!router.isReady || !Array.isArray(days) || days.length === 0) {
    return (
      <div className="text-center mt-10 text-lg text-gray-500">
        No program found for ID: {id}
      </div>
    );
  }

  const exercisesList: string[] = Array.from(
    new Set(
      days.flatMap((day: any) =>
        day.circuits.flatMap((circuit: any) =>
          circuit.exercises.map((exercise: any) => exercise.name)
        )
      )
    )
  );

  return (
    <div className="flex min-h-screen px-6 py-8 gap-6 font-poppins bg-[#FAFAFB]">
      {/* Main Content */}
      <div className="flex-1">
        {/* Week Tabs */}
        <div className="flex gap-2 mb-6">
          {[...Array(6)].map((_, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                idx === 0 ? "bg-[#6367EF] text-white" : "bg-[#F0F0F5] text-gray-800"
              }`}
            >
              Week {idx + 1}
            </button>
          ))}
        </div>

        {/* Day View */}
        {days.length > 0 && (
          <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white mb-8">
            {/* Day Header */}
            <div className="bg-[#CBCDEB] px-4 py-3 text-lg font-semibold flex justify-between items-center">
              Day {days[selectedDayIndex].day} - Upper Body
              <div className="flex items-center gap-2">
                <button className="text-gray-600">⋮</button>
                <button className="text-gray-600">⇅</button>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-6 text-sm bg-[#F5F5FA] border-b border-gray-200 px-4 py-2 font-semibold">
              <div>Circuits</div>
              <div>Exercise</div>
              <div>Sets</div>
              <div>Reps</div>
              <div>Rest Time</div>
              <div>Notes</div>
            </div>

            {/* Table Body */}
            {days[selectedDayIndex].circuits.map((circuit: any, cIdx: number) =>
              circuit.exercises.map((exercise: any, eIdx: number) => (
                <div
                  key={`${cIdx}-${eIdx}`}
                  className="grid grid-cols-6 px-4 py-3 text-sm items-center border-b border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F0F0F5] text-xs px-2 py-0.5 rounded-full text-gray-700">
                      {exercise.intensifier}
                    </span>
                    <span>{circuit.name}</span>
                  </div>
                  <div>{exercise.name}</div>
                  <div>{exercise.sets}</div>
                  <div>{exercise.reps}</div>
                  <div>{exercise.rest}</div>
                  <div>1–3–1 tempo</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-[300px] bg-white rounded-xl p-4 shadow-sm border">
        <h2 className="text-lg font-semibold mb-3">
          Exercises Needed To Record ({exercisesList.length})
        </h2>
        <input
          type="text"
          placeholder="Search exercise"
          className="w-full mb-4 px-4 py-2 border rounded bg-[#F4F4F4]"
        />
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {exercisesList.map((name, i) => (
            <li key={i} className="border-b py-1 text-sm text-gray-800">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
