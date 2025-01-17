interface PaginationProps {
  pageSize: number;
  total: number;
  currentPage: number;
  goToPage(page: number): void;
}

function Pagination(props: PaginationProps) {
  const pageCount = Math.ceil(props.total / props.pageSize);
  const getRange = (start: number, end: number) => {
    return Array(end - start + 1)
      .fill("")
      .map((v, i) => i + start);
  };

  // Logic borrowed from https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
  const pageRange = () => {
    let delta: number;
    if (pageCount <= 7) {
      // delta === 7: [1 2 3 4 5 6 7]
      delta = 7;
    } else {
      // delta === 2: [1 ... 4 5 6 ... 10]
      // delta === 4: [1 2 3 4 5 ... 10]
      delta =
        props.currentPage > 4 && props.currentPage < pageCount - 3 ? 2 : 4;
    }
    const range = {
      start: Math.round(props.currentPage - delta / 2),
      end: Math.round(props.currentPage + delta / 2)
    };
    if (range.start - 1 === 1 || range.end + 1 === pageCount) {
      range.start += 1;
      range.end += 1;
    }
    let pages: (string | number)[] =
      props.currentPage > delta
        ? getRange(
            Math.min(range.start, pageCount - delta),
            Math.min(range.end, pageCount)
          )
        : getRange(1, Math.min(pageCount, delta + 1));
    const withDots = (value: number, pair: (string | number)[]) =>
      pages.length + 1 !== pageCount ? pair : [value];
    if (pages[0] !== 1) {
      pages = withDots(1, [1, "..."]).concat(pages);
    }
    if (Number(pages[pages.length - 1]) < pageCount) {
      pages = pages.concat(withDots(pageCount, ["...", pageCount]));
    }
    return pages;
  };
  
  return (
    <>
      {pageCount > 0 && (
        <div>
          <button
            disabled={props.currentPage === 1}
            onClick={() => props.goToPage(props.currentPage - 1)}>
          <span>prev</span>
          </button>
          
          {pageRange().map((page, index) => (
            <button
              key={index}
              onClick={() => props.goToPage(+page)}
              disabled={typeof page != "number" || +page == props.currentPage}>
            {page}
            </button>
          ))}
          <button
            disabled={props.currentPage === pageCount}
            onClick={() => props.goToPage(props.currentPage + 1)}>
          <span> next </span>
          </button>
        </div>
      )}
    </>
  );
}

export default Pagination;
