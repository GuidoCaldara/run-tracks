import CreateDataContext from "./createDataContext";
import * as RootNavigation from "../RootNavigation";
import { AsyncStorage } from "react-native";

const routeReducer = (state, action) => {
  switch (action.type) {
    case "add_point":
      return [...state, action.payload];
    default:
      return state;
  }
};

const addPoint = (dispatch) => {
  return (point) => {
    dispatch({ type: "add_point", payload: point });
  };
};

export const { Provider, Context } = CreateDataContext(
  routeReducer,
  { addPoint },
  []
);
