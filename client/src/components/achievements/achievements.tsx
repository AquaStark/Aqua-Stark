import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Award } from "lucide-react";
import { achievements } from "@/lib/constants/mock-data/mock-achievements";

export const Achievements = () => {
	const [activeTab, setActiveTab] = useState("All");

	const tabs = ["All", "Collection", "Breeding", "Special"];

	const progressStats = {
		Collection: { completed: 1, total: 3 },
		Breeding: { completed: 0, total: 1 },
		Decoration: { completed: 0, total: 1 },
		Special: { completed: 1, total: 2 },
	};

	// Filter achievements based on the active tab
	const filteredAchievements =
		activeTab === "All"
			? achievements
			: achievements.filter((achievement) => achievement.category === activeTab);

	// Animation variants for the card
	const cardVariants = {
		initial: {
			scale: 1,
			y: 0,
		},
		hover: {
			scale: [1, 1.02, 1],
			// y: [0, -2, 0],
			transition: {
				scale: { duration: 0.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
				y: { duration: 0.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
			},
		},
	};

	return (
		<main className="min-h-screen mt-4">
			<section className="">
				<div className="flex justify-between gap-3 flex-wrap items-center mb-6">
					<h2 className="text-xl font-bold text-white">Your Achievement</h2>
					<div className="flex flex-wrap gap-2">
						{tabs.map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
									activeTab === tab
										? "bg-blue-700/30 text-white"
										: "bg-blue-700/80 bg-opacity-50 text-gray-100 hover:bg-opacity-70"
								} backdrop-blur-md`}
							>
								{tab}
							</button>
						))}
					</div>
				</div>

				{/* Achievement Progress */}
				<div className="bg-[#1A2A44] bg-opacity-20 backdrop-blur-md rounded-lg p-4 text-white mb-6">
					<div className="flex flex-wrap gap-3 justify-between items-center mb-2">
						<h3 className="text-lg font-semibold">Achievement Progress</h3>
						<span className="text-sm">2 of 8 completed</span>
					</div>
					<div className="w-full bg-blue-700/80 rounded-full h-2 mb-4">
						<div
							className="bg-purple-500 h-2 rounded-tl-full rounded-bl-full"
							style={{ width: "25%" }}
						/>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
						{Object.entries(progressStats).map(([category, { completed, total }]) => (
							<div key={category} className="bg-blue-800/15 p-2 rounded">
								<p className="text-sm font-bold text-blue-200">{category}</p>
								<p className="text-sm font-extrabold">{`${completed}/${total}`}</p>
							</div>
						))}
					</div>
				</div>

				{/* Achievements Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredAchievements.map((achievement) => (
						<motion.div
							key={achievement.id}
							className={`bg-[#1A2A44] cursor-pointer bg-opacity-20 backdrop-blur-md rounded-lg p-4 text-white flex gap-4 ${
								achievement.completed && "border border-green-500/45"
							}`}
							variants={cardVariants}
							initial="initial"
							whileHover="hover"
						>
							<div
								className={`w-12 h-12 bg-blue-500/20 rounded-[10px] flex items-center justify-center ${
									achievement.completed && "bg-green-500/25"
								}`}
							>
								<div className="text-2xl">{achievement.icon}</div>
							</div>

							{/* Achievement Details */}
							<div className="flex-1">
								<div className="flex justify-between mb-1">
									<div>
										<h4 className="text-base text-white font-extrabold">
											{achievement.title}
										</h4>
										<p className="text-sm font-bold text-blue-200">
											{achievement.description}
										</p>
									</div>
									{achievement.completed ? (
										<p className="flex items-center gap-1 text-[11px] font-bold text-blue-100 bg-green-500/25 h-max p-[6px] rounded-[10px]">
											<Award size={12} className=" mt-[-1px]"/> Completed
										</p>
									) : (
										<p className="text-[11px] flex gap-1 text-blue-100 font-bold bg-blue-500/20  h-max p-[6px] rounded-[10px]">
											+{achievement.xp} <span className=" hidden sm:flex">XP</span>
										</p>
									)}
								</div>

								{achievement.completed ? (
									<p className="text-xs text-blue-300 my-2">
										Completed on {achievement.completedDate}
									</p>
								) : (
									<div className="flex flex-col gap-0 mt-2">
										<div className="text-blue-300 font-medium flex items-center justify-between">
											<p className="text-xs">Progress</p>
											<p className="text-xs">
												{achievement.progress.completed}/
												{achievement.progress.total}
											</p>
										</div>
										<div className="w-full bg-blue-900/50  rounded-full  mt-1 mb-2">
											<div
												className="bg-indigo-400 h-2 rounded-tl-full rounded-bl-full"
												style={{
													width: `${
														(achievement.progress.completed /
															achievement.progress.total) *
														100
													}%`,
												}}
											/>
										</div>
									</div>
								)}

								<div className="flex items-center gap-1">
									<Gift size={10} className="text-yellow-400" />
									<p className="text-[10px] text-gray-200 font-bold mt-[.5px]">
										Reward: {achievement.rewards}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</section>
		</main>
	);
};
