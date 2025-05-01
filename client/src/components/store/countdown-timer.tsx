import { useEffect, useState } from "react";

type CountdownTimerProps = {
  countdown: string; // Now we expect "HH:MM:SS"
};

export const CountdownTimer = ({ countdown }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(parseCountdownString(countdown));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full text-sm font-medium">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {formatTimeLeft(timeLeft)}
    </div>
  );
};

// Parse "HH:MM:SS" into milliseconds
function parseCountdownString(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

// Format milliseconds into "HH:MM:SS"
function formatTimeLeft(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
