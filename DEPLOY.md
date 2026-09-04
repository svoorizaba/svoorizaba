# Cómo subir SVO — Páginas Web a Render

## ⚠️ Importante antes de empezar: cómo funciona el almacenamiento

Este proyecto guarda los planes, testimonios, portafolio y mensajes de contacto en archivos `.json` dentro de la carpeta `data/`. Eso es perfecto para probar el sitio, pero en Render (plan gratuito) **el sistema de archivos se reinicia cada vez que el servicio se reinicia o vuelves a desplegar**. Es decir:

- Los mensajes de contacto que lleguen y los cambios que hagas a los planes desde el panel de admin **se perderán** cuando Render reinicie el servicio (duerme tras 15 min de inactividad en el plan gratuito, y se reinicia).
- Esto es normal y aceptable para mostrar el sitio o hacer pruebas. Si más adelante quieres que los datos persistan de verdad, hay dos opciones simples:
  1. **Disco persistente de Render** (requiere plan de pago, "Starter" o superior) — ya dejé la configuración lista y comentada en `render.yaml`.
  2. Migrar `data/*.json` a una base de datos real (por ejemplo Postgres, que Render ofrece gratis por 90 días). Si llegas a ese punto, dime y te ayudo a hacer el cambio.

Para una landing informativa con formulario de contacto que revisas seguido, lo más simple es usar el plan gratuito y conectar el formulario a un correo o WhatsApp además de guardarlo en el JSON (ya tienes el botón de WhatsApp flotante para eso).

## Paso 1: Sube el proyecto a GitHub

Necesitas una cuenta de GitHub (gratis, en github.com si no tienes una).

1. Descomprime el archivo `svo-paginas-web.zip` que te compartí en tu computadora.
2. Entra a [github.com/new](https://github.com/new) y crea un repositorio nuevo (por ejemplo `svo-paginas-web`). Puedes dejarlo público o privado. **No** marques "Add a README" (ya tenemos uno).
3. En tu computadora, abre una terminal dentro de la carpeta del proyecto descomprimido y ejecuta:

   ```bash
   git init
   git add .
   git commit -m "Primer despliegue"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/svo-paginas-web.git
   git push -u origin main
   ```

   Reemplaza `TU-USUARIO` por tu nombre de usuario de GitHub. Si no tienes `git` instalado, descárgalo de [git-scm.com](https://git-scm.com/downloads).

## Paso 2: Crea el servicio en Render

1. Entra a [render.com](https://render.com) y crea una cuenta (puedes registrarte directamente con tu cuenta de GitHub, es lo más rápido).
2. En el Dashboard, haz clic en **New +** → **Web Service**.
3. Conecta tu cuenta de GitHub si te lo pide, y selecciona el repositorio `svo-paginas-web` que acabas de subir.
4. Render detectará que es un proyecto Node.js. Configura:
   - **Name:** `svo-paginas-web` (o el nombre que prefieras)
   - **Region:** la más cercana a tus clientes (Oregon u Ohio suelen tener buena latencia para México)
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Antes de crear el servicio, baja hasta **Environment Variables** y agrega:
   - `ADMIN_USER` → el usuario que quieras para el panel de admin
   - `ADMIN_PASS` → una contraseña segura (cámbiala, no dejes `orizaba2024`)
   - `SESSION_SECRET` → cualquier texto largo y aleatorio (por ejemplo, genera uno en [randomkeygen.com](https://randomkeygen.com/))
6. Haz clic en **Create Web Service**.

Render va a instalar dependencias y arrancar el servidor automáticamente. En unos 2-3 minutos verás el log terminar con algo como `SVO Páginas Web corriendo en http://localhost:10000` — eso significa que ya está listo.

## Paso 3: Verifica que todo funcione

Render te dará una URL parecida a `https://svo-paginas-web.onrender.com`.

- Abre esa URL: debe cargar la página principal.
- Abre `https://svo-paginas-web.onrender.com/admin/login` y entra con el `ADMIN_USER` y `ADMIN_PASS` que configuraste.
- Prueba el formulario de contacto y revisa que el mensaje aparezca en el panel de admin.

## Paso 4 (opcional): conecta tu propio dominio

Si tienes un dominio como `svopaginasweb.com`:

1. En Render, dentro de tu servicio, ve a **Settings → Custom Domains** y agrega tu dominio.
2. Render te dará un registro CNAME (o A) que debes agregar en el proveedor donde compraste tu dominio (GoDaddy, Namecheap, etc.).
3. Espera a que se propague (puede tardar desde minutos hasta un par de horas) y Render activará HTTPS automáticamente.

## Actualizar el sitio después de hacer cambios

Cada vez que quieras publicar un cambio (nuevo logo, textos, etc.), desde tu computadora:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Render detecta el nuevo commit y vuelve a desplegar automáticamente.

---

¿Quieres que te ayude a preparar el repositorio de GitHub paso a paso, o directamente a configurar el disco persistente / una base de datos para que los mensajes y planes no se pierdan?
