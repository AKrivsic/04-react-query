import css from './App.module.css';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import toast from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const handleCloseModal = () => setSelectedMovie(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);
      const fetched = await fetchMovies(query);
      if (fetched.length === 0) {
      toast.error('No movies found for your request.');
      return;
      }
      
      setMovies(fetched);
    } catch (e) {
      setIsError(true);
      console.error('Error loading movies:', e);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    console.log('Selected movie:', movie);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    )} 
    </div>
  );

}