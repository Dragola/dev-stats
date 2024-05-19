import { Octokit } from "octokit"
import { TFunctionResponse } from "./checkForRateLimit";

type RepoStat = {
   totalRepos: Number,
   lastWeekCount: Number,
   lastYearCount: Number,
}

export default async function getRepoStats(user: string, repos: Array<any>,octokit: Octokit) : Promise<RepoStat | TFunctionResponse | null> {
   let totalRepos = repos.length;
   let currentWork = Array(totalRepos).fill(false);
   let lastYearCount = 0;
   let lastWeekCount = 0;
   let isFinished = false;
   let wasError = false;

   while (!isFinished && !wasError) {
      isFinished = true;
      for (let i = 0; i < totalRepos; i++) {
         if (repos[i].fork || currentWork[i]) continue;

         const repoName = repos[i].name;
         const repoStatRes = await octokit.rest.repos.getCommitActivityStats({
            owner: user,
            repo: repoName
         });

         if (!repoStatRes || repoStatRes.status !== 200) {
            wasError = true;
            continue;
         }

         for (let j = 0; j < repoStatRes.data.length; j++) {
            const week = repoStatRes.data[j];
            if (!week) continue;
            
            if (j == repoStatRes.data.length - 1) lastWeekCount += week.total
            lastYearCount += week?.total;
         }
         currentWork[i] = true;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
   }

   if (wasError) return null;

	return {
      totalRepos: totalRepos,
      lastWeekCount: lastWeekCount,
      lastYearCount: lastYearCount
   }
}
