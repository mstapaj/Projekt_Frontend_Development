export const getAllActors = (state) => {
    return state.entities.actors.allIds.map(
        (id) => state.entities.actors.byId[id]
    );
};
