import { Form, Formik, Field, ErrorMessage } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import datePreparation from "../DatePreparation";
import {
    addMovie,
    editMovie,
    getMovieList,
} from "../../ducks/Movies/operations";
import { getPersonList } from "../../ducks/Persons/operations";
import { getAllPersons } from "../../ducks/Persons/selectors";
import * as _ from "lodash";
import { useTranslation } from "react-i18next";
import { getMovie } from "../../ducks/Movies/selectors";

const MoviesForm = ({
    addMovie,
    movie,
    editMovie,
    persons,
    getPersonList,
    getMovieList,
}) => {
    const history = useHistory();
    const { t } = useTranslation();
    const movieSchema = Yup.object().shape({
        title: Yup.string().required(t("title-req")),
        genre: Yup.string().required(t("genre-req")),
        release_date: Yup.date().required(t("release-date-req")),
        description: Yup.string().required(t("description-req")),
        image_url: Yup.string().url(t("wrong-image")).required(t("image-req")),
    });

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
            history.goBack();
        } else {
            if (values.director.id === "" || values.director.id === null) {
                const editedValues = _.omit(values, "director");
                addMovie(editedValues);
            } else {
                addMovie(values);
            }
            history.push("/movies");
        }
    };

    const [init, setInit] = useState({
        id: uuidv4().toString(),
        title: "",
        genre: "Sci-Fi",
        description: "",
        release_date: "",
        image_url: "",
        director: {
            id: "",
        },
    });

    useEffect(() => {
        if (movie) {
            setInit({
                id: movie.id,
                title: movie.title,
                genre: movie.genre,
                description: movie.description,
                release_date: datePreparation(movie.release_date),
                image_url: movie.image_url,
                director: {
                    id: movie.director_id,
                },
            });
        }
        if (persons.length === 0) {
            getPersonList();
        }
        if (!movie) {
            getMovieList();
        }
    }, []);

    return (
        <div className="form">
            <Formik
                initialValues={init}
                onSubmit={(values) => handleSubmit(values)}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={movieSchema}
            >
                <Form>
                    {movie ? (
                        <h3>{t("edit-movie")}</h3>
                    ) : (
                        <h3>{t("add-movie")}</h3>
                    )}
                    <div>
                        {t("title")}
                        <Field name={"title"} />
                    </div>
                    <ErrorMessage name={"title"} component={"p"} />
                    <div>
                        {t("genre")}
                        <Field name={"genre"} as={"select"}>
                            <option key={"Sci-Fi"} value={"Sci-Fi"}>
                                {t("sci-fi")}
                            </option>
                            <option key={"Horror"} value={"Horror"}>
                                {t("horror")}
                            </option>
                            <option key={"Dramat"} value={"Dramat"}>
                                {t("drama")}
                            </option>
                            <option key={"Komedia"} value={"Komedia"}>
                                {t("comedy")}
                            </option>
                            <option key={"Thriller"} value={"Thriller"}>
                                {t("thriller")}
                            </option>
                            <option key={"Akcja"} value={"Akcja"}>
                                {t("action")}
                            </option>
                        </Field>
                    </div>
                    <ErrorMessage name={"genre"} component={"p"} />
                    <div>
                        {t("description")}
                        <Field name={"description"} />
                    </div>
                    <ErrorMessage name={"description"} component={"p"} />
                    <div>
                        {t("release-date")}
                        <Field name={"release_date"} type={"date"} />
                    </div>
                    <ErrorMessage name={"release_date"} component={"p"} />
                    <div>
                        {t("image-url")}
                        <Field name={"image_url"} />
                    </div>
                    <ErrorMessage name={"image_url"} component={"p"} />
                    <div>
                        {t("director")}
                        <Field name={"director.id"} as={"select"}>
                            <option key={""} value={""}>
                                {" "}
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
                    </div>
                    <button type={"button"} onClick={() => history.goBack()}>
                        {t("back")}
                    </button>
                    {movie ? (
                        <button type={"submit"}>{t("edit-movie")}</button>
                    ) : (
                        <button type={"submit"}>{t("add-movie")}</button>
                    )}
                </Form>
            </Formik>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        movie: getMovie(state, ownProps),
        persons: getAllPersons(state),
    };
};

const mapDispatchToProps = {
    addMovie,
    getMovieList,
    editMovie,
    getPersonList,
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviesForm);
