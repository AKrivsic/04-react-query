import axios from 'axios';
// import { query } from '../components/SearchBar/SearchBar';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

interface GetMoviesRes {
    results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
    const config = {
        params: { query },
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    };

    const response = await axios.get<GetMoviesRes>(BASE_URL, config);
    return response.data.results;
};
