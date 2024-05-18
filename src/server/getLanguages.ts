export default async function getLanguages(user: string, repos: Array<any>, octokit: Octokit): Promise<any> {
	
	if (!user || !repos || !octokit) return null;

	const languages = {};
	
	for (const value of repos) {
		const repoLanguages = await octokit.request('GET /repos/{owner}/{repo}/languages', {
			owner: user,
			repo: value.name,
			headers: {
			  'X-GitHub-Api-Version': '2022-11-28'
			}
		});
		
		if (!repoLanguages) return null;

		for (const [language, size] of Object.entries(repoLanguages.data)) {
			if (language in languages) languages[language] += size;
			else languages[language] = size;
 		}
	}

	return languages;
}
