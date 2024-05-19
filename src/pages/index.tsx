import Head from "next/head";
import SearchBar from "./components/Search";
import MainView, { type User } from "./components/MainView";
import { useEffect, useRef, useState } from "react";
import useLocalStore from "./hooks/useLocalStore";
import { useRouter } from "next/router";
import { decode } from "./utils/dataEncoder";

export default function Home() {
	const [users, setUsers] = useLocalStore<User[]>([], "profiles")	

	const lastActiveUser = useRef<User>();
	const [activeUser, setActiveUser] = useState<string>()	

	const user = users.find(({id, timeStamp}) => id + timeStamp === activeUser);

	const [loading, setLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (!router.isReady)
			return

		if (!("user" in router.query 
			&& router.query.user !== undefined 
			&& typeof(router.query.user) === "string"))
			return;
		const providedUser = decode(router.query.user)
		const storedUser = validateUser(providedUser)

		console.log(storedUser)

		if (storedUser === undefined)
			return;

		const found = users.some((user, _, __) => 
			storedUser.id + storedUser.timeStamp === user.id + user.timeStamp)
		if (found)
			return

		console.log("updating")
		setUsers([...users, storedUser])	
	}, [router.isReady])

	return (
		<>
			<Head>
				<title>DevStats</title>
				<meta name="description" content="Collect your github stats!!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{loading === true && <div className="z-40 w-full h-full bg-black bg-opacity-70 backdrop-blur-md fixed left-0 right-0 flex justify-center items-center">
				<div role="status">
					<svg aria-hidden="true" className="w-16 h-16 z-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<span className="sr-only">Loading...</span>
				</div>
			</div>}
			<div className="w-screen h-full">
				<div className="py-20 px-[16vw] h-full w-full flex gap-12 flex-col">
					<SearchBar setLoading={setLoading} activeUser={activeUser} setActiveUser={(newActiveUser) => {
						lastActiveUser.current = user 
						setActiveUser(newActiveUser)
					}} setUsers={setUsers} users={users}></SearchBar>
					{user && <MainView
						timeStamp={user.timeStamp}
						commitCount={user.commitCount}
						repoCount={user.repoCount}
						websiteUrl={user.websiteUrl}
						packages={user.packages}
						languages={user.languages}
						id={user.id}
						profileImage={user.profileImage}
					></MainView>}
				</div>
			</div>
		</>
	);
}

function validateUser(user: any): User | undefined {
	let newUser: User = {
		profileImage: "",
		id: "",
		commitCount: 0,
		repoCount: 0,
		timeStamp: "",
		languages: [["", 0]],
		packages: [["", 0]],
	};

	if (!(user.hasOwnProperty("profileImage") &&
		user.hasOwnProperty("id") &&
		user.hasOwnProperty("commitCount") &&
		user.hasOwnProperty("repoCount") &&
		user.hasOwnProperty("timeStamp") &&
		user.hasOwnProperty("languages") &&
		user.hasOwnProperty("packages"))
	)
		return undefined
	
	newUser.profileImage = user.profileImage;
	newUser.id = user.id;
	newUser.commitCount = user.commitCount;
	newUser.repoCount = user.repoCount;
	newUser.timeStamp = user.timeStamp;
	newUser.languages = user.languages;
	newUser.packages = user.packages;
	newUser.websiteUrl = user.websiteUrl;

	return newUser
}