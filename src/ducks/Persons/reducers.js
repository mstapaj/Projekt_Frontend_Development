import types from "./types";

export const personReducer = (state = [], action) => {
    switch (action.type) {
        case types.PERSON_SUCCESS:
            return [...action.payload];
        case types.PERSON_FAILURE:
            return state;
        case types.PERSON_REQUEST:
            return state;
        case types.ADD_PERSON_SUCCESS:
            return [...state, action.payload];
        case types.ADD_PERSON_FAILURE:
            return state;
        case types.ADD_PERSON_REQUEST:
            return state;
        case types.EDIT_PERSON_SUCCESS:
            return [
                ...state.map((n) =>
                    n.id === action.payload.id ? action.payload : n
                ),
            ];
        case types.EDIT_PERSON_FAILURE:
            return state;
        case types.EDIT_PERSON_REQUEST:
            return state;
        default:
            return state;
    }
};
