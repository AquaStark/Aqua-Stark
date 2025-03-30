import {
  Award,
  CircleCheckBig,
  Clock,
  Coins,
  Droplet,
  Gift,
  Info,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoginReward {
  id: number;
  day: number;
  qty: number;
  type: string;
  collected: boolean;
  special: boolean;
  current_day: boolean;
}

const formatTypeToName = (str: string) => {
  return str
    .split("_")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

export function LoginRewards({ data }: { data: LoginReward[] }) {
  const [timeUntilReset, setTimeUntilReset] = useState("");

  useEffect(() => {
    const updateResetTime = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateResetTime();
    const interval = setInterval(updateResetTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-full">
      <div className="flex items-center justify-between w-full my-4">
        <h2 className="font-sans text-xl font-bold text-white">
          Daily Login Rewards
        </h2>
        <p className="flex items-center justify-between gap-1 p-1 font-sans text-xs font-light text-white bg-blue-600 rounded-md">
          <Clock size={10} />
          <span>Next Reset: {timeUntilReset}</span>
        </p>
      </div>

      <div className="flex flex-col justify-between gap-1 px-3 pt-6 pb-4 bg-blue-700 rounded-lg md:items-center md:flex-row">
        <div>
          <h2 className="font-sans text-xl font-bold text-white">
            Current Login Streak
          </h2>
          <p className="font-sans font-light text-blue-100">
            Log in daily to earn increasingly valueable rewards!
          </p>
        </div>

        <div className="flex items-center gap-6">
          <h2 className="flex-1 font-sans text-2xl font-bold text-center text-white md:flex-none">
            {data.filter((reward) => reward.collected).length + 1}
            <span className="block mt-1 font-sans text-sm font-light text-blue-100">
              Days
            </span>
          </h2>

          <div className="flex-1 p-2 bg-blue-600 rounded-md md:flex-none ">
            <span className="font-sans text-sm font-light text-blue-100">
              Next Reward
            </span>
            <p className="font-bold text-white">
              <Coins className="inline-block mr-2 text-yellow-400" size={20} />
              {data.filter((reward) => !reward.collected)[1].qty}
              <span className="ml-1 font-sans text-sm font-light text-blue-100">
                {formatTypeToName(
                  data.filter((reward) => !reward.collected)[1].type
                )}
              </span>
            </p>
          </div>

          <Button className="flex-1 px-3 py-2 font-bold text-white bg-green-500 border-2 border-green-400 rounded-lg md:flex-none hover:bg-green-600">
            Claim Reward
          </Button>
        </div>
      </div>

      <div className="px-3 py-4 my-4 rounded-lg bg-blue-800/50 backdrop-blur-sm">
        <h2 className="font-sans font-bold text-white text-normal">
          Reward Calendar
        </h2>

        <div className="grid w-full grid-cols-3 gap-4 py-2 mt-4 mb-2 border-t md:grid-cols-7 border-t-blue-500">
          {data.map((loginReward) => (
            <CalendarDay key={loginReward.id} reward={loginReward} />
          ))}
        </div>

        <p className="flex items-center font-sans text-sm text-blue-200">
          <Info className="mr-2" size={14} />
          Missing a day will reset your login streak. Special rewards are earned
          every 7 days!
        </p>
      </div>
    </div>
  );
}

function CalendarDay({ reward }: { reward: LoginReward }) {
  const getIcon = (type: string, current: boolean, special: boolean) => {
    if (special) {
      return (
        <div
          className={`flex items-center p-3 ${
            !current ? "bg-yellow-800/60" : ""
          } rounded-full`}
        >
          <Award className="text-yellow-300" size={14} />
        </div>
      );
    }

    switch (type) {
      case "xp_boost":
        return (
          <div
            className={`flex items-center p-3 ${
              !current ? "bg-blue-700" : ""
            } rounded-full`}
          >
            <Zap className="text-purple-400" size={14} />
          </div>
        );
      case "food":
        return (
          <div
            className={`flex items-center p-3 ${
              !current ? "bg-blue-700" : ""
            } rounded-full`}
          >
            <Droplet className="text-blue-300" size={14} />
          </div>
        );
      case "decoration":
        return (
          <div
            className={`flex items-center p-3 ${
              !current ? "bg-blue-700" : ""
            } rounded-full`}
          >
            <Gift className="text-pink-300" size={14} />
          </div>
        );
      default:
        return (
          <div
            className={`flex items-center p-3 ${
              !current ? "bg-blue-700" : ""
            } rounded-full`}
          >
            <Coins className="text-yellow-300" size={14} />
          </div>
        );
    }
  };
  return (
    <div
      className={cn(
        "relative py-4 flex-1 px-4 gap-3 text-sm font-normal rounded-lg transition-all duration-200 flex flex-col items-center justify-center",
        reward.collected
          ? "bg-blue-800 font-sans text-sm font-light text-blue-600"
          : reward.current_day
          ? "bg-blue-500/40 border border-blue-300 text-blue-200"
          : reward.special
          ? "bg-blue-800/40 text-blue-200 border border-yellow-400"
          : "bg-blue-800/40 text-blue-200"
      )}
    >
      {reward.special && (
        <p className="absolute top-0 w-full text-xs font-bold text-center bg-yellow-600 rounded-t">
          SPECIAL
        </p>
      )}
      <p className={reward.special ? "pt-0.5" : ""}>Day {reward.day}</p>
      {reward.collected ? (
        <CircleCheckBig className="text-green-300 " />
      ) : (
        getIcon(reward.type, reward.current_day, reward.special)
      )}

      <span
        className={`font-extrabold ${reward.collected ? "" : "text-blue-100"}`}
      >
        {reward.qty}
      </span>
      <span className="-mt-3 font-sans text-xs font-extralight">
        {formatTypeToName(reward.type)}
      </span>
    </div>
  );
}
