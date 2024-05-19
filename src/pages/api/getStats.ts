import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import getCommitStats from "~/server/getCommitCount";
import getRepoStats from "~/server/getRepoStats";
import getLanguages from "~/server/getLanguages";
import getFrameworks from "~/server/getJSPackages";
import getUserStats from "~/server/getUserStats";

export default async function getStats(req: NextApiRequest, res: NextApiResponse) {
	const userUrlStr = req.query.userUrl;
   	if (userUrlStr === undefined || !isValidGithubURL(userUrlStr)) {
      	return res.status(422).json({ message: "Error: Missing or invalid required parameter userUrl" })
   	}

   	const userUrl = new URL(userUrlStr as string);
   	const user = userUrl.pathname.substring(1);

   	const octokit = new Octokit({
		auth: process.env.GITHUB_AUTH,
	});
	const repoRes = await octokit.rest.repos.listForUser({
		username: user
	});

	const commitStats = await getCommitStats(user, octokit);
	if (!commitStats) return res.status(500).json({ message: "Failed to get commit stats"});

	const repoStats = await getRepoStats(user, repoRes.data, octokit);
	if (!repoStats) return res.status(500).json({ message: "Failed to get repo stats"});

	const languages = await getLanguages(user, repoRes.data, octokit);
	if (!languages) return res.status(500).json({ message: "Failed to get language stats"});

	const frameworks = await getFrameworks(user, repoRes.data, octokit);
	if (!frameworks) return res.status(500).json({ message: "Failed to get framework stats"});

	const userStats = await getUserStats(user, octokit);
	if (!userStats) return res.status(500).json({ message: "Failed to get user stats"});

	const timestamp = Date.now();

	return res.status(200).json({ message: "success", commitStats, repoStats, languages, frameworks, userStats , timestamp});
}

function isValidGithubURL(urlStr: string | string[]): boolean {
	let url: URL;

	// Verify that it's a string
	if (Array.isArray(urlStr)) return false;

	// Verify that it's a valid URL
	try {
		url = new URL(urlStr);
	} catch (_) { 
		return false;
	}

	let count = 0;
	let pathname = url.pathname;
	for (let i = 0; i < pathname.length; i++) {
		if (pathname[i] == "/") count++;
		if (count > 1) return false;
	}

	return true;
}
