import { Field, Form, Formik } from "formik";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const MoviesFilterCheckbox = ({ movies, setFilter, filter }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h4>{t("filter-by-genre")}</h4>
            <Formik
                initialValues={{
                    checked: [],
                }}
                onSubmit={() => {}}
            >
                {() => (
                    <Form
                        id={"filter"}
                        onChange={(event) => {
                            if (filter.includes(event.target.value)) {
                                setFilter([
                                    ..._.filter(
                                        filter,
                                        (n) => n !== event.target.value
                                    ),
                                ]);
                            } else {
                                setFilter([...filter, event.target.value]);
                            }
                        }}
                    >
                        <div>
                            {_.uniq(movies.map((n) => n.genre))
                                .sort((x, y) =>
                                    x.toLowerCase() > y.toLowerCase() ? 1 : -1
                                )
                                .map((n) => (
                                    <label key={n}>
                                        {n}
                                        <Field
                                            type={"checkbox"}
                                            name={"checked"}
                                            value={n}
                                        />
                                    </label>
                                ))}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MoviesFilterCheckbox;
