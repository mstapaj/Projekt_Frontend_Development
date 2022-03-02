import { connect } from "react-redux";
import { getAllPersons } from "../../ducks/Persons/selectors";
import { getPersonList } from "../../ducks/Persons/operations";
import { Field, Form, Formik } from "formik";
import _ from "lodash";
import { useEffect, useState } from "react";
import { addActor, getActorList } from "../../ducks/Actors/operations";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { getAllActors } from "../../ducks/Actors/selectors";
import { useTranslation } from "react-i18next";

const MovieAddActor = ({
    persons,
    getPersonList,
    addActor,
    actors,
    getActorList,
}) => {
    const [tab, setTab] = useState([]);
    const history = useHistory();
    const params = useParams();
    const { t } = useTranslation();
    useEffect(() => {
        if (persons.length === 0) {
            getPersonList();
        }
        if (actors.length === 0) {
            getActorList();
        }
    }, []);

    return (
        <div className={"form"}>
            <h3>{t("add-actors")}</h3>
            <Formik
                initialValues={{
                    checked: [],
                }}
                onSubmit={() => {
                    for (let i = 0; i < tab.length; i++) {
                        addActor({ id: tab[i], movie_id: params.id });
                    }
                    history.goBack();
                }}
            >
                {() => (
                    <Form
                        id={"tab"}
                        onChange={(event) => {
                            if (tab.includes(event.target.value)) {
                                setTab([
                                    ..._.filter(
                                        tab,
                                        (n) => n !== event.target.value
                                    ),
                                ]);
                            } else {
                                setTab([...tab, event.target.value]);
                            }
                        }}
                    >
                        <div className={"adding"}>
                            {_.uniq(
                                persons.filter(
                                    (n) =>
                                        !actors
                                            .filter(
                                                (k) =>
                                                    k.movie_id.toString() ===
                                                    params.id
                                            )
                                            .map((k) => k.person_id)
                                            .includes(n.id)
                                )
                            ).map((n) => (
                                <label key={n.id}>
                                    {n.first_name} {n.last_name}
                                    <Field
                                        type={"checkbox"}
                                        name={"checked"}
                                        value={n.id.toString()}
                                    />
                                </label>
                            ))}
                        </div>
                        <button
                            type={"button"}
                            onClick={() => history.goBack()}
                        >
                            {t("back")}
                        </button>
                        <button type={"submit"}>{t("add-actors")}</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        persons: getAllPersons(state),
        actors: getAllActors(state),
    };
};
const mapDispatchToProps = {
    getPersonList,
    addActor,
    getActorList,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieAddActor);
