import { all, fork } from "redux-saga/effects";
import { watchGenerateProgram } from "./generateProgramSaga";

export default function* rootSaga() {
  yield all([fork(watchGenerateProgram)]);
}
