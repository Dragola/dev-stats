export default async function getLanguages(user: string, repos: Array<any>, octokit: Octokit): Promise<any> {
	if (!user || !repos || !octokit) return null;

	const languages: Record<string, number> = {};
	
	for (const value of repos) {
		const repoLanguages = await octokit.request('GET /repos/{owner}/{repo}/languages', {
			owner: user,
			repo: value.name,
			headers: {
			  'X-GitHub-Api-Version': '2022-11-28'
			}
		});
		
		if (!repoLanguages || repoLanguages.status !== 200) return null;

		for (const [language, size] of Object.entries(repoLanguages.data)) {
			if (language in languages) languages[language] += size;
			else languages[language] = size;
 		}		
	}

	if (Object.keys(languages).length <= 10) return languages;

	return getHighestLanguages(languages);
}

function getHighestLanguages (languages: any) {
	const highestLanguages: Record<string, number> = {};

	const languageSizes: Array<number> = Object.values(languages);

	for (let i= 0; i < 10; i++) {
		const highestLanguageIndex = languageSizes.indexOf(Math.max(...languageSizes));
		const key = Object.keys(languages)[highestLanguageIndex] || '';
		if (key === '') continue; //Note: There must be a key so this should never be possible
		
		highestLanguages[key] = languages[key];
		languageSizes[highestLanguageIndex] = -1;
	}

	return highestLanguages;
}
