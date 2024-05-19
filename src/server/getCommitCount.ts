import { Octokit } from "octokit"

export default async function getCommitStats(user: string, octokit: Octokit) {
    const query = "author:" + user;
    const res = await octokit.rest.search.commits({
        q: query,
    });

    if (!res || res.status !== 200) return null;

	return res.data.total_count;
}
