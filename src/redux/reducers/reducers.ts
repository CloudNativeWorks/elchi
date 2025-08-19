import { combineReducers } from "redux";
import VersionedResources from './slice';
import scenarioReducer from '../slices/scenarioSlice';

const Reducer = combineReducers({
    VersionedResources,
    scenario: scenarioReducer
});

export default Reducer;
