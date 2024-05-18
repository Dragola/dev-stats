import { Octokit } from "octokit"
export default async function getCommitStats(user: string, octokit: Octokit) {
    let query = "author:" + user;
    let res = await octokit.rest.search.commits({
        q: query,
    })
	return res.data.total_count
}
