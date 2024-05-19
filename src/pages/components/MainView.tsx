import { GeistSans } from "geist/font/sans";
import { koulen } from "../_app";
import { motion, useAnimate } from "framer-motion"
import { useEffect } from "react";

export type User = {
	profileImage: string,
	id: string,
	commitCount: number,
	repoCount: number,
	websiteUrl?: string,
	timeStamp: string,
	languages: [string, number][],
	packages: [string, number][],
}

export default function MainView(props: User) {
	const [scope, animate] = useAnimate()

	useEffect(() => {
		void animate("div", {opacity: ["0%", "100%"]}, {duration: 0.8});
		void animate(".deez", {x: ["-100vw", "0"]}, {duration: 0.5});
	}, [props.profileImage, animate])

	return (
		<motion.div 
			ref={scope}
			className="gap-12 border-white border-b flex flex-wrap justify-center">
			<div className="flex flex-col gap-12 deez">
				<img
					alt="profile"
					src={props.profileImage} 
					className="max-lg:justify-center border border-gray-700 rounded-full object-cover object-center w-80 h-80"
				>
				</img>
				<div className="flex gap-4">
					<p className="text-white koulen text-3xl" style={koulen.style}>{props.id}</p>
				</div>	
			</div>
			<motion.div className={"flex flex-wrap justify-around grow gap-6 text-white [&>div>h3]:text-2xl " + koulen.className}>
				<div>
					<h3>Languages:</h3>
					{props.languages.map(([language]) => {
						return <p key={language} style={GeistSans.style}>{language}</p>
					})}
				</div>
				<div>
					<h3>Frameworks {"&"} Libraries:</h3>
					{props.packages.map(([packages]) => {
						return <p key={packages} style={GeistSans.style}>{packages}</p>
					})}	
				</div>
				<div>
					<h3>General Stats</h3>
					<p style={GeistSans.style}>Commits: {props.commitCount}</p>
					<p style={GeistSans.style}>Total Repos: {props.repoCount}</p>
					{props.websiteUrl && 
						<p style={GeistSans.style}>Website Url: <a className="text-blue-400" href={`${props.websiteUrl}`}>{props.websiteUrl}</a></p>
					}	
				</div>
			</motion.div>
		</motion.div>
	);
}
