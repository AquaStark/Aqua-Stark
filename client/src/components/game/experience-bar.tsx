import { useExperience } from '@/hooks/use-experience';

interface ExperienceBarProps {
  currentLevel: number;
  currentExperience: number;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({
  currentLevel,
  currentExperience,
}) => {
  const { level, experience, requiredXP, progress, isLevelingUp } =
    useExperience(currentLevel, currentExperience);

  return (
    <div className='absolute z-50 left-1/2 top-1/2 gap-2 translate-x-[-50%] md:gap-0 flex flex-col md:flex-row items-center justify-between w-full max-w-lg'>
      <div className='flex items-center justify-center md:mr-4 gap-2 w-20 bg-blue-800/50 px-3 py-1 rounded-lg'>
        <span className='text-white font-bold'>lvl {level}</span>
      </div>

      <div className='relative w-[70%] md:flex-1 md:mx-0 h-5 md:h-6'>
        <div className='absolute inset-0 overflow-hidden h-full border-2 rounded-full bg-blue-950/70 border-blue-800/50'>
          <div className='absolute inset-0 w-full h-full border-t-2 rounded-full border-white/10'></div>

          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 overflow-hidden ${isLevelingUp ? 'animate-pulse' : ''}`}
            style={{ width: `${progress}%` }}
          >
            <div className={'absolute inset-0 bg-gradient-to-r bg-purple-500'}>
              <div className='absolute top-0 left-0 right-0 h-1/3 bg-white/30'></div>

              <div className='absolute inset-0 overflow-hidden'>
                <div
                  className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%)]'
                  style={{
                    backgroundSize: '20px 20px',
                    animation: 'move-stripes 2s linear infinite',
                  }}
                ></div>
              </div>
            </div>
          </div>

          {isLevelingUp && (
            <div className='absolute z-40 h-full left-1/2 flex items-center justify-center translate-x-[-50%]'>
              <p className='text-[12px] font-bold text-white'>LEVEL UP! 🎉</p>
            </div>
          )}
        </div>
      </div>

      <div className='text-sm font-bold text-white text-center w-max md:w-[120px]'>
        {experience} / {requiredXP} XP
      </div>

      {/* <button className='hidde' onClick={() => gainXP(50)}>
        gain
      </button> */}
    </div>
  );
};

export default ExperienceBar;
