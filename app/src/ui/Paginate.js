import { useTranslation } from "react-i18next";

const Paginate = ({ page, setPage, maxItems, elements }) => {
    const { t } = useTranslation();
    return (
        <>
            {elements > maxItems ? (
                <div className={"paginate"}>
                    {page - maxItems >= 0 ? (
                        <button onClick={() => setPage(page - maxItems)}>
                            {t("prev-page")}
                        </button>
                    ) : (
                        <button className={"empty"} />
                    )}
                    <p>
                        {t("page")} {page / maxItems + 1}
                    </p>
                    {page + maxItems < elements ? (
                        <button onClick={() => setPage(page + maxItems)}>
                            {t("next-page")}
                        </button>
                    ) : (
                        <button className={"empty"} />
                    )}
                </div>
            ) : null}
        </>
    );
};

export default Paginate;
