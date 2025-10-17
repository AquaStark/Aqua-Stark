# Certificados SSL para Desarrollo Local

Este directorio contiene certificados SSL autofirmados para desarrollo local.

## ⚠️ Solo para Desarrollo

**IMPORTANTE:** Estos certificados son SOLO para desarrollo local. Nunca uses certificados autofirmados en producción.

## 📁 Archivos

- `cert.pem` - Certificado SSL público
- `key.pem` - Clave privada SSL

## 🔒 Aceptar Certificado en el Navegador

Al acceder a `https://localhost:5173`, verás una advertencia de seguridad. Esto es normal para certificados autofirmados.

### Chrome/Edge
1. Haz clic en "Avanzado" o "Advanced"
2. Haz clic en "Continuar a localhost (no seguro)" o "Proceed to localhost (unsafe)"

### Firefox
1. Haz clic en "Avanzado" o "Advanced"
2. Haz clic en "Aceptar el riesgo y continuar" o "Accept the Risk and Continue"

### Safari
1. Haz clic en "Mostrar detalles" o "Show Details"
2. Haz clic en "visitar este sitio web" o "visit this website"

## 🔄 Regenerar Certificados

Si necesitas regenerar los certificados:

```bash
# Eliminar certificados existentes
rm .cert/*.pem

# Generar nuevos certificados
openssl req -x509 -newkey rsa:4096 -keyout .cert/key.pem -out .cert/cert.pem -days 365 -nodes -subj "/CN=localhost/O=AquaStark Development/C=US"
```

## 📝 Notas

- Los certificados son válidos por 365 días
- Configurados para `localhost` únicamente
- Excluidos de Git mediante `.gitignore`
- Requeridos para WebAuthn (usado por Cartridge Connector)

## 🚀 ¿Por qué HTTPS?

WebAuthn (usado por Cartridge para autenticación) **requiere HTTPS** para funcionar. Esto soluciona el error:

```
WebAuthn is not supported on sites with TLS certificate errors
```


