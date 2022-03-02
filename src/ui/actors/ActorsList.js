import { connect } from "react-redux";
import { getAllPersons } from "../../ducks/Persons/selectors";
import { getPersonList } from "../../ducks/Persons/operations";
import { getActorList } from "../../ducks/Actors/operations";
import { getAllActors } from "../../ducks/Actors/selectors";
import { useEffect, useState } from "react";
import _ from "lodash";
import PersonsSort from "../persons/PersonsSort";
import PersonsFilterCheckbox from "../persons/filters/PersonsFilterCheckbox";
import PersonsFilterDropdown from "../persons/filters/PersonsFilterDropdown";
import PersonsFilterText from "../persons/filters/PersonsFilterText";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllMovies } from "../../ducks/Movies/selectors";
import { getMovieList } from "../../ducks/Movies/operations";
import Paginate from "../Paginate";

const ActorsList = ({
    persons,
    getPersonList,
    actors,
    getActorList,
    movies,
    getMovieList,
}) => {
    const [page, setPage] = useState(0);
    const [elementsOnPage, setElementsOnPage] = useState([]);
    const history = useHistory();
    const [sort, setSort] = useState("null");
    const [filterCheckbox, setFliterCheckbox] = useState([]);
    const [filterDropdown, setFilterDropdown] = useState("Brak filtrowania");
    const [filterText, setFilterText] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (persons.length === 0) {
            getPersonList();
        }
        if (actors.length === 0) {
            getActorList();
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
                            _.uniq(
                                actors.map((n) =>
                                    persons.find((k) => n.person_id === k.id)
                                )
                            ),
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
    }, [filterText, filterDropdown, filterCheckbox, sort, actors]);

    return (
        <div className="main">
            {persons && actors && (
                <div className="left">
                    <PersonsSort setSort={setSort} />
                    <PersonsFilterCheckbox
                        persons={_.uniq(
                            actors.map((n) =>
                                persons.find((k) => n.person_id === k.id)
                            )
                        )}
                        setFilter={setFliterCheckbox}
                        filter={filterCheckbox}
                    />
                    <PersonsFilterDropdown
                        persons={_.uniq(
                            actors.map((n) =>
                                persons.find((k) => n.person_id === k.id)
                            )
                        )}
                        setFilter={setFilterDropdown}
                    />
                    <PersonsFilterText setFilter={setFilterText} />
                </div>
            )}
            <div className={"right"}>
                <h3>{t("actors-list")}</h3>
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
        actors: getAllActors(state),
        movies: getAllMovies(state),
    };
};
const mapDispatchToProps = {
    getPersonList,
    getActorList,
    getMovieList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActorsList);
