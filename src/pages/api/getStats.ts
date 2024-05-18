import type { NextApiRequest, NextApiResponse } from "next";
import getCommitCount from "~/server/getCommitCount";
import getJSPackages from "~/server/getJSPackages";
import getLanguages from "~/server/getLanguages";

export default async function getStats(req: NextApiRequest, res: NextApiResponse) {
	const commitCount = await getCommitCount();
	const jsPackages = await getJSPackages();
	const languages = await getLanguages();

	res.status(200).json({ message: "success", commitCount, jsPackages, languages });
}
