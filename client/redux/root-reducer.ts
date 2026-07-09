import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/auth-slice";

export const rootReducer = combineReducers({
  auth: authReducer,
});
