import { motion } from "framer-motion";
import { type User } from "../components/MainView";

export default function SearchBar(props: {
	users: User[],
	setUsers: (newUsers: User[]) => void,
	setActiveUser: (activeUserId: string) => void,
	activeUser?: string,
}) {
	return  (
		<div className="flex flex-col gap-4 justify-center w-full">
			<input onKeyUp={(e) => {
				if (e.key !== "Enter") {
					return;
				}

				const value = e.currentTarget.value;

				fetch("api/getStats?userUrl=https://github.com/" + e.currentTarget.value, {
					method: "GET",
				}).then((res) => {
					return res.json()
				}).then((data: { 
					commitStats: number, 
					repoStats: { 
						totalRepos: number
					}, 
					languages: Record<string, number>,
					timestamp: string,
					frameworks: Record<string, number>,
					userStats: { avatar_url:string, blog?: string },
				}) => {
					console.log(data)

					const thing: User = {
						timeStamp: data.timestamp,
						profileImage: data.userStats.avatar_url,
						id: "@" + value,
						commitCount: data.commitStats,
						repoCount: data.repoStats.totalRepos,
						websiteUrl: data.userStats.blog === "" ? undefined : data.userStats.blog,
						languages: Object.keys(data.languages).map((language) => {
							return [language,data.languages[language]!]
						}),
						packages: Object.keys(data.frameworks).map((framework) => {
							return [framework,data.frameworks[framework]!]
						})
					}

					console.log(data, thing);
					props.setUsers([...props.users, thing]);
				}).catch((err) => {
					console.error(err)	
				})
			}} placeholder="username" className="text-white rounded-full px-4 py-1 bg-gray-800 border border-gray-600"></input>
			<div className="w-full flex flex-wrap gap-4">{props.users.map(({ id, timeStamp }) => {
				return (<motion.button whileHover={{
					backgroundColor: props.activeUser && props.activeUser === id + timeStamp ? "#DB665D" : "#ffffff",
					color: props.activeUser && props.activeUser === id + timeStamp ?  "#ffffff" : "#374151",
				}} animate={{
					backgroundColor: props.activeUser && props.activeUser === id + timeStamp ? "#ffffff" : "#374151",
					color: props.activeUser && props.activeUser === id + timeStamp ?  "#374151" : "#ffffff",
				}} onClick={() => {
					if (props.activeUser === id + timeStamp) {
						props.setUsers(props.users.filter((user) => {
							return user.id + user.timeStamp !== id + timeStamp
						}))	
					} else {
						props.setActiveUser(id + timeStamp)
					}
				}} className={
					"rounded-full px-6 py-1" 
				} key={id+timeStamp}>{id}</motion.button>)
			})}</div>	
		</div>
	)
}
