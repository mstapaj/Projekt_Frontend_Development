export const getAllMovies = (state) => {
    return state.entities.movies.allIds.map(
        (id) => state.entities.movies.byId[id]
    );
};

export const getMovie = (state, ownProps) => {
    return state.entities.movies.allIds
        .map((id) => state.entities.movies.byId[id])
        .find((n) => n.id.toString() === ownProps.match.params.id);
};
