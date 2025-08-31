import { useExperience } from '@/hooks/use-experience';

const ExperienceBar: React.FC = () => {
  const { level, experience, requiredXP, progress, gainXP } = useExperience(
    1,
    0
  );

  const isBarFull = false;

  return (
    <>
      <div className='absolute z-50 left-1/2 top-1/2 translate-x-[-50%] gap-0 flex items-center justify-between w-full max-w-lg'>
        {/* Level Badge */}
        <div className='flex items-center justify-center mr-4 gap-2 w-20 bg-blue-800/50 px-3 py-1 rounded-lg'>
          <span className='text-white font-bold'>lvl {level}</span>
        </div>

        {/* Progress Bar */}
        <div className='relative flex-1 h-6'>
          <div className='absolute inset-0 overflow-hidden border-2 rounded-full bg-blue-950/70 border-blue-800/50'>
            <div className='absolute inset-0 w-full border-t-2 rounded-full border-white/10'></div>

            <div
              className={
                'absolute top-0 left-0 h-full rounded-full transition-all duration-500 overflow-hidden'
              }
              style={{ width: `${progress}%` }}
            >
              <div
                className={'absolute inset-0 bg-gradient-to-r bg-purple-500'}
              >
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

              {isBarFull && (
                <div className='absolute h-full left-1/2 flex items-center justify-center translate-x-[-50%]'>
                  <p className='text-[12px] font-bold text-white'>
                    {isBarFull ? 'LEVEL UP! 🎉' : progress}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* XP Text */}
        <div className='text-sm font-bold text-white text-center w-[120px]'>
          {experience} / {requiredXP} XP
        </div>

        <button className='hidde' onClick={() => gainXP(50)}>
          gain
        </button>
      </div>
    </>
  );
};

export default ExperienceBar;
