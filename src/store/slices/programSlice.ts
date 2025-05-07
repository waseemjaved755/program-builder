import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProgramState {
  user_id?: string;
  formData: {
    [key: string]: string | string[];
  };
  program: any;
  generatedPrompt: string;
  loading: boolean;
  error?: string;
}

const initialState: ProgramState = {
  user_id: undefined,
  formData: {},
  program: null,
  generatedPrompt: "",
  loading: false,
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: string; value: string | string[] }>
    ) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    generateProgramRequest: (
      state,
      action: PayloadAction<{ user_id: string } & { [key: string]: string | string[] }>
    ) => {
      const { user_id, ...formData } = action.payload;
      state.user_id = user_id;
      state.formData = formData;
      state.loading = true;
      state.error = undefined;
    },
    generateProgramSuccess: (
      state,
      action: PayloadAction<any>
    ) => {
      state.program = action.payload;
      state.loading = false;
    },
    generateProgramFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateField,
  generateProgramRequest,
  generateProgramSuccess,
  generateProgramFailure,
} = programSlice.actions;

export default programSlice.reducer;
