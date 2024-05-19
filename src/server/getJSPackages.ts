import { Octokit } from "octokit"
import { TFunctionResponse, checkForRateLimit } from "./checkForRateLimit";

export default async function getFrameworks(user: string, repos: Array<any>,octokit: Octokit): Promise<any| TFunctionResponse> {
   let allReposDependencies: Array<Array<string>> = [];
   let counters: {[key: string]: number} = {};
   for (let i = 0; i < repos.length; i++) {
         const repo = repos[i];
         if (repo.fork) continue;

         const contentRes = await octokit.rest.repos.getContent({
            owner: user,
            repo:  repo.name,
            path: "package.json",
         });
         
         const checkAPI = checkForRateLimit(contentRes);
         if (checkAPI.rateLimited || checkAPI.statusCode !== 200) return checkAPI;

         if (contentRes.status !== 200 || !contentRes.data) return null;

         if (!("content" in contentRes.data)) {
            return undefined
         }
         const { dependencies } = JSON.parse(atob(contentRes.data.content))
         if (dependencies !== undefined) allReposDependencies.push(Object.keys(dependencies))
   }
   for (let i = 0; i < allReposDependencies.length; i++) {
      const currRepo = allReposDependencies[i]
      if (currRepo === undefined)
         continue
      for (let j = 0; j < currRepo.length; j++) {
         const currDependency = currRepo[j]
         if (currDependency === undefined)
            continue
         const currCounter = counters[currDependency]
         counters[currDependency] = currCounter == undefined ? 1 : currCounter + 1;
      }
   }
	return counters;
}
