import { jest, expect, describe, beforeEach, it } from "@jest/globals";
import CacheFollowingCommand from "../../../src/commands/cache_following/CacheFollowingCommand";
import FollowsCache from "../../../src/svc/cache/FollowsCache";
import Following from "../../../src/svc/mastodon/Following";

jest.mock("../../../src/svc/mastodon/Following")
jest.mock("../../../src/svc/cache/FollowsCache");

const cache = new FollowsCache("url");
const following = new Following("api", "accountId")


describe("CacheFollowingCommand", () => {
    
  let cmd: CacheFollowingCommand;
  beforeEach(() => {

    cmd = new CacheFollowingCommand({
        mastodonAccountId: "a",
        mastodonApi: "b",
        mastodonApiKey: "c",
        redisURL: "d",
    });
    jest.clearAllMocks()
  });

  it("send() calls setup, loadFollowing, cacheFollowing", async () => {
    cmd['cache'] = cache
    cmd['setup'] = jest.fn(() => Promise.resolve())
    cmd.loadFollowing = jest.fn(() => Promise.resolve(new Set<string>()))
    cmd.cacheFollowing = jest.fn(() => Promise.resolve())

    await cmd.send()
    expect(cmd.loadFollowing).toHaveBeenCalledTimes(1)
    expect(cmd.cacheFollowing).toHaveBeenCalledTimes(1)
  });


  it("loadFollowing calls following.load()", async () => {
    cmd['following'] = following;
    await cmd.loadFollowing();
    expect(following.load).toHaveBeenCalledTimes(1)
  });


  it("cacheFollowing calls connect, addFollows, disconnect", async () => {
    const set = new Set<string>().add("a").add("b").add("c");
    cmd['cache'] = cache;
    await cmd.cacheFollowing(set);

    expect(cache.connect).toHaveBeenCalledTimes(1)
    expect(cache.addFollows).toHaveBeenCalledTimes(1)
    expect(cache.disconnect).toHaveBeenCalledTimes(1)
  });

});
