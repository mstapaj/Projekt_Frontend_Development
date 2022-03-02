import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const MoviesFilterDropdown = ({ persons, setFilter }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h4>{t("filter-by-director")}</h4>
            <Formik
                initialValues={{
                    director_id: "--",
                }}
                onSubmit={() => {}}
            >
                {() => (
                    <Form
                        id={"filter"}
                        onChange={(event) => {
                            setFilter(event.target.value);
                        }}
                    >
                        <div>
                            <Field as={"select"} name={"director_id"}>
                                <option
                                    key={"Brak filtrowania"}
                                    value={"Brak filtrowania"}
                                >
                                    {t("lack-of-filter")}
                                </option>
                                {_.uniq(Object.keys(persons)).map((key) => (
                                    <option
                                        key={persons[key].id}
                                        value={persons[key].id}
                                    >
                                        {" "}
                                        {persons[key].first_name}{" "}
                                        {persons[key].last_name}{" "}
                                    </option>
                                ))}
                            </Field>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MoviesFilterDropdown;
