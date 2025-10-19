import { getNotionMovies } from '~~/server/utils/notion';

export default defineEventHandler(event => getNotionMovies(event));
