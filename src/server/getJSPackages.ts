import { Octokit } from "octokit"

export default async function getFrameworks(user: string, repos: Array<any>,octokit: Octokit) {
   let allReposDependencies: Array<Array<string>> = [];
   let counters: {[key: string]: number} = {};
   for (let i = 0; i < repos.length; i++) {
         const repo = repos[i];
         if (repo.fork) continue;

         let contentRes;
         try {
            contentRes = await octokit.rest.repos.getContent({
               owner: user,
               repo:  repo.name,
               path: "package.json",
            });
         } catch (_) {
            // Most likely due to 404
            continue;
         }

         if (!contentRes || contentRes.status !== 200 || !contentRes.data) return null;

         const { dependencies } = JSON.parse(atob(contentRes.data.content))
         if (dependencies !== undefined) allReposDependencies.push(Object.keys(dependencies))
   }
   for (let i = 0; i < allReposDependencies.length; i++) {
      for (let j = 0; j < allReposDependencies[i].length; j++) {
         const currCounter = counters[allReposDependencies[i][j]]
         counters[allReposDependencies[i][j]] = currCounter == undefined ? 1 : currCounter + 1;
      }
   }
	return counters;
}
