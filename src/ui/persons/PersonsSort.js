import { useTranslation } from "react-i18next";

const PersonsSort = ({ setSort }) => {
    const { t } = useTranslation();

    return (
        <div>
            <h4>{t("sort")}:</h4>
            <div
                className={"sort"}
                onChange={(event) => {
                    setSort(event.target.value.toString());
                }}
            >
                <p>
                    {t("lack")}
                    <input
                        type="radio"
                        name="picked"
                        value="null"
                        defaultChecked={true}
                    />
                </p>
                <p>
                    {t("alpha")}{" "}
                    <input type="radio" name="picked" value="alpha" />
                </p>
                <p>
                    {t("by-birth-date")}{" "}
                    <input type="radio" name="picked" value="birth_date" />
                </p>
            </div>
        </div>
    );
};

export default PersonsSort;
