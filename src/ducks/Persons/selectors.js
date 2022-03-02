export const getAllPersons = (state) => {
    return state.entities.persons.allIds.map(
        (id) => state.entities.persons.byId[id]
    );
};

export const getPerson = (state, ownProps) => {
    return state.entities.persons.byId[ownProps.match.params.id];
};
