import FollowsCache from "./cache/FollowsCache";

export const loadFollows = async (redisURL: string): Promise<Set<string>> => {
  const cache = new FollowsCache(redisURL);

  try {
    await cache.connect();
    return await cache.getFollows();
  } finally {
    await cache.disconnect();
  }
};
