import CreateDataContext from "./createDataContext";
import * as RootNavigation from "../RootNavigation";

const activityReducer = (state, action) => {
  switch (action.type) {
    case "set_activity_list":
      return { ...state, activities: action.payload };
    case "add_activity":
      debugger;
      console.log("adding", action.payload);
      return { ...state, activities: [...state.activities, action.payload] };
    case "set_activity_on_focus":
      return { ...state, date: action.payload };
    default:
      return state;
  }
};

const setActivityList = (dispatch) => {
  return (activities) => {
    dispatch({ type: "set_activity_list", payload: activities });
  };
};
const addActivity = (dispatch) => {
  return (activity) => {
    dispatch({ type: "add_activity", payload: activity });
  };
};
const setActivityOnFocus = (dispatch) => {
  return (date) => {
    dispatch({ type: "set_activity_on_focus", payload: date });
  };
};

export const { Provider, Context } = CreateDataContext(
  activityReducer,
  { setActivityList, setActivityOnFocus, addActivity },
  { activities: [], date: null }
);
