export default async function getLanguages(user: string, repos: Array<any>, octokit: Octokit): Promise<any> {
	
	if (!user || !repos || !octokit) return null;

	const languages = [];
	
	for (const value of repos) {
		const repoLanguages = await octokit.request('GET /repos/{owner}/{repo}/languages', {
			owner: user,
			repo: value.name,
			headers: {
			  'X-GitHub-Api-Version': '2022-11-28'
			}
		});
		
		if (!repoLanguages) return null;

		for (const [lang, size] of Object.values(repoLanguages)) {
			if (lang in languages.keys()) languages[lang] += size;
			else languages.push({key: lang, value: size});
		}
	}

	return languages;
}
