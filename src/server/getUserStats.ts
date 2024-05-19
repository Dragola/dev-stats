import { Octokit } from "octokit"
import { TFunctionResponse } from "./checkForRateLimit";

type UserStats = {
   avatar_url: string,
   blog: string | null,
   email: string | null,
   socials: Array<{
      provider: string,
      url: string,
   }>
}

export default async function getUserStats(user: string, octokit: Octokit): Promise<UserStats | TFunctionResponse | null> {
   let userRes = await octokit.rest.users.getByUsername({
      username: user,
   })

   let userStat!: UserStats;
   if (userRes.status !== 200) return null;

   userStat = {
      avatar_url: userRes.data.avatar_url,
      blog: userRes.data.blog,
      email: userRes.data.email,
      socials: []
   }

   const userSocialRes = await octokit.rest.users.listSocialAccountsForUser({
      username: user,
   });

   if (!userStat && userSocialRes.status !== 200) return null;

   userStat.socials = userSocialRes.data;   
   return userStat;
}
