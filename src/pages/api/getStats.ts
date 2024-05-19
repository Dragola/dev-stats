import type { NextApiRequest, NextApiResponse } from "next";
import { Url } from "next/dist/shared/lib/router/router";
import { Octokit } from "octokit";
import getCommitStats from "~/server/getCommitCount";
import getRepoStats from "~/server/getRepoStats";
import getLanguages from "~/server/getLanguages";
import getFrameworks from "~/server/getJSPackages";
import getUserStats from "~/server/getUserStats";
import { checkForRateLimit } from "~/server/checkForRateLimit";

export default async function getStats(req: NextApiRequest, res: NextApiResponse) {
   const userUrlStr = req.query.userUrl;
   if (userUrlStr === undefined || !isValidGithubURL(userUrlStr)) return res.status(422);
   
   const userUrl = new URL(userUrlStr as string);
   const user = userUrl.pathname.substring(1);

   const octokit = new Octokit({
      auth: process.env.GITHUB_AUTH,
   });

   console.log('Before');

   const repoRes = await octokit.rest.repos.listForUser({
      username: user
   });

   console.log('Check if repoRes is rate limited!');

   const checkAPI = checkForRateLimit(repoRes);
   if (checkAPI.rateLimited) return res.status(checkAPI.statusCode).json({rateLimit: checkAPI});

   console.log('checkAPI- not rate limited!');

   const commitStats = await getCommitStats(user, octokit);
   if (commitStats === -1) return res.status(500).json({message: 'Bad or missing data'});
   else if (typeof commitStats === 'object') return res.status(commitStats.statusCode).json({message: 'RateLimited!', rateLimit: commitStats});

   console.log('commitStats collected');

   const repoStats = await getRepoStats(user, repoRes.data, octokit);
   if (!repoStats) return res.status(500).json({message: 'Bad or missing data'});
   else if ('timeToReset' in repoStats) return res.status(repoStats.statusCode).json({message: 'RateLimited!', rateLimit: repoStats});

   console.log('repoStats collected');

   const languages = await getLanguages(user, repoRes.data, octokit);
   if (!languages) return res.status(500).json({message: 'Bad or missing data'});
   else if ('timeToReset' in languages) return res.status(languages.statusCode).json({message: 'RateLimited!', rateLimit: languages});

   console.log('languages collected');

   const frameworks = await getFrameworks(user, repoRes.data, octokit);
   if (!frameworks) return res.status(500).json({message: 'Bad or missing data'});
   else if ('timeToReset' in frameworks) return res.status(frameworks.statusCode).json({message: 'RateLimited!', rateLimit: frameworks});

   console.log('frameworks collected');

   const userStats = await getUserStats(user, octokit);
   if (!userStats) return res.status(500).json({message: 'Bad or missing data'});
   else if ('timeToReset' in userStats) return res.status(userStats.statusCode).json({message: 'RateLimited!', rateLimit: userStats});

   console.log('userStats collected');

   const timestamp = Date.now();

   return res.status(200).json({ message: "success", commitStats, repoStats, languages, frameworks, userStats , timestamp});
}

function isValidGithubURL(urlStr: string | string[]): boolean {
   let url: URL;

   // Verify that it's a string
   if (Array.isArray(urlStr))
      return false

   // Verify that it's a valid URL
   try {
      url = new URL(urlStr)
   } catch (_) { return false }

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
