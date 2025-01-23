interface PaginationProps {
  pageSize: number;
  total: number;
  currentPage: number;
  goToPage(page: number): void;
}

function Pagination(props: PaginationProps) {
  const pageCount = Math.ceil(props.total / props.pageSize);

  return (
    <>
      {pageCount > 0 && (
        <div className="relewise-pagination-buttons-container">
          <button className="button" disabled={props.currentPage === 1} onClick={() => props.goToPage(props.currentPage - 1)}>
            <span>Previous</span>
          </button>
          <button className="button" disabled={props.currentPage === pageCount} onClick={() => props.goToPage(props.currentPage + 1)}>
            <span>Next</span>
          </button>
        </div>
      )}
    </>
  );
}

export default Pagination;
