import CreateDataContext from "./createDataContext";
import { speedToPace } from "../utils/speedToPace";
import { AsyncStorage } from "react-native";

const trackingReducer = (state, action) => {
  switch (action.type) {
    case "update_live_data":
      return {
        ...state,
        ...action.payload,
      };
    case "update_distance":
      return {
        ...state,
        distance: action.payload,
      };
    case "update_segment":
      return {
        ...state,
        kmSegments: [...state.kmSegments, action.payload],
      };
    case "update_trackRoute":
      return {
        ...state,
        trackRoute: action.payload,
      };
    case "update_startedAt":
      return { ...state, startedAt: action.payload };
    case "reset_track":
      return {
        ...state,
        distance: 0,
        kmSegments: [],
        kmStartedAt: null,
        trackRoute: [],
      };
    default:
      return state;
  }
};

const updateLiveData = (dispatch) => {
  return (liveData) => {
    dispatch({ type: "update_live_data", payload: liveData });
  };
};

const updateTrackRoute = (dispatch) => {
  return (point) => {
    dispatch({ type: "update_trackRoute", payload: point });
  };
};

const updateDistance = (dispatch) => {
  return (newDistance) => {
    dispatch({ type: "update_distance", payload: newDistance });
  };
};

const updateSegments = (dispatch) => {
  return (newSegment) => {
    dispatch({ type: "update_segment", payload: newSegment });
  };
};

const updateStartedAt = (dispatch) => {
  return (time) => {
    dispatch({ type: "update_startedAt", payload: time });
  };
};

const resetTrack = (dispatch) => {
  return () => {
    dispatch({ type: "reset_track" });
  };
};

export const { Provider, Context } = CreateDataContext(
  trackingReducer,
  {
    updateLiveData,
    updateDistance,
    updateSegments,
    updateTrackRoute,
    updateStartedAt,
    resetTrack,
  },
  {
    currentSpeed: null,
    distance: 0,
    kmSegments: [],
    kmStartedAt: null,
    trackRoute: [],
    startedAt: null,
    accuracy: 0,
    latitude: 0,
    longitude: 0,
  }
);
