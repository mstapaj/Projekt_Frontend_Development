import types from "./types";
import { createAction } from "redux-api-middleware";
import { schema, normalize } from "normalizr";

const actorSchema = new schema.Entity("actors");
const actorsSchema = new schema.Array(actorSchema);

export const getActorList = () => {
    return createAction({
        endpoint: "http://localhost:5000/api/actors",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        types: [
            types.ACTOR_REQUEST,
            {
                type: types.ACTOR_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, actorsSchema);
                    return entities;
                },
                meta: { actionType: "GET_ALL" },
            },
            types.ACTOR_FAILURE,
        ],
    });
};

export const addActor = (values) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${values.movie_id}/actors`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        types: [
            types.ADD_ACTOR_REQUEST,
            {
                type: types.ADD_ACTOR_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, actorSchema);
                    return entities;
                },
                meta: { actionType: "ADD" },
            },
            types.ADD_ACTOR_FAILURE,
        ],
    });
};

export const deleteActor = (values) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${values.movie_id}/actors/${values.person_id}`,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        types: [
            types.DELETE_ACTOR_REQUEST,
            {
                type: types.DELETE_ACTOR_SUCCESS,
                payload: async () => {
                    const { entities } = normalize(values, actorSchema);
                    return entities;
                },
                meta: { actionType: "DELETE" },
            },
            types.DELETE_ACTOR_FAILURE,
        ],
    });
};
