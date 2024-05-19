import { GeistSans } from "geist/font/sans";
import { koulen } from "../_app";
import { motion, useAnimate } from "framer-motion"
import { useEffect, useState } from "react";
import { IoShareSocial, IoCopy } from "react-icons/io5";
import { IconContext } from "react-icons";
import QRCode from "react-qr-code" ;

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
	const [isCopyClicked, setIsCopyClicked] = useState(false)
	const [isShareSocialClicked, setIsShareSocialClicked] = useState(false)
	const [isQRCodeClicked, setIsQRCodeClicked] = useState(false)
	const [midScreenDistance, setMidScreenDistance] = useState([0, 0])
	const [isQRCodeTransforming, setIsQRCodeTransforming] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(
`
**Username:** ${props.id}
**Languages:** made use of ${props.languages.map(([lang]) => lang)} in my github repos. ${props.packages ? `\n**Frameworks:** Web developer profiecent with: ${props.packages.map(([pack]) => pack)}`:""}${props.websiteUrl ? `\n**Personal Website:** ${props.websiteUrl}`:""}
**Repo Count:** ${props.repoCount}
**Commit Count:** ${props.commitCount}
`
)
		setIsCopyClicked(true)
		setTimeout(() => setIsCopyClicked(false), 100)
	}
	const handleShareSocial = () => {
		navigator.clipboard.writeText("")
		setIsShareSocialClicked(true)
		setTimeout(() => setIsShareSocialClicked(false), 100)
	}
	const handleQRCodeClicked = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
		const clientRect = e.currentTarget.getBoundingClientRect()
		const midElX = clientRect.x + clientRect.width / 2
		const midElY = clientRect.y + clientRect.height / 2
		setMidScreenDistance([window.innerWidth / 2 - midElX, window.innerHeight / 2 - midElY])
		setIsQRCodeClicked(true)
	}

	useEffect(() => {
		void animate("div", {opacity: ["0%", "100%"]}, {duration: 0.8});
		void animate(".deez", {x: ["-100vw", "0"]}, {duration: 0.5});
	}, [props.profileImage, animate])

	return (
		<motion.div 
			ref={scope}
			className="gap-12 border-white pb-4  border-b flex flex-wrap justify-center">
			<div className="flex flex-col gap-12 deez">
				<img
					alt="profile"
					src={props.profileImage} 
					className="max-lg:justify-center border border-gray-700 rounded-full object-cover object-center w-80 h-80"
				>
				</img>
				<div className="flex gap-4 justify-between">
					<p className="text-white koulen text-2xl" style={koulen.style}>{props.id}</p>
					<IconContext.Provider value={{
						color: "white", 
						size: "2em", 
						className: "h-full w-full hover:opacity-50 hover:cursor-pointer"
						}}>
						<div className="flex flex-row gap-x-4">
							<motion.div 
								className="w-full h-full"
								variants={{
									clicked : { scale: 0.7, transition: { duration: 0.05 } },
									normal : { scale: 1 }
								}}
								animate={isCopyClicked ? 'clicked' : 'normal'}>
								<IoCopy onClick={handleCopy} />
							</motion.div>
							<motion.div 
								className="w-full h-full"
								variants={{
									clicked : { scale: 0.7, transition: { duration: 0.05 } },
									normal : { scale: 1 }
								}}
								animate={isShareSocialClicked ? 'clicked' : 'normal'}>
								<IoShareSocial onClick={handleShareSocial} />
							</motion.div>
							<motion.div
								className="w-full h-full"
								variants={{
									clicked : {
										translateX: midScreenDistance[0],
										translateY: midScreenDistance[1],
										scale: 20, 
										position: "relative",
										transition: { 
											duration: 0.5 
										} 
									},
									normal : { 
										scale: 1, 
										transition: { 
											duration: 0.5 
										}
									}
								}}
								onTransitionStart={() => setIsQRCodeTransforming(true)}
								onTransitionEnd={() => setIsQRCodeTransforming(false)}
								animate={isQRCodeClicked ? 'clicked' : 'normal'}
							>
								<div className="w-full h-full align-middle">
									<QRCode
										className={`hover:cursor-pointer 
											${isQRCodeClicked ? "" : "hover:opacity-50"}`}
										fgColor="white"
										bgColor="black"
										size={29}
										value={"Temporary value"}
										onClick={handleQRCodeClicked}
										onMouseLeave={() => isQRCodeTransforming || setIsQRCodeClicked(false)}
									/>
								</div>
							</motion.div>
						</div>
					</IconContext.Provider>
				</div>	
			</div>
			<motion.div className={"flex flex-wrap sm2:justify-around grow gap-6 text-white [&>div>h3]:text-2xl " + koulen.className}>
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
					<p style={GeistSans.style}>Profile Created: {new Date(props.timeStamp).toLocaleDateString(1)}</p>
					{props.websiteUrl && 
						<p style={GeistSans.style}>Website Url: <a className="text-blue-400" href={`${props.websiteUrl}`}>{props.websiteUrl}</a></p>
					}	
				</div>
			</motion.div>
		</motion.div>
	);
}
