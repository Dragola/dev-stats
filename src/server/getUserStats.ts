import { Octokit } from "octokit"

type UserStats = {
   avatar_url: string,
   blog: string | null,
   email: string | null,
   socials: Array<{
      provider: string,
      url: string,
   }>
}

export default async function getUserStats(user: string, octokit: Octokit) {
   let userRes = await octokit.rest.users.getByUsername({
      username: user,
   })

   let userStat!: UserStats ;
   
   if (userRes.status == 200) {
      userStat = {
         avatar_url: userRes.data.avatar_url,
         blog: userRes.data.blog,
         email: userRes.data.email,
         socials: []
      }
   } else {
      return undefined
   }

   let userSocialRes = await octokit.rest.users.listSocialAccountsForUser({
      username: user,
   })

   if (userStat !== null && userSocialRes.status == 200) {
      userStat.socials = userSocialRes.data      
      return userStat
   }

   return undefined
}
