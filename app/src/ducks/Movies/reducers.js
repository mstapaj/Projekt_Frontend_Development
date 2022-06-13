import types from "./types";

export const movieReducer = (state = [], action) => {
    switch (action.type) {
        case types.MOVIE_SUCCESS:
            return [...action.payload];
        case types.MOVIE_FAILURE:
            return state;
        case types.MOVIE_REQUEST:
            return state;
        case types.ADD_MOVIE_SUCCESS:
            return [...state, action.payload];
        case types.ADD_MOVIE_FAILURE:
            return state;
        case types.ADD_MOVIE_REQUEST:
            return state;
        case types.EDIT_MOVIE_SUCCESS:
            return [
                ...state.map((n) =>
                    n.id === action.payload.id.toString() ? action.payload : n
                ),
            ];
        case types.EDIT_MOVIE_FAILURE:
            return state;
        case types.EDIT_MOVIE_REQUEST:
            return state;
        case types.NONE_DIRECTOR_SUCCESS:
            return [
                ...state.map((n) =>
                    n.id === action.payload.id.toString() ? action.payload : n
                ),
            ];
        case types.NONE_DIRECTOR_FAILURE:
            return state;
        case types.NONE_DIRECTOR_REQUEST:
            return state;
        default:
            return state;
    }
};
