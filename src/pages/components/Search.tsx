import {motion} from "framer-motion"

export default function SearchBar(props: {
	users: {
		id: string,
	}[],
	setActiveUser: (activeUserId: string) => void,
	activeUser: string,
}) {
	return  (
		<div className="flex flex-col flex gap-4 justify-center w-full">
			<input onKeyUp={(e) => {
				if (e.key !== "Enter") {
					return;
				}

				fetch("api/getStats?userUrl=https://github.com/" + e.currentTarget.value, {
					method: "GET",
				}).then((res) => {
					return res.json()
				}).then(data => {
					console.log(data)
				}).catch((err) => {
					console.error(err)	
				})
			}} placeholder="username" className="text-white rounded-full px-4 py-1 bg-gray-800 border border-gray-600"></input>
			<div className="w-full flex gap-4">{props.users.map(({ id }) => {
				return (<motion.button whileHover={{
					backgroundColor: "#ffffff",
					color: "#374151"
				}} animate={{
					backgroundColor: props.activeUser === id ? "#ffffff" : "#374151",
					color: props.activeUser === id ?  "#374151" : "#ffffff"
				}} onClick={() => props.setActiveUser(id)} className={
					"rounded-full px-6 py-1" 
				} key={id}>{id}</motion.button>)
			})}</div>	
		</div>
	)
}
