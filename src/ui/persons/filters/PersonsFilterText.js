import { useTranslation } from "react-i18next";

const PersonsFilterText = ({ setFilter }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h4>{t("filter-by-name")}</h4>
            <input
                id={"name"}
                type={"text"}
                onChange={(event) => setFilter(event.target.value)}
            />
        </div>
    );
};

export default PersonsFilterText;
