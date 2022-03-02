import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const PersonsFilterDropdown = ({ persons, setFilter }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h4>{t("filter-by-birth-year")}</h4>
            <Formik
                initialValues={{
                    year: "--",
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
                            <Field as={"select"} name={"year"}>
                                <option
                                    key={"Brak filtrowania"}
                                    value={"Brak filtrowania"}
                                >
                                    {t("lack-of-filter")}
                                </option>
                                {_.uniq(
                                    Object.keys(persons).map((key) =>
                                        new Date(
                                            persons[key].birth_date
                                        ).getFullYear()
                                    )
                                ).map((key) => (
                                    <option key={key} value={key}>
                                        {" "}
                                        {key}{" "}
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

export default PersonsFilterDropdown;
