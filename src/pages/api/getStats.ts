import type { NextApiRequest, NextApiResponse } from "next";
import { Url } from "next/dist/shared/lib/router/router";
import { Octokit } from "octokit";
import getCommitStats from "~/server/getCommitCount";
import getRepoStats from "~/server/getJSPackages";
import getLanguages from "~/server/getLanguages";

export default async function getStats(req: NextApiRequest, res: NextApiResponse) {
	let userUrlStr = req.query.userUrl
	if (userUrlStr === undefined || !isValidGithubURL(userUrlStr)) {
		res.status(422).json({ message: "Error: Missing or invalid required parameter userUrl" })
		return
	}
	
	let userUrl = new URL(userUrlStr as string)
	let user = userUrl.pathname.substring(1)

   	const octokit = new Octokit({
      auth: process.env.GITHUB_AUTH,
   	})
	let repoRes = await octokit.rest.repos.listForUser({
		username: user
	})

	const commitStats = await getCommitStats(user, octokit);
	const repoStats = await getRepoStats(user, repoRes.data, octokit);
	const languages = await getLanguages(user, repoRes.data, octokit);

	res.status(200).json({ message: "success", commitStats, repoStats, languages});
}

function isValidGithubURL(urlStr: string | string[]): boolean {
	let url: URL;

	// Verify that it's a string
	if (Array.isArray(urlStr))
		return false

	// Verify that it's a valid URL
	try {
		url = new URL(urlStr)
	} catch (_) {return false}

	let count = 0;
	let pathname = url.pathname;
	for (let i = 0; i < pathname.length; i++) {
		if (pathname[i] == "/")
			count++;
		if (count > 1)
			return false;
	}

	return true
}
