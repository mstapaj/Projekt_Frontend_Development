import types from "./types";

export const actorReducer = (state = [], action) => {
    switch (action.type) {
        case types.ACTOR_SUCCESS:
            return [...action.payload];
        case types.ACTOR_FAILURE:
            return state;
        case types.ACTOR_REQUEST:
            return state;
        case types.ADD_ACTOR_SUCCESS:
            return [...state, action.payload];
        case types.ADD_ACTOR_FAILURE:
            return state;
        case types.ADD_ACTOR_REQUEST:
            return state;
        default:
            return state;
    }
};
