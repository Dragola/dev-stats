import Head from "next/head";
import SearchBar from "./components/Search";
import MainView, { type User } from "./components/MainView";
import { useRef, useState } from "react";
import useLocalStore from "./hooks/useLocalStore";

export default function Home() {
	const [users, setUsers] = useLocalStore<User[]>([], "profiles")	

	const lastActiveUser = useRef<User>();
	const [activeUser, setActiveUser] = useState<string>()	

	const user = users.find(({id}) => id === activeUser);

	return (
		<>
			<Head>
				<title>Create T3 App</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="w-screen h-screen bg-black flex justify-center items-center">
				<div className="w-2/3 flex gap-8 flex-col">
					<SearchBar activeUser={activeUser} setActiveUser={(newActiveUser) => {
						lastActiveUser.current = user 
						setActiveUser(newActiveUser)
					}} setUsers={setUsers} users={users}></SearchBar>
					{user && <MainView 
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
