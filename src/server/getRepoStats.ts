import { Octokit } from "octokit"

type RepoStat = {
   totalRepos: Number,
   lastWeekCount: Number,
   lastYearCount: Number,
}

export default async function getRepoStats(user: string, repos: Array<any>,octokit: Octokit) : Promise<RepoStat> {
   let totalRepos = repos.length
   let currentWork = Array(totalRepos).fill(false)
   let lastYearCount = 0
   let lastWeekCount = 0
   let isFinished = false

   while (!isFinished) {
      isFinished = true
      for (let i = 0; i < totalRepos; i++) {
         if (repos[i].fork || currentWork[i])
            continue;

         let repoName = repos[i].name;
         let repoStatRes = await octokit.rest.repos.getCommitActivityStats({
            owner: user,
            repo: repoName
         })

         if (repoStatRes.status == 200) {
            for (let j = 0; j < repoStatRes.data.length; j++) {
               let week = repoStatRes.data[j]
               if (week === undefined) {
                  continue;
               }

               if (j == repoStatRes.data.length - 1)
                  lastWeekCount += week.total
               lastYearCount += week?.total
            }
             
            console.log("Done " + repoName)
            currentWork[i] = true;
         } else {
            isFinished = false;
         }
      }

      await new Promise(resolve => setTimeout(resolve, 100))
   }

	return {
      totalRepos: totalRepos,
      lastWeekCount: lastWeekCount,
      lastYearCount: lastYearCount
   }
}