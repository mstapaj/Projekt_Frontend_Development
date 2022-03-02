import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllPersons } from "../../ducks/Persons/selectors";
import { getPersonList } from "../../ducks/Persons/operations";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import PersonsSort from "./PersonsSort";
import PersonsFilterCheckbox from "./filters/PersonsFilterCheckbox";
import PersonsFilterDropdown from "./filters/PersonsFilterDropdown";
import PersonsFilterText from "./filters/PersonsFilterText";
import { useTranslation } from "react-i18next";
import Paginate from "../Paginate";
import { getAllMovies } from "../../ducks/Movies/selectors";
import { getMovieList } from "../../ducks/Movies/operations";

const PersonsList = ({ persons, getPersonList, movies, getMovieList }) => {
    const history = useHistory();
    const [sort, setSort] = useState("null");
    const [filterCheckbox, setFliterCheckbox] = useState([]);
    const [filterDropdown, setFilterDropdown] = useState("Brak filtrowania");
    const [filterText, setFilterText] = useState(null);
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [elementsOnPage, setElementsOnPage] = useState([]);

    useEffect(() => {
        if (persons.length === 0) {
            getPersonList();
        }
        if (movies.length === 0) {
            getMovieList();
        }
    }, []);

    useEffect(() => {
        setPage(0);
    }, [filterText, filterDropdown, filterCheckbox]);

    useEffect(() => {
        setElementsOnPage(
            _.filter(
                _.filter(
                    _.filter(
                        _.sortBy(
                            persons,
                            sort === "alpha"
                                ? ["first_name", "last_name"]
                                : sort === "birth_date"
                                ? ["birth_date"]
                                : null
                        ),
                        filterCheckbox.length === 0
                            ? null
                            : (n) => filterCheckbox.includes(n.nationality)
                    ),
                    filterDropdown !== "Brak filtrowania"
                        ? (n) =>
                              new Date(n.birth_date)
                                  .getFullYear()
                                  .toString() === filterDropdown
                        : null
                ),
                filterText
                    ? (n) =>
                          `${n.first_name.toLowerCase()} ${n.last_name.toLowerCase()}`.includes(
                              filterText.toLowerCase()
                          )
                    : null
            ).map((n) => {
                return (
                    <div
                        key={n.id}
                        className={"list persons"}
                        onClick={() => history.push(`/persons/${n.id}`)}
                    >
                        {n.first_name} {n.last_name}
                    </div>
                );
            })
        );
    }, [filterText, filterDropdown, filterCheckbox, persons, sort]);

    return (
        <div className={"main"}>
            <div className="left">
                <button onClick={() => history.push("/persons/add")}>
                    {t("add-person")}
                </button>
                <PersonsSort setSort={setSort} key={"persons-sort"} />
                <PersonsFilterCheckbox
                    key={"persons-checkbox"}
                    persons={persons}
                    setFilter={setFliterCheckbox}
                    filter={filterCheckbox}
                />
                <PersonsFilterDropdown
                    key={"persons-dropdown"}
                    persons={persons}
                    setFilter={setFilterDropdown}
                />
                <PersonsFilterText
                    setFilter={setFilterText}
                    key={"persons-text"}
                />
            </div>

            <div className="right">
                <h3>{t("persons-list")}</h3>
                <Paginate
                    elements={elementsOnPage.length}
                    page={page}
                    setPage={setPage}
                    maxItems={10}
                />
                <div>{_.slice(elementsOnPage, page, page + 10)}</div>
                <Paginate
                    elements={elementsOnPage.length}
                    page={page}
                    setPage={setPage}
                    maxItems={10}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        persons: getAllPersons(state),
        movies: getAllMovies(state),
    };
};
const mapDispatchToProps = {
    getPersonList,
    getMovieList,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonsList);
