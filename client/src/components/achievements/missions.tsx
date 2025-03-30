import { useState, useEffect } from "react";
import { mockMissions } from "@/lib/constants/mock-data/mock-achievements";
import {
	Clock4,
	Calendar,
	Sparkles,
	Coins,
	Zap,
	Gift,
} from "lucide-react";




export const Missions = () => {
	// State for daily reset timer
	const [timeLeft, setTimeLeft] = useState<number>(() => {
		const randomSeconds = Math.floor(Math.random() * (24 * 60 * 60 - 60) + 60);
		return randomSeconds;
	});

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					return Math.floor(Math.random() * (24 * 60 * 60 - 60) + 60);
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	return (
		<main className="min-h-screen mt-4">
			<section className="text-white">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold text-white">Active Missions</h2>
					<div className="flex items-center gap-1 bg-[#1A2A44] bg-opacity-10 backdrop-blur-md p-1 px-2 rounded-md">
						<Clock4 size={12} className="text-white" />
						<p className="text-xs font-bold">Daily Reset: {formatTime(timeLeft)}</p>
					</div>
				</div>

				{/* Daily Missions */}
				<div className="bg-[#1A2A44] bg-opacity-15 backdrop-blur-md rounded-lg mb-8 border-[0.5px] border-blue-600">
					<div className="flex justify-between items-center px-4 py-3">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Calendar size={18} className="text-blue-300 font-bold" />
							<p className="font-extrabold text-sm">Daily Missions</p>
						</h3>
						<p className="text-sm text-blue-200 font-bold">{`${
							mockMissions.daily.filter((m) => m.completed).length
						}/${mockMissions.daily.length} Completed`}</p>
					</div>
					{mockMissions.daily.map((mission) => (
						<div
							key={mission.id}
							className="flex gap-2 cursor-pointer last:mb-0 px-4 py-4 hover:bg-blue-200/5 border-t-[0.5px] last:border-b-0 border-b-[0.5px] border-blue-600/60"
						>
							<div
								className={`${
									mission.completed && "bg-green-500/25"
								} flex mt-1 bg-blue-500/20 justify-center items-center rounded-md w-[30px] h-[30px]`}
							>
								{mission.icon}
							</div>

							<div className="flex justify-between items-center w-full">
								<div>
									<h4 className="text-[15.5px] font-bold">{mission.title}</h4>
									<p className="text-[13px] text-blue-200 font-bold">
										{mission.description}
									</p>
									{!mission.completed && (
										<>
											<p className="text-xs text-blue-300 mt-1 font-semibold">
												Progress: {mission.progress}/{mission.total}
											</p>
											<div className="w-full bg-gray-700 rounded-full h-2 mt-1">
												<div
													className="bg-blue-500 h-2 rounded-tl-full rounded-bl-full"
													style={{
														width: `${
															(mission.progress / mission.total) * 100
														}%`,
													}}
												/>
											</div>
										</>
									)}
									<p className="text-xs gap-1 flex items-center text-blue-300 font-semibold mt-1">
										<Clock4 size={10} /> {mission.reset}
									</p>
								</div>
								<div className="text-right">
									<div className="flex items-center w-max gap-1 justify-center bg-[#1a2a4400] bg-opacity-0 backdrop-blur-md py-1 px-2 rounded-md">
										<p className="text-sm font-semibold">
											{mission.reward.type === "Coins" ? (
												<Coins size={13} className="text-yellow-400" />
											) : mission.reward.type === "XP" ? (
												<Zap size={13} />
											) : (
												"🎁"
											)}{" "}
										</p>
										<p className="text-[15px] font-extrabold">
											{mission.reward.amount}
										</p>
										<p className="text-xs text-blue-200 font-bold">
											{mission.reward.type}
										</p>
									</div>
									<button
										className={`mt-2 px-2 py-2 rounded-md text-xs font-bold ${
											mission.completed
												? "bg-green-500/25 opacity-80 text-white hover:cursor-default"
												: "bg-white text-gray-200 hover:text-gray-600"
										}`}
									>
										{mission.completed ? "Claimed" : "Go to Task"}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Weekly Missions */}
				<div className="bg-[#1A2A44] bg-opacity-15 backdrop-blur-md rounded-lg mb-8 border-[0.5px] border-blue-600">
					<div className="flex justify-between items-center px-4 py-3">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Calendar size={18} className="text-purple-200 font-bold" />
							<p className="font-extrabold text-sm">Weekly Missions</p>
						</h3>
						<p className="text-sm text-blue-200 font-bold">{`${
							mockMissions.weekly.filter((m) => m.completed).length
						}/${mockMissions.weekly.length} Completed`}</p>
					</div>
					{mockMissions.weekly.map((mission) => (
						<div
							key={mission.id}
							className="flex gap-2 cursor-pointer last:mb-0 px-4 py-4 hover:bg-purple-200/5 border-t-[0.5px] last:border-b-0 border-b-[0.5px] border-blue-600/60"
						>
							<div
								className={`${
									mission.completed && "bg-green-500/25"
								} flex mt-1 bg-purple-500/20 justify-center items-center rounded-md w-[30px] h-[30px]`}
							>
								{mission.icon}
							</div>

							<div className="flex justify-between items-center w-full">
								<div>
									<h4 className="text-[15.5px] font-bold">{mission.title}</h4>
									<p className="text-[13px] text-blue-200 font-bold">
										{mission.description}
									</p>
									{!mission.completed && (
										<>
											<p className="text-xs text-blue-300 mt-1 font-semibold">
												Progress: {mission.progress}/{mission.total}
											</p>
											<div className="w-full bg-gray-700 rounded-full h-2 mt-1">
												<div
													className="bg-purple-500 h-2 rounded-tl-full rounded-bl-full"
													style={{
														width: `${
															(mission.progress / mission.total) * 100
														}%`,
													}}
												/>
											</div>
										</>
									)}
									<p className="text-xs gap-1 flex items-center text-blue-300 font-semibold mt-1">
										<Clock4 size={10} /> {mission.reset}
									</p>
								</div>
								<div className="text-right">
									<div className="flex items-center w-max gap-1 justify-center bg-purple-500/40 py-1 px-2 rounded-md">
										<p className="text-sm font-semibold">
											{mission.reward.type === "Coins" ? (
												<Coins size={13} className="text-yellow-400" />
											) : mission.reward.type === "Premium Food" ? (
												<Gift size={13} className="text-purple-400" />
											) : (
												"🎁"
											)}{" "}
										</p>
										<p className="text-[15px] font-extrabold">
											{mission.reward.amount || mission.reward.type}
										</p>
										<p className="text-xs text-purple-200 font-bold">
											{mission.reward.type}
										</p>
									</div>
									<button
										className={`mt-2 px-2 py-2 rounded-md text-xs font-bold ${
											mission.completed
												? "bg-green-500/25 opacity-80 text-white hover:cursor-default"
												: "bg-white text-gray-200 hover:text-gray-600"
										}`}
									>
										{mission.completed ? "Claimed" : "Go to Task"}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Special Event Missions */}
				<div className="bg-[#1A2A44] bg-opacity-15 backdrop-blur-md rounded-lg border-[0.5px] border-blue-600">
					<div className="flex justify-between items-center px-4 py-3">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Sparkles size={18} className="text-yellow-300 font-bold" />
							<p className="font-extrabold text-sm">Special Event Missions</p>
						</h3>
						<p className="text-sm text-blue-200 font-bold">{`${
							mockMissions.specialEvent.filter((m) => m.completed).length
						}/${mockMissions.specialEvent.length} Completed`}</p>
					</div>
					{mockMissions.specialEvent.map((mission) => (
						<div
							key={mission.id}
							className="flex gap-2 cursor-pointer last:mb-0 px-4 py-4 hover:bg-yellow-200/5 border-t-[0.5px] last:border-b-0 border-b-[0.5px] border-blue-600/60"
						>
							<div
								className={`${
									mission.completed && "bg-green-500/25"
								} flex mt-1 bg-yellow-500/20 justify-center items-center rounded-md w-[30px] h-[30px]`}
							>
								{mission.icon}
							</div>

							<div className="flex justify-between items-center w-full">
								<div>
									<h4 className="text-[15.5px] font-bold">{mission.title}</h4>
									<p className="text-[13px] text-blue-200 font-bold">
										{mission.description}
									</p>
									{!mission.completed && (
										<>
											<p className="text-xs text-blue-300 mt-1 font-semibold">
												Progress: {mission.progress}/{mission.total}
											</p>
											<div className="w-full bg-gray-700 rounded-full h-2 mt-1">
												<div
													className="bg-yellow-500 h-2 rounded-tl-full rounded-bl-full"
													style={{
														width: `${
															(mission.progress / mission.total) * 100
														}%`,
													}}
												/>
											</div>
										</>
									)}
									<p className="text-xs gap-1 flex items-center text-blue-300 font-semibold mt-1">
										<Clock4 size={10} /> {mission.reset}
									</p>
								</div>
								<div className="text-right">
									<div className="flex items-center w-max gap-1 justify-center  bg-zinc-700 py-1 px-2 rounded-md">
										<Gift size={13} className=" text-green-300" />
										<p
											className="text-[15px] text-yellow-200 font-extrabold
                    "
										>
											{mission.reward.amount}
										</p>
										<p className="text-[12.5px] font-bold text-gray-300">
											{mission.reward.name}
										</p>
									</div>
									<button
										className={`mt-2 px-2 py-2 rounded-md text-xs font-bold ${
											mission.completed
												? "bg-green-500/25 opacity-80 text-white hover:cursor-default"
												: "bg-white text-gray-200 hover:text-gray-600"
										}`}
									>
										{mission.completed ? "Claimed" : "Go to Task"}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
};
