import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import datePreparation from "../DatePreparation";
import {
    deleteMovie,
    editMovie,
    getMovieList,
} from "../../ducks/Movies/operations";
import { useEffect } from "react";
import { getAllPersons } from "../../ducks/Persons/selectors";
import { getPersonList } from "../../ducks/Persons/operations";
import { getAllActors } from "../../ducks/Actors/selectors";
import { deleteActor, getActorList } from "../../ducks/Actors/operations";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { useTranslation } from "react-i18next";
import { getAllMovies, getMovie } from "../../ducks/Movies/selectors";
import { Field, Form, Formik } from "formik";
import * as _ from "lodash";

const MovieDetails = ({
    movie,
    deleteMovie,
    director,
    persons,
    getPersonList,
    getActorList,
    actors,
    deleteActor,
    getMovieList,
    editMovie,
}) => {
    const history = useHistory();
    const params = useParams();
    const confirm = useConfirm();
    const handleDelete = () => {
        confirm({
            title: "Czy na pewno chcesz usunąć ten film?",
            confirmationText: "Usuń",
            cancellationText: "Anuluj",
        }).then(() => {
            actors
                .filter((n) => n.movie_id.toString() === params.id)
                .forEach((n) => deleteActor(n));
            deleteMovie(movie);
            history.push("/movies");
        });
    };
    const { t } = useTranslation();

    const handleSubmit = (data) => {
        let values;
        if (data.director.id !== null || data.director.id !== "") {
            values = { ...data, director_id: parseInt(data.director.id) };
        } else {
            values = { ...data, director_id: null };
        }
        if (movie) {
            if (values.director.id === "" || values.director.id === null) {
                const editedValues = _.omit(values, "director");
                editMovie(editedValues);
            } else {
                editMovie(values);
            }
        }
    };

    useEffect(() => {
        if (persons.length === 0) {
            getPersonList();
        }
        if (actors.length === 0) {
            getActorList();
        }
        if (!movie) {
            getMovieList();
        }
    }, []);

    return (
        <div className="details-movie">
            {movie ? (
                <div className={"photo"}>
                    <img
                        src={movie.image_url}
                        alt={"Błąd wczytywania obrazu"}
                    />
                </div>
            ) : (
                <p>Błąd ładowania strony</p>
            )}
            {movie && (
                <div className="data">
                    <div className="paragrafs">
                        <p>
                            {t("title")}: {movie.title}
                        </p>
                        <p>
                            {t("genre")}: {movie.genre}
                        </p>
                        <p>
                            {t("release-date")}{" "}
                            {datePreparation(movie.release_date)}
                        </p>
                        <p>
                            {t("description")}: {movie.description}
                        </p>
                        {director ? (
                            <p
                                className={"director"}
                                onClick={() =>
                                    history.push(`/persons/${director.id}`)
                                }
                            >
                                {t("director")}:{director.first_name}{" "}
                                {director.last_name}
                            </p>
                        ) : (
                            <p>{t("lack-of-director")}</p>
                        )}
                        <p>{t("select-director")}</p>
                        <Formik
                            initialValues={{
                                ...movie,
                                director: { id: movie.director_id },
                            }}
                            onSubmit={(values) => handleSubmit(values)}
                        >
                            <Form>
                                <div className={"changing"}>
                                    <Field name={"director.id"} as={"select"}>
                                        <option key={""} value={""}>
                                            --
                                        </option>
                                        {Object.keys(persons).map((key) => (
                                            <option
                                                key={persons[key].id}
                                                value={persons[key].id}
                                            >
                                                {persons[key].first_name}{" "}
                                                {persons[key].last_name}{" "}
                                            </option>
                                        ))}
                                    </Field>
                                    <button type={"submit"}>
                                        {" "}
                                        {t("change-director")}
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                        {actors.filter(
                            (n) => movie.id.toString() === n.movie_id.toString()
                        ).length === 0 ? null : (
                            <div className={"actors"}>
                                {" "}
                                <div>{t("actors-movie")}</div>
                                <ul>
                                    {actors
                                        .filter(
                                            (n) =>
                                                movie.id.toString() ===
                                                n.movie_id.toString()
                                        )
                                        .map((n) =>
                                            persons.find(
                                                (k) => k.id === n.person_id
                                            )
                                        )
                                        .map((n) => (
                                            <div key={n.id}>
                                                <li
                                                    onClick={() =>
                                                        history.push(
                                                            `/persons/${n.id}`
                                                        )
                                                    }
                                                >
                                                    {n.first_name} {n.last_name}
                                                </li>{" "}
                                                <button
                                                    onClick={() => {
                                                        confirm({
                                                            title: t(
                                                                "confirm-delete-actor"
                                                            ),
                                                            confirmationText:
                                                                t("delete"),
                                                            cancellationText:
                                                                t("cancel"),
                                                        }).then(() => {
                                                            deleteActor(
                                                                actors.find(
                                                                    (k) =>
                                                                        k.person_id ===
                                                                            n.id &&
                                                                        k.movie_id.toString() ===
                                                                            params.id
                                                                )
                                                            );
                                                        });
                                                    }}
                                                >
                                                    {t("delete-actor")}
                                                </button>
                                            </div>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="buttons">
                        <button
                            type={"button"}
                            onClick={() =>
                                history.push(`/movies/${movie.id}/addActors`)
                            }
                        >
                            {t("add-actors")}
                        </button>
                        <button
                            type={"button"}
                            onClick={() => history.goBack()}
                        >
                            {t("back")}
                        </button>
                        <button
                            type={"button"}
                            onClick={() =>
                                history.push(`/movies/${movie.id}/edit`)
                            }
                        >
                            {t("edit-movie")}
                        </button>
                        <button type={"button"} onClick={() => handleDelete()}>
                            {t("delete-movie")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    const temp = getAllMovies(state).find(
        (n) => n.id.toString() === ownProps.match.params.id
    );
    return {
        persons: getAllPersons(state),
        movie: getMovie(state, ownProps),
        director:
            temp && getAllPersons(state).find((n) => n.id === temp.director_id),
        actors: getAllActors(state),
    };
};
const mapDispatchToProps = {
    deleteMovie,
    getMovieList,
    getPersonList,
    getActorList,
    deleteActor,
    editMovie,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieDetails);
