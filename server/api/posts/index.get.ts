import { getNotionPosts } from '~~/server/utils/notion';

export default defineEventHandler(event => getNotionPosts(event));
