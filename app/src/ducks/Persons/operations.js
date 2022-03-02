import types from "./types";
import { createAction } from "redux-api-middleware";
import { schema, normalize } from "normalizr";

const personSchema = new schema.Entity("persons");
const personsSchema = new schema.Array(personSchema);

export const getPersonList = () => {
    return createAction({
        endpoint: "http://localhost:5000/api/persons/",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        types: [
            types.PERSON_REQUEST,
            {
                type: types.PERSON_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, personsSchema);
                    return entities;
                },
                meta: { actionType: "GET_ALL" },
            },
            types.PERSON_FAILURE,
        ],
    });
};

export const addPerson = (values) => {
    return createAction({
        endpoint: "http://localhost:5000/api/persons/",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        types: [
            types.ADD_PERSON_REQUEST,
            {
                type: types.ADD_PERSON_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, personSchema);
                    return entities;
                },
                meta: { actionType: "ADD" },
            },
            types.ADD_PERSON_FAILURE,
        ],
    });
};

export const editPerson = (values) => {
    return createAction({
        endpoint: `http://localhost:5000/api/persons/${values.id}`,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        types: [
            types.EDIT_PERSON_REQUEST,
            {
                type: types.EDIT_PERSON_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, personSchema);
                    return entities;
                },
                meta: { actionType: "UPDATE" },
            },
            types.EDIT_PERSON_FAILURE,
        ],
    });
};

export const deletePerson = (values) => {
    return createAction({
        endpoint: `http://localhost:5000/api/persons/${values.id}`,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        types: [
            types.DELETE_PERSON_REQUEST,
            {
                type: types.DELETE_PERSON_SUCCESS,
                payload: async () => {
                    const { entities } = normalize(values, personSchema);
                    return entities;
                },
                meta: { actionType: "DELETE" },
            },
            types.DELETE_PERSON_FAILURE,
        ],
    });
};
