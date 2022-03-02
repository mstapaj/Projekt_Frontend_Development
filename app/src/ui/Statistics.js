import { getAllPersons } from "../ducks/Persons/selectors";
import { getAllActors } from "../ducks/Actors/selectors";
import { getMovieList } from "../ducks/Movies/operations";
import { getPersonList } from "../ducks/Persons/operations";
import { getActorList } from "../ducks/Actors/operations";
import { connect } from "react-redux";
import "chart.js/auto";
import { getAllMovies } from "../ducks/Movies/selectors";
import { useEffect } from "react";
import _ from "lodash";
import Graph from "./Graph";
import { useTranslation } from "react-i18next";

const Statistics = ({
    movies,
    actors,
    getMovieList,
    getActorList,
    persons,
    getPersonList,
}) => {
    useEffect(() => {
        if (persons.length === 0) {
            getPersonList();
        }
        if (movies.length === 0) {
            getMovieList();
        }
        if (actors.length === 0) {
            getActorList();
        }
    }, []);
    const { t } = useTranslation();

    return (
        <div className={"stats"}>
            <h3>{t("stats")} </h3>
            <div>
                {" "}
                <p>{t("most-actors")}</p>{" "}
                {actors.length === 0 ? (
                    <p>{t("lack-of-data")}</p>
                ) : (
                    movies.length > 0 &&
                    actors.length > 0 && (
                        <Graph
                            labels={_.sortBy(
                                Object.entries(
                                    _.countBy(actors, (n) => n.movie_id)
                                ),
                                (n) => n[1]
                            )
                                .reverse()
                                .slice(0, 6)
                                .map(
                                    (n) =>
                                        movies.find(
                                            (k) => n[0] === k.id.toString()
                                        ).title
                                )}
                            data={_.sortBy(
                                Object.entries(
                                    _.countBy(actors, (n) => n.movie_id)
                                ),
                                (n) => n[1]
                            )
                                .reverse()
                                .slice(0, 6)
                                .map((n) => n[1])}
                        />
                    )
                )}
            </div>
            <div>
                <p>{t("most-films")}</p>
                {actors.length === 0 ? (
                    <p>{t("lack-of-data")}</p>
                ) : (
                    actors.length > 0 &&
                    persons.length > 0 && (
                        <Graph
                            labels={_.sortBy(
                                Object.entries(
                                    _.countBy(actors, (n) => n.person_id)
                                ),
                                (n) => n[1]
                            )
                                .reverse()
                                .slice(0, 6)
                                .map(
                                    (n) =>
                                        `${
                                            persons.find(
                                                (k) => n[0] === k.id.toString()
                                            ).first_name
                                        } ${
                                            persons.find(
                                                (k) => n[0] === k.id.toString()
                                            ).last_name
                                        }`
                                )}
                            data={_.sortBy(
                                Object.entries(
                                    _.countBy(actors, (n) => n.person_id)
                                ),
                                (n) => n[1]
                            )
                                .reverse()
                                .slice(0, 6)
                                .map((n) => n[1])}
                        />
                    )
                )}
            </div>
            <div>
                <p>{t("most-directors")}</p>
                {Object.keys(
                    _.omit(
                        _.countBy(movies, (n) => n.director_id),
                        [null]
                    )
                ).length === 0 ? (
                    <p>{t("lack-of-data")}</p>
                ) : (
                    persons.length > 0 &&
                    movies.length > 0 && (
                        <Graph
                            labels={_.sortBy(
                                Object.entries(
                                    _.omit(
                                        _.countBy(movies, (n) => n.director_id),
                                        [null]
                                    )
                                ),
                                (n) => n[1]
                            )
                                .reverse()
                                .slice(0, 6)
                                .map(
                                    (n) =>
                                        `${
                                            persons.find(
                                                (k) =>
                                                    n[0].toString() ===
                                                    k.id.toString()
                                            ).first_name
                                        } ${
                                            persons.find(
                                                (k) =>
                                                    n[0].toString() ===
                                                    k.id.toString()
                                            ).last_name
                                        }`
                                )}
                            data={_.sortBy(
                                Object.entries(
                                    _.countBy(
                                        movies.filter(
                                            (n) => n.director_id !== null
                                        ),
                                        (n) => n.director_id
                                    )
                                ),
                                (n) => n[1]
                            )
                                .reverse()
                                .slice(0, 6)
                                .map((n) => n[1])}
                        />
                    )
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        persons: getAllPersons(state),
        actors: getAllActors(state),
        movies: getAllMovies(state),
    };
};
const mapDispatchToProps = {
    getMovieList,
    getPersonList,
    getActorList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
