import { Octokit } from "octokit"
export default async function getCommitCount(user: string) {
    const octokit = new Octokit({
        auth: process.env.GITHUB_AUTH,
    })

    let query = "author:" + user;
    let res = await octokit.rest.search.commits({
        q: query,
    })
	return res.data.total_count
}