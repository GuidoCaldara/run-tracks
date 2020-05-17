import CreateDataContext from "./createDataContext";
import { AsyncStorage } from "react-native";
const timerReducer = (state, action) => {
  switch (action.type) {
    case "reset":
      console.log("resetting timer");
      return { ...state, duration: 0 };
    case "re_start":
      const duration = state.duration + action.payload;
      return { ...state, running: true, duration };
    case "start":
      return { ...state, running: true };
    case "stop":
      return { ...state, running: false };
    case "next":
      return { ...state, duration: state.duration + 1 };
    default:
      return state;
  }
};

const reStartTimer = (dispatch) => {
  return (diff) => {
    dispatch({ type: "re_start", payload: diff });
  };
};

const addSecond = (dispatch) => {
  return async (seconds) => {
    dispatch({ type: "next" });
  };
};
const start = (dispatch) => {
  return () => {
    dispatch({ type: "start" });
  };
};
const stop = (dispatch) => {
  return () => {
    dispatch({ type: "stop" });
  };
};

const resetTimer = (dispatch) => {
  return () => {
    dispatch({ type: "reset" });
  };
};

export const { Provider, Context } = CreateDataContext(
  timerReducer,
  { addSecond, start, stop, reStartTimer, resetTimer },
  {
    running: false,
    duration: 0,
  }
);
