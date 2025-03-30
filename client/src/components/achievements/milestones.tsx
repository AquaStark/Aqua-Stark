import { cn } from "@/lib/utils";
import { CircleCheckBig, Gift, Trophy } from "lucide-react";
import { Button } from "../ui/button";

interface GameMileStone {
  id: number;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
  type: string;
  progress: number;
  total: number;
}

export function Milestones({ data }: { data: GameMileStone[] }) {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between w-full my-4">
        <h2 className="font-sans text-xl font-bold text-white">
          Game Milestones
        </h2>

        <p className="flex items-center justify-between gap-1 p-1 font-sans text-xs font-light text-white bg-blue-600 rounded-md">
          <Trophy className="text-yellow-300" size={10} />
          <span>{`${data.filter((gm) => gm.completed).length} / ${
            data.length
          } Completed`}</span>
        </p>
      </div>

      <div className="relative w-full max-w-full px-3 pt-6 pb-4 space-y-4 rounded-lg bg-blue-800/40 backdrop-blur-sm">
        {data.map((gm, i) => (
          <GameMileStone
            key={gm.id}
            lastItem={i === data.length - 1}
            milestone={gm}
          />
        ))}
      </div>
    </div>
  );
}

function GameMileStone({
  milestone,
  lastItem,
}: {
  milestone: GameMileStone;
  lastItem: boolean;
}) {
  return (
    <div className="relative pl-12">
      {milestone.completed ? (
        <div className="absolute z-20 flex items-center justify-center w-8 h-8 text-sm font-bold bg-[#03FF73] rounded-full left-1">
          <CircleCheckBig className="absolute z-20 text-green-50" size={16} />
        </div>
      ) : (
        <div className="absolute z-20 flex items-center justify-center w-8 h-8 text-sm font-bold text-blue-100 bg-blue-700 border-4 border-blue-300 rounded-full left-1">
          {milestone.id}
        </div>
      )}
      {/* Connect to the next achievement with a line if not the last one */}
      <div
        className={`absolute top-4 left-5 ${
          lastItem ? "h-[90%]" : "h-full"
        } w-0.5 bg-blue-500 z-10`}
      ></div>
      {/* )} */}
      <div
        className={cn(
          "relative w-full font-sans py-4 border-2 flex-1 px-4 gap-2 text-sm font-normal rounded-lg transition-all duration-200 flex items-center justify-between milestone-card bg-[#0251A6]",
          milestone.completed ? "border-green-400/50" : "border-blue-400"
        )}
      >
        <div className="flex flex-col w-full gap-2">
          <div className="flex items-center font-sans text-sm font-bold text-white max-h-fit">
            <p>{milestone.title}</p>
            {milestone.completed && (
              <span className="block py-0 px-1.5 ml-1 w-fit text-[8px] max-h-fit font-normal bg-[#006AA9] rounded-xl">
                Completed
              </span>
            )}
          </div>
          <p className="text-xs font-light text-blue-100">
            {milestone.description}
          </p>
          {!milestone.completed && (
            <div className="min-w-full">
              <p className="text-xs text-blue-200">Progress</p>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <div className="flex h-2 overflow-hidden text-xs bg-blue-800 rounded">
                      <div
                        style={{
                          width: `${
                            (milestone.progress / milestone.total) * 100
                          }%`,
                        }}
                        className="flex flex-col justify-center text-center text-white shadow-none bg-[#6B7AF6] whitespace-nowrap"
                      ></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2 text-sm text-blue-200">
                    {milestone.progress}/{milestone.total}
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="flex items-center text-xs text-blue-300">
            <Gift className="mr-1 text-yellow-300" size={10} />
            Reward: {milestone.description}
          </p>
          {milestone.completed ? (
            <Button className="cursor-not-allowed px-3 py-2 text-xs font-normal text-blue-200 hover:bg-[#006AA9] bg-[#006AA9] rounded-lg max-h-fit max-w-fit">
              Reward Claimed
            </Button>
          ) : (
            <Button className="px-3 py-2 text-xs font-normal text-blue-100 bg-white rounded-lg max-h-fit max-w-fit hover:text-black hover:bg-white">
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
