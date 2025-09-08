'use client';

interface CartridgeHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseAlternative: () => void;
}

export function CartridgeHelpModal({
  isOpen,
  onClose,
  onUseAlternative,
}: CartridgeHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={onClose}
      onKeyDown={e => e.key === 'Escape' && onClose()}
      role='dialog'
      aria-modal='true'
    >
      <div
        className='bg-[#1C1D1F] rounded-lg p-6 w-full max-w-md mx-4'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-white text-xl font-bold flex items-center gap-2'>
            🎮 Cartridge Requiere Cuenta
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white'
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        <div className='space-y-4'>
          <div className='bg-blue-900/20 p-4 rounded-lg border border-blue-500/30'>
            <h3 className='text-blue-300 font-semibold mb-2'>
              ¿Qué es Cartridge?
            </h3>
            <p className='text-gray-300 text-sm'>
              Cartridge es una plataforma gaming que permite transacciones
              automáticas sin gas y session keys para una mejor experiencia de
              juego.
            </p>
          </div>

          <div className='bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30'>
            <h3 className='text-yellow-300 font-semibold mb-2'>
              Opciones Disponibles:
            </h3>
            <div className='space-y-2 text-sm text-gray-300'>
              <div className='flex items-start gap-2'>
                <span className='text-green-400'>✅</span>
                <div>
                  <strong>Crear cuenta Cartridge:</strong> Ideal para gaming,
                  transacciones automáticas
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <span className='text-blue-400'>✅</span>
                <div>
                  <strong>Usar Braavos/Argent:</strong> Funciona perfectamente,
                  requiere aprobación manual
                </div>
              </div>
            </div>
          </div>

          <div className='bg-purple-900/20 p-4 rounded-lg border border-purple-500/30'>
            <h3 className='text-purple-300 font-semibold mb-2'>
              Ventajas de Cartridge:
            </h3>
            <ul className='text-sm text-gray-300 space-y-1'>
              <li>• 🚀 Transacciones automáticas sin gas</li>
              <li>• 🎮 Session keys para gaming fluido</li>
              <li>• 🔐 Autenticación Passkey más segura</li>
              <li>• ⚡ Mejor performance en juegos</li>
            </ul>
          </div>
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onUseAlternative();
              onClose();
            }}
            className='flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors'
          >
            Usar Otra Wallet
          </button>
        </div>

        <div className='mt-4 text-center'>
          <a
            href='https://cartridge.gg'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-400 hover:text-blue-300 text-sm underline'
          >
            ¿Quieres crear cuenta Cartridge? Visita cartridge.gg
          </a>
        </div>
      </div>
    </div>
  );
}
