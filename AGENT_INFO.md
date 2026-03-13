# LGM - Web Estática (Alquiler de Vestidos)

Este proyecto es una web estática (sin backend) para el negocio **LGM**.

## Ubicación
- Carpeta: `Vestidos/`

## Estructura
- `index.html`: página principal
- `css/styles.css`: estilos (incluye soporte de tema claro/oscuro)
- `js/main.js`: interacción (menú móvil, modal, galería, tema)
- `Images/`: imágenes de los vestidos

## Imágenes y Catálogo
- Vestido Blanco (mismo vestido, 2 fotos):
  - `Images/1773264982359.png`
  - `Images/1773264994149.png`
- Vestido Rojo:
  - `Images/1773265172687.png`
- Vestido Rosa:
  - `Images/1773266217023.png`
- Vestido Azul:
  - `Images/1773266283324.png`

## Precios (por día)
- Vestido Blanco Elegante: **2500 CUP / día**
- Vestido Rojo Fiesta: **2400 CUP / día**
- Vestido Rosa Noche: **2600 CUP / día**
- Vestido Azul Casual: **3000 CUP / día**

## Contacto
- WhatsApp: **+53 56164805**
- Link WhatsApp: `https://wa.me/5356164805`
- Dirección: **Baracoa, Bohorque Calle 9**

## Funcionalidades JS
- Menú responsive (hamburger) en móvil.
- Modal para ampliar imágenes.
- Galería del vestido blanco:
  - Miniaturas cambian la imagen del card.
  - Click en la imagen abre modal con navegación (anterior/siguiente) y teclas (←/→).
- Botones de catálogo hacen scroll al contacto y pre-rellenan el textarea con el vestido elegido.
- Modo claro/oscuro:
  - Se guarda en `localStorage` con la key `lgm-theme`.
  - Tema claro usa `html[data-theme='light']`.

## Cómo ejecutar
- Puedes abrir `index.html` directamente en el navegador.
- Recomendado en VS Code: usar extensión **Live Server** para previsualizar con recarga automática.
