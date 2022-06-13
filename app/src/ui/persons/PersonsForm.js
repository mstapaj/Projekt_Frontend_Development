import { Form, Formik, Field, ErrorMessage } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import {
    addPerson,
    editPerson,
    getPersonList,
} from "../../ducks/Persons/operations";
import datePreparation from "../DatePreparation";
import { useTranslation } from "react-i18next";

const PersonsForm = ({ addPerson, person, editPerson }) => {
    const history = useHistory();
    const { t } = useTranslation();
    const personSchema = Yup.object().shape({
        first_name: Yup.string().required(t("firstname-req")),
        last_name: Yup.string().required(t("lastname-req")),
        birth_date: Yup.date().required(t("birth-date-req")),
        nationality: Yup.string().required(t("nationality-req")),
    });

    const handleSubmit = (values) => {
        if (person) {
            editPerson(values);
            history.goBack();
        } else {
            addPerson(values);
            history.push("/persons");
        }
    };

    const [init, setInit] = useState({
        id: uuidv4().toString(),
        first_name: "",
        last_name: "",
        birth_date: "",
        nationality: "Polska",
    });

    useEffect(() => {
        if (person) {
            setInit({
                id: person.id,
                first_name: person.first_name,
                last_name: person.last_name,
                birth_date: datePreparation(person.birth_date),
                nationality: person.nationality,
            });
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
                validationSchema={personSchema}
            >
                <Form>
                    {person ? (
                        <h3>{t("edit-person")}</h3>
                    ) : (
                        <h3>{t("add-person")}</h3>
                    )}
                    <div>
                        <p> {t("firstname")}</p>
                        <Field name={"first_name"} />
                    </div>
                    <ErrorMessage name={"first_name"} component={"p"} />
                    <div>
                        <p> {t("lastname")}</p>
                        <Field name={"last_name"} />
                    </div>
                    <ErrorMessage name={"last_name"} component={"p"} />
                    <div>
                        <p>{t("birth-date")}</p>
                        <Field name={"birth_date"} type={"date"} />
                    </div>
                    <ErrorMessage name={"birth_date"} component={"p"} />
                    <div>
                        <p> {t("nationality")}</p>
                        <Field name={"nationality"} as={"select"}>
                            <option key={"Polska"} value={"Polska"}>
                                Polska
                            </option>
                            <option key={"Niemcy"} value={"Niemcy"}>
                                Niemcy
                            </option>
                            <option key={"Hiszpania"} value={"Hiszpania"}>
                                Hiszpania
                            </option>
                            <option key={"Włochy"} value={"Włochy"}>
                                Włochy
                            </option>
                            <option key={"Anglia"} value={"Anglia"}>
                                Anglia
                            </option>
                            <option key={"Rosja"} value={"Rosja"}>
                                Rosja
                            </option>
                        </Field>
                    </div>
                    <ErrorMessage name={"nationality"} component={"p"} />
                    <button type={"button"} onClick={() => history.goBack()}>
                        {t("back")}
                    </button>
                    {person ? (
                        <button type={"submit"}>{t("edit-person")}</button>
                    ) : (
                        <button type={"submit"}>{t("add-person")}</button>
                    )}
                </Form>
            </Formik>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        person: state.entities.persons.byId[ownProps.match.params.id],
    };
};

const mapDispatchToProps = {
    addPerson,
    getPersonList,
    editPerson,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonsForm);
