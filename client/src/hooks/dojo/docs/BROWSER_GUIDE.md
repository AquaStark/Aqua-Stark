# 🌐 Guía de Navegadores para Testing de Hooks

## 🎯 Navegador Recomendado para Testing

### Safari (macOS) ⭐

**Mejor opción para desarrollo en Mac**

✅ **Ventajas:**

- WebAuthn funciona perfectamente
- No requiere configuración adicional
- Cartridge Connector funciona sin problemas
- Mejor integración con macOS

**Usar Safari para:**

- Testing de todos los hooks con Cartridge
- Demo pages (`/demo`, `/enhanced-demo`)
- Cualquier funcionalidad que use WebAuthn

---

### Chrome (Windows/Linux) ⭐

**Mejor opción para desarrollo en Windows/Linux**

✅ **Ventajas:**

- WebAuthn completamente soportado
- DevTools excelentes
- Cartridge Connector funciona perfectamente

---

## ⚠️ Brave Browser - Problema Conocido

Brave bloquea WebAuthn por sus configuraciones de privacidad estrictas.

### Síntomas en Brave:

```
❌ Error: Device error: Get assertion error
❌ WebAuthn is not supported on sites with TLS certificate errors
❌ Cartridge Connector no funciona
```

### Solución Rápida:

**Usa Safari o Chrome para development en lugar de Brave**

---

## 📱 Testing en Diferentes Navegadores

Para asegurar compatibilidad completa, prueba en:

1. **Safari** - Testing principal en macOS
2. **Chrome** - Testing secundario
3. **Móvil** - iOS Safari y Android Chrome

---

## 🔍 Quick Test

Para verificar que tu navegador está listo:

1. Abre `https://localhost:5173/demo`
2. Conecta tu wallet
3. Prueba "New Aquarium"
4. Si funciona → ✅ Navegador compatible
5. Si falla con error WebAuthn → ⚠️ Cambia de navegador

---

## 📋 Matriz de Compatibilidad

| Funcionalidad       | Safari | Chrome | Brave | Firefox |
| ------------------- | ------ | ------ | ----- | ------- |
| Hooks básicos       | ✅     | ✅     | ✅    | ✅      |
| Cartridge Connector | ✅     | ✅     | ⚠️    | ⚠️      |
| WebAuthn            | ✅     | ✅     | ⚠️    | ⚠️      |
| Demo pages          | ✅     | ✅     | ⚠️    | ⚠️      |
| Argent/Braavos      | ✅     | ✅     | ✅    | ✅      |

---

## 💡 Recomendación

**Para testing de hooks documentados:**

- Usa **Safari** (macOS) o **Chrome** (Windows/Linux)
- Evita Brave para testing de Cartridge
- Argent y Braavos funcionan en todos los navegadores

Ver [BROWSER_COMPATIBILITY.md](../../BROWSER_COMPATIBILITY.md) para más detalles.
