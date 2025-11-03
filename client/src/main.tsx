import { init } from '@dojoengine/sdk';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
// ModelNameInteface is exported from ./models.generated.ts
// This file contains mapping of your cairo contracts to torii client
import { DojoSdkProvider } from '@dojoengine/sdk/react';
import { dojoConfig } from '../dojoConfig';
import { setupWorld } from './typescript/contracts.gen.ts';
import { SchemaType } from './typescript/models.gen';
import { ErrorBoundary } from './components';

// Component to display when DojoProvider fails
function DojoErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#0a0e27',
        color: '#fff',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Error al inicializar Dojo SDK
      </h1>
      <p style={{ marginBottom: '1rem', color: '#ff6b6b' }}>
        {error.message || 'Error desconocido'}
      </p>
      <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
        Por favor, verifica la configuración del manifest y las conexiones a
        Torii.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={resetError}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4a90e2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Intentar de nuevo
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Recargar página
        </button>
      </div>
    </div>
  );
}

// Wrapper component with error boundary for DojoProvider
function DojoProviderWrapper({
  sdk,
  children,
}: {
  sdk: Awaited<ReturnType<typeof init>>;
  children: React.ReactNode;
}) {
  // Verify manifest has required structure
  if (!dojoConfig.manifest) {
    console.error('Manifest is missing');
    return (
      <DojoErrorFallback
        error={new Error('Manifest configuration is missing')}
        resetError={() => window.location.reload()}
      />
    );
  }

  if (!dojoConfig.manifest.world) {
    console.error('World configuration is missing from manifest');
    return (
      <DojoErrorFallback
        error={new Error('World configuration is missing from manifest')}
        resetError={() => window.location.reload()}
      />
    );
  }

  if (
    !dojoConfig.manifest.contracts ||
    !Array.isArray(dojoConfig.manifest.contracts)
  ) {
    console.error('Contracts configuration is missing or invalid');
    return (
      <DojoErrorFallback
        error={
          new Error('Contracts configuration is missing or invalid in manifest')
        }
        resetError={() => window.location.reload()}
      />
    );
  }

  // Check if ABIs are available
  const hasAbis =
    dojoConfig.manifest.abis &&
    Array.isArray(dojoConfig.manifest.abis) &&
    dojoConfig.manifest.abis.length > 0;
  if (!hasAbis) {
    console.warn(
      'ABIs not found in manifest. DojoProvider may fail to initialize contracts.'
    );
  }

  return (
    <ErrorBoundary fallback={DojoErrorFallback}>
      <DojoSdkProvider sdk={sdk} dojoConfig={dojoConfig} clientFn={setupWorld}>
        {children}
      </DojoSdkProvider>
    </ErrorBoundary>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0e27',
        color: '#fff',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '4px solid #333',
            borderTopColor: '#4a90e2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p>Inicializando Dojo SDK...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

async function main() {
  console.log('Initializing Dojo SDK with config:', dojoConfig);
  console.log('Manifest structure:', {
    hasWorld: !!dojoConfig.manifest.world,
    hasContracts: !!dojoConfig.manifest.contracts,
    contractsCount: dojoConfig.manifest.contracts?.length || 0,
    hasAbis: !!dojoConfig.manifest.abis,
    abisCount: dojoConfig.manifest.abis?.length || 0,
  });

  try {
    const sdk = await init<SchemaType>({
      client: {
        toriiUrl: dojoConfig.toriiUrl || 'http://localhost:8080',
        relayUrl: dojoConfig.relayUrl,
        worldAddress: dojoConfig.manifest.world.address,
      },
      // Those values are used
      domain: {
        name: 'AquaStark',
        revision: '1.0',
        chainId: 'SN_SEPOLIA',
        version: '1',
      },
    });

    console.log('Dojo SDK initialized successfully:', sdk);
    console.log('setupWorld function:', setupWorld);
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <Suspense fallback={<LoadingFallback />}>
          <DojoProviderWrapper sdk={sdk}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </DojoProviderWrapper>
        </Suspense>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize Dojo SDK:', error);
    // Render error UI instead of throwing
    const errorInstance =
      error instanceof Error ? error : new Error('Unknown error');
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <DojoErrorFallback
        error={errorInstance}
        resetError={() => window.location.reload()}
      />
    );
  }
}

main();
