"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardIcon } from "../ui/icons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { generateProgramRequest } from "@/store/slices/programSlice";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';



interface Field {
  name: string;
  label: string;
  input?: boolean;
  options?: string[];
  multi?: boolean;
  defaultValue?: string | string[];
}

const fields: Field[] = [
  { name: "numberOfWeeks", label: "Number Of Weeks", options: Array.from({ length: 6 }, (_, i) => (i + 1).toString()) },
  { name: "programName", label: "Program Name", input: true },
  { name: "trainingModality", label: "Training Modality", options: ["Strength Training", "Hypertrophy / Muscle Building", "HIIT / Conditioning", "Cardio / Endurance", "Bodyweight / Calisthenics", "Mobility / Yoga / Stretching", "Power / Explosiveness", "Athletic Performance", "Rehabilitation / Injury Prevention", "Core Stability", "Skill-based"], multi: true },
  { name: "difficultyLevel", label: "Difficulty Level", options: ["Beginner", "Intermediate", "Advanced"] },
  { name: "primaryFocus", label: "Primary Focus", options: ["Cardio", "Full Body", "Upper Body", "Chest", "Shoulders", "Back", "Core/Abs", "Biceps", "Triceps", "Lower Body", "Quads"], multi: true },
  { name: "secondaryFocus", label: "Secondary Focus", options: ["Cardio", "Full Body", "Upper Body", "Chest", "Shoulders", "Back", "Core/Abs", "Biceps", "Triceps", "Lower Body", "Quads"], multi: true },
  { name: "daysPerWeek", label: "Days Per Week", options: ["1", "2", "3", "4", "5", "6", "7"] },
  { name: "sessionDuration", label: "How Long Per Workout?", options: ["5–15 Mins", "15–30 Mins", "30–45 Mins", "45–60 Mins", "60–90 Mins", "90–120 Mins", "120+", "Other"] },
  { name: "exercisesPerDay", label: "Exercises Per Day", options: Array.from({ length: 20 }, (_, i) => (i + 1).toString()) },
  { name: "setsPerDay", label: "Sets Per Day", options: ["1", "2", "3", "4", "5"] },
  { name: "location", label: "Location", options: ["Home", "Gym", "Outdoor"] },
  { name: "equipmentList", label: "Equipment List", options: ["Full gym", "Dumbbells and bands", "Bodyweight only", "Barbell and rack", "Machine only"], multi: true },
  { name: "intensifiersUsed", label: "Intensifiers Used", options: ["Regular set", "Superset", "Trisets", "Quadsets"], multi: true },
  { name: "wantProgression", label: "Want Progression", options: ["Yes", "No"] },
];

interface FormData {
  [key: string]: string | string[];
}

export function ProgramBuilder() {
  const dispatch = useDispatch();

  const initialFormData: FormData = fields.reduce((acc, field) => {
    acc[field.name] = field.multi ? [] : field.defaultValue || "";
    return acc;
  }, {} as FormData);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [dropdownsOpen, setDropdownsOpen] = useState<Record<string, boolean>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const program = useSelector((state: RootState) => state.program.program);
  const user_id = useSelector((state: RootState) => state.program.user_id);
  const loading = useSelector((state: RootState) => state.program.loading);

  const router = useRouter();

  useEffect(() => {
    if (program && user_id) {
      toast.success("Program generated successfully!");
      setTimeout(() => {
        router.push(`/program/${user_id}`);
      }, 2000);
    }
  }, [program, user_id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownsOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (field: string, value: string) => {
    const current = formData[field] as string[];
    if (current.includes(value)) {
      setFormData(prev => ({ ...prev, [field]: current.filter(v => v !== value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: [...current, value] }));
    }
  };

  const toggleDropdown = (field: string) => {
    setDropdownsOpen(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getValue = (key: string) => Array.isArray(formData[key]) ? formData[key].join(", ") : formData[key];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePromptText());
  };

  const generatePromptText = () => {
    return `Create a ${getValue("numberOfWeeks") || "{NumberOfWeeks}"}-week fitness program called "${getValue("programName") || "{ProgramName}"}". This program should follow the ${getValue("trainingModality") || "{TrainingModality}"} training style and is designed for someone at the ${getValue("difficultyLevel") || "{DifficultyLevel}"} level.

The primary focus of this program is ${getValue("primaryFocus") || "{PrimaryFocus}"}, with a secondary focus on ${getValue("secondaryFocus") || "{SecondaryFocus}"}. The user will train ${getValue("daysPerWeek") || "{DaysPerWeek}"} days per week, with each session lasting around ${getValue("sessionDuration") || "{SessionDuration}"} minutes.

Each workout should include exactly ${getValue("exercisesPerDay") || "{ExercisesPerDay}"} exercises and a total of ${getValue("setsPerDay") || "{SetsPerDay}"} sets per day.

The workouts will be performed at ${getValue("location") || "{Location}"}, and the available equipment includes: ${getValue("equipmentList") || "{EquipmentList}"}.

Use the following training intensifiers where applicable: ${getValue("intensifiersUsed") || "{IntensifiersUsed}"}.

Do you want the program to progressively get more challenging each week? ${getValue("wantProgression") || "{WantProgression}"}.

Please structure the program clearly by week and day. Label each circuit using letters (A, B, C, etc.), and label exercises within each circuit using A1, A2, B1, etc.`;
  };

  const handleSubmit = () => {
    const missingFields = Object.entries(formData).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return value === "";
    });
  
    if (missingFields.length > 0) {
      const missingLabels = missingFields
        .map(([key]) => fields.find((f) => f.name === key)?.label || key)
        .join(", ");
      toast.error(`Please fill/select: ${missingLabels}`);
      return;
    }
    console.log("That's the form data", formData);
    const user_id = uuidv4();
    dispatch(generateProgramRequest({ user_id, ...formData }));
  };

  return (
    <div className="w-full flex justify-center font-poppins py-10 px-4">
      <div className="w-full max-w-[1120px]">
        <h1 className="text-[24px] font-semibold mb-10 text-[#272B2E]">Fitness Program Prompt Builder</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {fields.map((field) => (
            <div key={field.name} className="w-full">
              <label className="block mb-2 text-[18px] font-medium">{field.label}</label>
              {field.input ? (
                <input
                  type="text"
                  value={formData[field.name] as string}
                  placeholder={`Enter ${field.label}`}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full h-[48px] px-[20px] py-[12px] border border-[#DADADA] bg-[#FAFAFA] text-black placeholder:text-[#9CA3AF] rounded-[8px]"
                />
              ) : (
                <div
                  className="relative w-full"
                  ref={(el: HTMLDivElement | null) => {
                    dropdownRefs.current[field.name] = el;
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown(field.name)}
                    className="w-full h-[48px] px-[20px] py-[12px] bg-[#FAFAFA] border border-[#DADADA] rounded-[8px] text-left flex justify-between items-center"
                  >
                    <span className="truncate">{
                      Array.isArray(formData[field.name])
                        ? (formData[field.name] as string[]).join(", ") || `Select ${field.label}`
                        : formData[field.name] || `Select ${field.label}`
                    }</span>
                    <svg className={`w-4 h-4 transform transition-transform ${dropdownsOpen[field.name] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownsOpen[field.name] && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-[#DADADA] rounded-[8px] shadow-md max-h-60 overflow-auto">
                      {field.options?.map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            if (field.multi) {
                              toggleMultiSelect(field.name, option);
                            } else {
                              handleInputChange(field.name, option);
                              setDropdownsOpen(prev => ({ ...prev, [field.name]: false }));
                            }
                          }}
                          className="px-[20px] py-[12px] cursor-pointer hover:bg-gray-100 text-black text-base flex items-center gap-2"
                        >
                          {field.multi && (
                            <input
                              type="checkbox"
                              readOnly
                              checked={(formData[field.name] as string[]).includes(option)}
                              className="w-4 h-4"
                            />
                          )}
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[16px] bg-[#FAF5FF] px-6 py-6 text-left w-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-[24px] font-semibold leading-[100%] text-black">Prompt Text :</h2>
            <button onClick={copyToClipboard} className="text-gray-600 hover:text-gray-900" aria-label="Copy to clipboard">
              <ClipboardIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[16px] leading-[120%] whitespace-pre-wrap text-black">
            {generatePromptText()}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-md font-medium flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={loading}>
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Program"
              )}
            </button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
