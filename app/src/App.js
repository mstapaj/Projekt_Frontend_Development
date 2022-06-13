import "./App.css";
import Statistics from "./ui/Statistics";
import Navbar from "./ui/Navbar";
import { ConfirmProvider } from "material-ui-confirm";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PersonsList from "./ui/persons/PersonsList";
import PersonsForm from "./ui/persons/PersonsForm";
import PersonDetails from "./ui/persons/PersonDetails";
import MoviesList from "./ui/movies/MoviesList";
import MoviesForm from "./ui/movies/MoviesForm";
import MovieDetails from "./ui/movies/MovieDetails";
import MovieAddActor from "./ui/movies/MovieAddActor";
import ActorsList from "./ui/actors/ActorsList";
import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import Backend from "i18next-http-backend";
import languages from "./config/languages.json";

const language = languages.find(
    (value) => value === localStorage.getItem("language")
);

i18next
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: language || "en",
        fallbackLng: "en",
        ns: ["main"],
        defaultNS: "main",
        react: {
            wait: true,
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
    });

function App() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
    };

    return (
        <div className="App">
            <ConfirmProvider>
                <BrowserRouter>
                    <Navbar chLang={changeLanguage} />
                    <div className="App">
                        <Switch>
                            <Route exact path={"/"} component={MoviesList} />
                            <Route
                                exact
                                path={"/graphs"}
                                component={Statistics}
                            />
                            <Route
                                exact
                                path={"/persons"}
                                component={PersonsList}
                            />
                            <Route
                                exact
                                path={"/persons/add"}
                                component={PersonsForm}
                            />
                            <Route
                                exact
                                path={"/persons/:id"}
                                component={PersonDetails}
                            />
                            <Route
                                exact
                                path={"/persons/:id/edit"}
                                component={PersonsForm}
                            />
                            <Route
                                exact
                                path={"/movies"}
                                component={MoviesList}
                            />
                            <Route
                                exact
                                path={"/movies/add"}
                                component={MoviesForm}
                            />
                            <Route
                                exact
                                path={"/movies/:id"}
                                component={MovieDetails}
                            />
                            <Route
                                exact
                                path={"/movies/:id/edit"}
                                component={MoviesForm}
                            />
                            <Route
                                exact
                                path={"/movies/:id/addActors"}
                                component={MovieAddActor}
                            />
                            <Route
                                exact
                                path={"/actors"}
                                component={ActorsList}
                            />
                        </Switch>
                    </div>
                </BrowserRouter>
            </ConfirmProvider>
        </div>
    );
}

export default App;
