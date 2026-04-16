import React from 'react';
import { Button } from './UI/button';

const Pagination = ({ prjData, setCurrentPage }) => {
  return (
    <div className='ml-5'>
      <nav aria-label='Page navigation'>
        <ul className='inline-flex gap-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-sm'>
          <li>
            <Button
              variant='ghost'
              disabled={prjData.currentPage === 1}
              onClick={() => setCurrentPage(currentPage => currentPage - 1)}
            >
              Prev
            </Button>
          </li>
          {Array.from({ length: prjData.totalPages }, (_, i) => i + 1).map(
            page => (
              <li key={page}>
                <Button
                  variant={
                    prjData.currentPage === page ? 'default' : 'ghost'
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              </li>
            )
          )}
          <li>
            <Button
              variant='ghost'
              onClick={() => setCurrentPage(currentPage => currentPage + 1)}
              disabled={prjData.totalPages === prjData.currentPage}
            >
              Next
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
