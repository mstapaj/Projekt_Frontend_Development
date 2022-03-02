import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import datePreparation from "../DatePreparation";
import { deletePerson, getPersonList } from "../../ducks/Persons/operations";
import { getAllMovies } from "../../ducks/Movies/selectors";
import { getMovieList, noneDirector } from "../../ducks/Movies/operations";
import { useEffect } from "react";
import { getAllActors } from "../../ducks/Actors/selectors";
import { deleteActor, getActorList } from "../../ducks/Actors/operations";
import { useConfirm } from "material-ui-confirm";
import { useTranslation } from "react-i18next";
import { getPerson } from "../../ducks/Persons/selectors";

const PersonDetails = ({
    person,
    deletePerson,
    movies,
    getMovieList,
    noneDirector,
    actors,
    getActorList,
    deleteActor,
    getPersonList,
}) => {
    const history = useHistory();
    const confirm = useConfirm();
    const { t } = useTranslation();

    const handleDelete = () => {
        if (movies.length === 0) {
            getMovieList();
        }
        confirm({
            title: t("confirm-delete-person"),
            confirmationText: t("delete"),
            cancellationText: t("cancel"),
        }).then(() => {
            actors
                .filter((n) => n.person_id === person.id)
                .forEach((n) => deleteActor(n));
            const temp = movies.filter((n) => n.director_id === person.id);
            temp.forEach((n) => {
                noneDirector({
                    ...n,
                    director_id: null,
                });
            });
            deletePerson(person);
            history.push("/persons");
        });
    };

    useEffect(() => {
        if (movies.length === 0) {
            getMovieList();
        }
        if (actors.length === 0) {
            getActorList();
        }
        if (!person) {
            getPersonList();
        }
    }, []);

    return (
        <>
            {person ? (
                <div className="details-person">
                    <p>
                        {t("firstname")} {person.first_name}
                    </p>
                    <p>
                        {t("lastname")} {person.last_name}
                    </p>
                    <p>
                        {t("birth-date")} {datePreparation(person.birth_date)}
                    </p>
                    <p>
                        {t("nationality")} {person.nationality}
                    </p>
                    {movies.filter((n) => n.director_id === person.id).length >
                    0 ? (
                        <div>
                            <p>{t("films-director")}</p>
                            <ul>
                                {movies
                                    .filter((n) => n.director_id === person.id)
                                    .map((n) => (
                                        <li
                                            key={n.id}
                                            onClick={() =>
                                                history.push(`/movies/${n.id}`)
                                            }
                                        >
                                            {n.title}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ) : null}
                    {actors.filter((n) => n.person_id === person.id).length >
                    0 ? (
                        <div>
                            <p>{t("films-actor")}</p>
                            <ul>
                                {actors
                                    .filter((n) => n.person_id === person.id)
                                    .map((n) =>
                                        movies.find((k) => k.id === n.movie_id)
                                    )
                                    .map((n) => (
                                        <li
                                            key={n.id}
                                            onClick={() =>
                                                history.push(`/movies/${n.id}`)
                                            }
                                        >
                                            {n.title}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ) : null}
                    <button type={"button"} onClick={() => history.goBack()}>
                        {t("back")}
                    </button>
                    <button
                        type={"button"}
                        onClick={() =>
                            history.push(`/persons/${person.id}/edit`)
                        }
                    >
                        {t("edit-person")}
                    </button>
                    <button type={"button"} onClick={() => handleDelete()}>
                        {t("delete-person")}
                    </button>
                </div>
            ) : (
                <p>Błąd ładowania strony</p>
            )}
        </>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        person: getPerson(state, ownProps),
        movies: getAllMovies(state),
        actors: getAllActors(state),
    };
};
const mapDispatchToProps = {
    deletePerson,
    getPersonList,
    getMovieList,
    noneDirector,
    getActorList,
    deleteActor,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetails);
