# Full Screen Implementation Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                        │
├─────────────────────────────────────────────────────────────┤
│  App.tsx                                                    │
│  ├── FullscreenModal (Auto-prompt)                         │
│  └── Routes                                                 │
│                                                             │
│  GameHeader.tsx                                             │
│  └── FullscreenButton (Manual control)                     │
│                                                             │
│  Hooks Layer:                                               │
│  ├── useFullscreen (Main API)                              │
│  ├── useFullscreenPrompt (Auto-prompt logic)               │
│  └── useFullscreenConfig (Backend integration)             │
│                                                             │
│  CSS Layer:                                                 │
│  ├── Full screen styles (:fullscreen, :-webkit-full-screen)│
│  ├── Mobile optimizations                                   │
│  └── Fixed positioning (100vh, 100vw)                      │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP API
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express)                       │
├─────────────────────────────────────────────────────────────┤
│  index.js                                                   │
│  ├── Full Screen Headers                                   │
│  │   ├── Permissions-Policy: fullscreen=(self)            │
│  │   ├── X-Frame-Options: SAMEORIGIN                      │
│  │   └── CSP disabled for fullscreen                      │
│  │                                                         │
│  └── API Endpoints                                         │
│      └── GET /api/v1/fullscreen-config                     │
│          └── Returns configuration object                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 User Flow

```
App Load
    │
    ▼
2s Delay
    │
    ▼
Check Preferences
    │
    ├── Already Prompted? ──► Skip
    ├── Declined < 24h? ────► Skip
    └── Show Modal
            │
            ├── User Accepts ──► Enter Fullscreen ──► Remember Choice
            └── User Declines ──► Remember Decline ──► Don't Show 24h
```

## 📱 Mobile vs Desktop Experience

### Mobile (Portrait/Landscape)
```
┌─────────────────────────┐
│  Full Screen Modal      │
│  ┌─────────────────────┐│
│  │ 📱 Pantalla Completa││
│  │                     ││
│  │ Para la mejor       ││
│  │ experiencia...      ││
│  │                     ││
│  │ [Ahora no] [Activar]││
│  └─────────────────────┘│
└─────────────────────────┘
```

### Desktop
```
┌─────────────────────────┐
│  Full Screen Modal      │
│  ┌─────────────────────┐│
│  │ 🖥️ Full Screen      ││
│  │                     ││
│  │ For the best        ││
│  │ gaming experience...││
│  │                     ││
│  │ [Not now] [Activate]││
│  └─────────────────────┘│
└─────────────────────────┘
```

## 🎯 Component Hierarchy

```
App
├── FullscreenModal (Auto-prompt)
│   ├── Mobile/Desktop Detection
│   ├── Accept/Decline Logic
│   └── LocalStorage Management
│
├── Routes
│   └── GamePage
│       └── GameHeader
│           └── FullscreenButton (Manual)
│               └── FullscreenModal (On-demand)
│
└── Settings
    └── Reset Button
        └── Clear LocalStorage
```

## 🔧 Technical Details

### Browser API Support
```javascript
// Cross-browser fullscreen detection
const isSupported = !!(
  document.fullscreenEnabled ||
  document.webkitFullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.msFullscreenEnabled
);

// Cross-browser fullscreen request
if (element.requestFullscreen) {
  await element.requestFullscreen();
} else if (element.webkitRequestFullscreen) {
  await element.webkitRequestFullscreen();
} else if (element.mozRequestFullScreen) {
  await element.mozRequestFullScreen();
} else if (element.msRequestFullscreen) {
  await element.msRequestFullscreen();
}
```

### LocalStorage Keys
```javascript
const FULLSCREEN_PROMPT_KEY = 'aqua-stark-fullscreen-prompted';
const FULLSCREEN_DECLINED_KEY = 'aqua-stark-fullscreen-declined';
```

### CSS Full Screen Selectors
```css
:fullscreen { background-color: #005C99; }
:-webkit-full-screen { background-color: #005C99; }
:-moz-full-screen { background-color: #005C99; }
:-ms-fullscreen { background-color: #005C99; }
```

## 🚀 Performance Optimizations

1. **Lazy Loading**: Components only load when needed
2. **Event Cleanup**: Proper removal of event listeners
3. **Debounced Checks**: Orientation changes are debounced
4. **Memory Efficient**: Minimal memory footprint
5. **Fast Response**: 2-second delay prevents jarring UX

## 🔒 Security Considerations

1. **Permissions Policy**: Properly configured for full screen
2. **CSP Compatibility**: Disabled restrictions that block full screen
3. **XSS Protection**: All inputs properly sanitized
4. **Local Storage**: Secure preference storage with expiration
5. **CORS Configuration**: Properly configured for full screen access
