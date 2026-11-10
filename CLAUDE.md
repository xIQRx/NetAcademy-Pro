# NetAcademy Pro

Portal educativo de Telecomunicaciones y Redes Cisco (CCNA / CCNP Enterprise). Sitio estático en español: HTML, un CSS y un JavaScript. Sin backend todavía.

## Estructura

```
index.html                  Principal: header de video, hero, progreso y temas
tcpip.html … seguridad.html Un archivo por tema (13)
laboratorios.html           Lista de prácticas (14) y terminal IOS
comandos.html               Referencia de comandos por tema (botón Copiar)
certificaciones.html        Banco de preguntas
buscar.html                 Buscador (lee ?q=)
css/styles.css              Único CSS
js/app.js                   Único JavaScript
```

## Regla principal: contenido en el HTML, comportamiento en el JS

Todo el texto de cada página vive en su propio `.html`. `js/app.js` solo contiene lógica: progreso y XP, modo oscuro, motor del terminal, filtros, copiar, preguntas, buscador, simuladores (subredes y SPF) y el header de video. Para editar un texto, cambia el HTML; no hay datos duplicados en el JS.

Cada página es: `<body data-page="…">`, `<aside id="side">` con el menú (ya escrito en cada HTML), barra superior (`#sf`, `#q`, `#theme`) y el contenido. Valores de `data-page`: `home`, el id de cada tema (`tcpip`, `switching`, `vlan`, `stp`, `routing`, `rip`, `eigrp`, `ospf`, `dhcp`, `acl`, `vpn`, `fhrp`, `sec`), `labs`, `cmds`, `cert`, `buscar`. El tema `sec` está en `seguridad.html`.

## Marcado que usa el JS

- Tema: botón `.done-btn[data-topic]`; enlace del menú `a.nav[data-id]` con `<span class="ck">`.
- Inicio: `#lvl`, `#p-t`, `#p-l`, `#p-q` (con `data-of` = total), `#ch1` (gráfica), `[data-n]` (contadores).
- Laboratorios: `#labs-list` con tarjetas a `laboratorios.html#lab-ID` y badge `[data-lab-badge]`. Cada práctica es un `<section class="lab-sec" data-lab="ID" data-host="R1" hidden>` con `li[data-re][data-sol]` por tarea, `pre[data-cmd]` por cada `show` y botones `.lab-hint`, `.lab-sol`, `.lab-reset`. El terminal (`#tm`, `#ti`, `#out`, `#pr`, `#fin`) es único y está en `#term-wrap`.
- Comandos: `.chip[data-s]`, `#cf`, `.cmd-sec[data-topic]` y `.cb` (con `.cp` y `pre`).
- Certificaciones: `.q[data-q][data-ok]` con botones `.opt[data-o]` y `.ex` oculto.
- Buscador: filas `tr[data-k]` y tarjetas `.sr-t[data-k]` (palabras clave en minúsculas).

## Agregar una práctica

Copia un `.lab-sec` en `laboratorios.html` y añade su tarjeta a `#labs-list`. Cada `li` lleva `data-re` (regex que se prueba contra el comando normalizado: minúsculas, espacios colapsados y abreviaturas de `norm()`; usa `^…$` y escapa los puntos de las IP) y `data-sol` (comandos de la solución, con saltos de línea como `&#10;`). Una tarea cuyo regex contiene `ping` no cuenta como requisito del propio ping. Las salidas de `show` son fijas.

## Estado

`localStorage`, siempre en `try/catch`: `na` guarda `{done, xp, ans, labs}` y `na-theme` guarda `light` o `dark`. XP: tema estudiado 20, respuesta correcta 10, práctica completada 50. Nivel = `1 + floor(XP / 100)`.

## Versión online de un solo archivo

`netacademy-pro-online.html` junta todas las páginas como secciones `.page[data-route]` con navegación por hash (`#tcpip`, `#labs`, `#lab-ospf`, `#cmds`, `#cert`, `#buscar`). No hay script de compilación: si cambias el HTML, el CSS o el JS, hay que regenerarla a mano.

## Diseño

Azul Cisco `#049FD9`, azul oscuro `#1B365D`, gris `#F4F6F8`, blanco `#FFFFFF`. IBM Plex Sans e IBM Plex Mono. Colores como variables en `:root` con valores oscuros bajo `prefers-color-scheme` y `[data-theme="dark"]`. Texto en español con comillas «así». Respeta `prefers-reduced-motion`.

## Pendiente

Backend Node.js + Express + PostgreSQL, simulaciones propias para EIGRP, VLAN/VTP, ACL y VPN, exámenes completos, troubleshooting, D3.js y que los `show` del laboratorio reflejen la configuración escrita.

## Pruebas

No hay suite. Abre `index.html` (requiere internet para Chart.js y las fuentes) y recorre cada página, una práctica completa, los filtros de comandos y el buscador.
