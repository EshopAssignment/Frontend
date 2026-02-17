export function Pagination(props: {
    page:number;
    totalPages:number;
    onPrev: () => void;
    onNext: () => void;
}) {
    return(
        <div className="pagination">
            <button onClick={props.onPrev} disabled={props.page === 1}>
              {"<"}
            </button>

            <span>
              Sida {props.page} av {props.totalPages}
            </span>
            
            <button onClick={props.onNext} disabled= {props.page === props.totalPages}>
              {">"}
            </button>
        </div>
    )
}