import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllMovies } from "../../ducks/Movies/selectors";
import { getMovieList } from "../../ducks/Movies/operations";
import datePreparation from "../DatePreparation";
import _ from "lodash";
import MoviesSort from "./MoviesSort";
import MoviesFilterCheckbox from "./filters/MoviesFilterCheckbox";
import MoviesFilterDropdown from "./filters/MoviesFilterDropdown";
import { getPersonList } from "../../ducks/Persons/operations";
import { getAllPersons } from "../../ducks/Persons/selectors";
import MoviesFilterText from "./filters/MoviesFilterText";
import { useTranslation } from "react-i18next";
import Paginate from "../Paginate";

const MoviesList = ({ movies, getMovieList, persons, getPersonList }) => {
    const history = useHistory();
    const [sort, setSort] = useState("null");
    const [filterCheckbox, setFilterCheckbox] = useState([]);
    const [filterDropdown, setFilterDropdown] = useState("Brak filtrowania");
    const [filterText, setFilterText] = useState(null);
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [elementsOnPage, setElementsOnPage] = useState([]);

    useEffect(() => {
        if (movies.length === 0) {
            getMovieList();
        }
        if (persons.length === 0) {
            getPersonList();
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
                            movies,
                            sort === "alpha"
                                ? ["title"]
                                : sort === "release_date"
                                ? ["release_date"]
                                : null
                        ),
                        filterCheckbox.length === 0
                            ? null
                            : (n) => filterCheckbox.includes(n.genre)
                    ),
                    filterDropdown !== "Brak filtrowania"
                        ? (n) => n.director_id === parseInt(filterDropdown)
                        : null
                ),
                filterText
                    ? (n) =>
                          n.title
                              .toLowerCase()
                              .includes(filterText.toLowerCase())
                    : null
            ).map((n) => {
                return (
                    <div
                        key={n.id}
                        className={"list movies"}
                        onClick={() => history.push(`/movies/${n.id}`)}
                    >
                        <div className={"photo"}>
                            <img
                                src={n.image_url}
                                alt={"Błąd wczytywania obrazu"}
                            />
                        </div>
                        <div className="info">
                            <p> {n.title}</p>
                            <p>
                                {t("genre")}: {n.genre}
                            </p>
                            <p>
                                {t("release-date")}:{" "}
                                {datePreparation(n.release_date)}
                            </p>
                        </div>
                    </div>
                );
            })
        );
    }, [filterText, filterDropdown, filterCheckbox, movies, sort]);

    return (
        <div className={"main"}>
            <div className="left">
                <button onClick={() => history.push("/movies/add")}>
                    {t("add-movie")}
                </button>
                <MoviesSort setSort={setSort} />
                <MoviesFilterCheckbox
                    movies={movies}
                    setFilter={setFilterCheckbox}
                    filter={filterCheckbox}
                />
                <MoviesFilterDropdown
                    persons={persons}
                    setFilter={setFilterDropdown}
                />
                <MoviesFilterText setFilter={setFilterText} />
            </div>

            <div className="right">
                <h3>{t("movies-list")}</h3>
                <Paginate
                    setPage={setPage}
                    page={page}
                    maxItems={5}
                    elements={elementsOnPage.length}
                />
                <div>{_.slice(elementsOnPage, page, page + 5)}</div>
                <Paginate
                    setPage={setPage}
                    page={page}
                    maxItems={5}
                    elements={elementsOnPage.length}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        movies: getAllMovies(state),
        persons: getAllPersons(state),
    };
};
const mapDispatchToProps = {
    getMovieList,
    getPersonList,
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);
