import { Octokit } from "octokit"

export default async function getRepoStats(user: string, repos: Array<any>,octokit: Octokit) {
	// let repos = repoRes.data
	let totalRepos = repos.length
	return totalRepos
}
