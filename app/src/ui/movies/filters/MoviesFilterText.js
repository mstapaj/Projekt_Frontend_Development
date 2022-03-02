import { useTranslation } from "react-i18next";

const MoviesFilterText = ({ setFilter }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h4>{t("filter-by-title")}</h4>
            <input
                id={"title"}
                type={"text"}
                onChange={(event) => setFilter(event.target.value)}
            />
        </div>
    );
};

export default MoviesFilterText;
