import types from "./types";
import { createAction } from "redux-api-middleware";
import { schema, normalize } from "normalizr";

const movieSchema = new schema.Entity("movies");
const moviesSchema = new schema.Array(movieSchema);

export const getMovieList = () => {
    return createAction({
        endpoint: "http://localhost:5000/api/movies/",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        types: [
            types.MOVIE_REQUEST,
            {
                type: types.MOVIE_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, moviesSchema);
                    return entities;
                },
                meta: { actionType: "GET_ALL" },
            },
            types.MOVIE_FAILURE,
        ],
    });
};

export const addMovie = (values) => {
    return createAction({
        endpoint: "http://localhost:5000/api/movies/",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        types: [
            types.ADD_MOVIE_REQUEST,
            {
                type: types.ADD_MOVIE_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, movieSchema);
                    return entities;
                },
                meta: { actionType: "ADD" },
            },
            types.ADD_MOVIE_FAILURE,
        ],
    });
};

export const editMovie = (values) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${values.id}`,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        types: [
            types.EDIT_MOVIE_REQUEST,
            {
                type: types.EDIT_MOVIE_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, movieSchema);
                    return entities;
                },
                meta: { actionType: "UPDATE" },
            },
            types.EDIT_MOVIE_FAILURE,
        ],
    });
};

export const deleteMovie = (values) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${values.id}`,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        types: [
            types.DELETE_MOVIE_REQUEST,
            {
                type: types.DELETE_MOVIE_SUCCESS,
                payload: async () => {
                    const { entities } = normalize(values, movieSchema);
                    return entities;
                },
                meta: { actionType: "DELETE" },
            },
            types.DELETE_MOVIE_FAILURE,
        ],
    });
};

export const noneDirector = (values) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${values.id}/director`,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        types: [
            types.NONE_DIRECTOR_REQUEST,
            {
                type: types.NONE_DIRECTOR_SUCCESS,
                payload: async (action, state, res) => {
                    const { entities } = normalize(values, movieSchema);
                    return entities;
                },
                meta: { actionType: "UPDATE" },
            },
            types.NONE_DIRECTOR_FAILURE,
        ],
    });
};
