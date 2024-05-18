import type { NextApiRequest, NextApiResponse } from "next";
import { Url } from "next/dist/shared/lib/router/router";
import getCommitCount from "~/server/getCommitCount";
import getJSPackages from "~/server/getJSPackages";
import getLanguages from "~/server/getLanguages";

export default async function getStats(req: NextApiRequest, res: NextApiResponse) {
	let userUrlStr = req.query.userUrl
	if (userUrlStr === undefined || !isValidGithubURL(userUrlStr)) {
		res.status(422).json({ message: "Error: Missing or invalid required parameter userUrl" })
		return
	}
	
	let userUrl = new URL(userUrlStr as string)
	let user = userUrl.pathname.substring(1)

	const commitCount = await getCommitCount(user);
	const jsPackages = await getJSPackages();
	const languages = await getLanguages();

	res.status(200).json({ message: "success", commitCount, jsPackages, languages });
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