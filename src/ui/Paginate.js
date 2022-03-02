const Paginate = ({ page, setPage, maxItems, elements }) => {
    return (
        <>
            {elements > maxItems ? (
                <div className={"paginate"}>
                    {page - maxItems >= 0 ? (
                        <button onClick={() => setPage(page - maxItems)}>
                            Poprzednia strona
                        </button>
                    ) : (
                        <button className={"empty"} />
                    )}
                    <p>Strona {page / maxItems + 1}</p>
                    {page + maxItems < elements ? (
                        <button onClick={() => setPage(page + maxItems)}>
                            Następna strona
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
