import { Octokit } from "octokit"

type UserStats = {
   avatar_url: string,
   blog: string | null,
   email: string | null,
}

export default async function getUserStats(user: string, octokit: Octokit) {
   let userRes = await octokit.rest.users.getByUsername({
      username: user,
   })

   let userStat: UserStats ;
   
   if (userRes.status == 200) {
      userStat = {
         avatar_url: userRes.data.avatar_url,
         blog: userRes.data.blog,
         email: userRes.data.email,
      }
      return userStat
   }

   return undefined
}
