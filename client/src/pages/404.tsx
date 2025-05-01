import { BubblesBackground } from "@/components/bubble-background";
import BackToHomeButton from "@/components/ui/back-to-home-button";
import { useBubbles } from "@/hooks/use-bubbles";

export default function Error404Page() {
  const bubbles = useBubbles({ maxBubbles: 20 });

  return (
    <div className="h-screen relative text-white ">
      <div className="flex flex-col items-center justify-center font-404 h-screen bg-gradient-to-b from-blue-600 to-blue-900">
        <h1
          className="text-9xl lg:text-[180px] font-medium text-white drop-shadow-[0_0_1px_rgba(86,167,255,1)] leading-none"
          style={{
            textShadow: `
                    0 0 24px rgba(208,231,255,1),
                    0 0 40px rgba(59,130,246,0.8),
                    0 0 80px rgba(59,130,246,0.6),
                    0 0 120px rgba(59,130,246,0.5)
                    `,
          }}
        >
          404
        </h1>
        <h2 className="text-2xl drop-shadow-[0_0_4px_rgba(203,227,255,0.8)]">
          Page not found!
        </h2>
        <div className="bg-blue-900/10 backdrop-blur-md rounded-lg px-8 py-2 my-8 shadow-sm items-center justify-center text-center">
          <p>Oops! You swam too far from the reef.</p>
          <p>This page has sunk into the ocean.</p>
        </div>
        <BackToHomeButton />
      </div>

      <BubblesBackground bubbles={bubbles} />
      <img
        src="/background-decorations/wave-decoration.svg"
        className="fixed bottom-0 left-0 opacity-20 pointer-events-none"
      />
    </div>
  );
}
