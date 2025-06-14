import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import toast from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';


export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

   const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== '',
    placeholderData: (previousData) => previousData,
   });
  
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, query]);
  
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}