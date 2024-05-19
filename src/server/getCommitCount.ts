import { Octokit } from "octokit"
import { TFunctionResponse, checkForRateLimit } from "./checkForRateLimit";
export default async function getCommitStats(user: string, octokit: Octokit): Promise<number | TFunctionResponse> {
    let query = "author:" + user;
    let res = await octokit.rest.search.commits({
        q: query,
    })

    const checkAPI = checkForRateLimit(res);
    if (checkAPI.rateLimited) return checkAPI;

    if (!res.data || !res.data.total_count) return -1;

	return res.data.total_count;
}
