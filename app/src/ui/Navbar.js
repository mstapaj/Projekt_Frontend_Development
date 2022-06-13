import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = ({ chLang }) => {
    const history = useHistory();
    const { t } = useTranslation();

    return (
        <div className={"title"}>
            <p onClick={() => history.push("/movies")}>{t("movies")}</p>
            <div>
                <ul>
                    <li key={"movies"} onClick={() => history.push("/movies")}>
                        {" "}
                        {t("movies")}
                    </li>
                    <li
                        key={"persons"}
                        onClick={() => history.push("/persons")}
                    >
                        {" "}
                        {t("persons")}
                    </li>
                    <li key={"actors"} onClick={() => history.push("/actors")}>
                        {t("actors")}
                    </li>
                    <li key={"graphs"} onClick={() => history.push("/graphs")}>
                        {" "}
                        {t("stats")}
                    </li>
                    <div key={"lang"} className={"lang"}>
                        <div onClick={() => chLang("pl")}>PL</div>
                        <div onClick={() => chLang("en")}>ENG</div>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
