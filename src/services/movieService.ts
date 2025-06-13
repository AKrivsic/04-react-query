import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

interface GetMoviesRes {
    results: Movie[];
    total_pages: number;
}

export const fetchMovies = async (
    query: string,
    page = 1
): Promise<GetMoviesRes> => {
    const config = {
        params: { query, page },
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    };

    const response = await axios.get<GetMoviesRes>(BASE_URL, config);
    return response.data;
};
