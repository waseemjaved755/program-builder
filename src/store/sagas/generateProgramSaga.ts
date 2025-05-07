import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import {
  generateProgramSuccess,
  generateProgramFailure,
} from "../slices/programSlice";
import { RootState } from "../index";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function* handleGenerateProgram(): Generator<any, void, any> {
  try {
    const { user_id, formData }: { user_id: string; formData: Record<string, string | string[]> } = yield select(
      (state: RootState) => ({
        user_id: state.program.user_id,
        formData: state.program.formData,
      })
    );

    const response = yield call(axios.post, `${API_BASE_URL}/program/generate`, {
      user_id,
      ...formData,
    });

    console.log("The response====", response);

    yield put(generateProgramSuccess(response.data.program));
  } catch (err: any) {
    yield put(generateProgramFailure(err.message || "Failed to generate program"));
  }
}

export function* watchGenerateProgram() {
  yield takeLatest("program/generateProgramRequest", handleGenerateProgram);
}
