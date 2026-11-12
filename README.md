<!--suppress MarkdownUnresolvedFileReference -->

# Cyber Chess

[English](#english) · [Русский](#russian) · [עברית](#hebrew) · [Español](#spanish) · [Français](#french)

<a name="english"></a>

## English

Chess in the browser with a "glass and neon" look: play against a friend on one screen or against the Stockfish engine, with a match clock, captured pieces and a choice of piece when a pawn is promoted.

**Live demo:** https://dubnovalexey.github.io/Cosmo-Glass-Chess/

### Try it in a minute

Choose a two-player or AI game, make a move and try the clock pause and board flip. Restart creates a new match; promotion offers a piece choice when a pawn reaches the final rank.

### Features

- Player vs player or player vs AI; the AI level sets the Stockfish search depth.
- Play as White or Black, flip the board.
- A clock for each side with a configurable time, pause and restart.
- A promotion dialog (queen, rook, bishop, knight) and "graveyards" of captured pieces.
- Move, capture, check and end-of-game sounds.

### How it works

- `chess-logic.js` keeps the game state and talks to the engine; `chess-render.js` draws the board; `chess-timer.js` runs the clocks.
- Stockfish runs in a **Web Worker**, so engine calculation runs outside the UI thread. The worker gets the position as FEN and answers with the best move (UCI protocol).

### Tech stack

HTML5 · CSS3 (glassmorphism) · JavaScript · Web Workers · Stockfish (UCI) · `<dialog>` · GitHub Pages

### Third-party code

Stockfish is distributed under the GNU GPL v3 — see `assets/js/STOCKFISH-LICENSE.md` for the authors and links to the source code. Move rules come from [chess.js](https://github.com/jhlywa/chess.js) 0.10.3 (BSD-2-Clause), loaded from cdnjs.

### Run locally

The engine runs in a Web Worker, so open the page through a local web server (for example `npx serve .`), not as a file.

### Roadmap

These are proposed improvements; this standalone board remains independently playable.

- **Visual:** add keyboard board navigation, a clear thinking/paused status and readable controls on narrow screens.
- **Engineering:** add a bounded search timeout and recovery, and extend real-browser checks for engine and clock lifecycle.
- **Functionality:** add a move list, PGN export and undo with an explicit policy for cancelling the current AI search.

### Engine regression checks

`node --test tests/engine-races.test.cjs` checks delayed moves across restart, pause/resume, position changes and page disposal. BFCache restoration restarts the current AI turn once and rejects callbacks from the old worker. UCI searches are serialized; an obsolete engine answer cannot change a new match.

---

<a name="russian"></a>

## Русский

Шахматы в браузере в стиле «стекло и неон»: играйте с другом на одном экране или против движка Stockfish, с шахматными часами, «кладбищем» взятых фигур и выбором фигуры при превращении пешки.

**Демо:** https://dubnovalexey.github.io/Cosmo-Glass-Chess/

### Короткий сценарий просмотра

Выберите игру вдвоём или против ИИ, сделайте ход, попробуйте паузу часов и разворот доски. Перезапуск начинает новую партию; при достижении пешкой последней линии можно выбрать фигуру.

### Возможности

- Игрок против игрока или против ИИ; уровень ИИ задаёт глубину расчёта Stockfish.
- Игра за белых или за чёрных, разворот доски.
- Часы для каждой стороны с настраиваемым временем, пауза и перезапуск.
- Окно превращения пешки (ферзь, ладья, слон, конь) и взятые фигуры по краям доски.
- Звуки хода, взятия, шаха и конца партии.

### Как устроено

- `chess-logic.js` хранит состояние партии и общается с движком, `chess-render.js` рисует доску, `chess-timer.js` ведёт часы.
- Stockfish работает в **Web Worker**, поэтому расчёт движка выполняется вне основного потока интерфейса. Worker получает позицию в формате FEN и отвечает лучшим ходом (протокол UCI).

### Стек

HTML5 · CSS3 (glassmorphism) · JavaScript · Web Workers · Stockfish (UCI) · `<dialog>` · GitHub Pages

### Сторонний код

Stockfish распространяется по лицензии GNU GPL v3 — авторы и ссылки на исходники в `assets/js/STOCKFISH-LICENSE.md`. Правила ходов — библиотека [chess.js](https://github.com/jhlywa/chess.js) 0.10.3 (BSD-2-Clause), подключается с cdnjs.

### Как запустить

Движок работает в Web Worker, поэтому откройте страницу через локальный сервер (например, `npx serve .`), а не как файл.

### Планы

Это предложения по развитию; самостоятельная шахматная доска сохраняется рабочей отдельно.

- **Визуал:** добавить управление доской с клавиатуры, ясный статус размышления/паузы и читаемые элементы на узком экране.
- **Инженерия:** ограничить ожидание поиска timeout с восстановлением и расширить браузерные проверки жизненного цикла движка и часов.
- **Функции:** добавить список ходов, экспорт PGN и отмену хода с явной отменой текущего поиска ИИ.

### Проверки движка

`node --test tests/engine-races.test.cjs` проверяет отмену отложенного хода при перезапуске, паузе, изменении позиции и закрытии страницы. После возврата через BFCache текущий ход ИИ запускается один раз, ответы старого Worker игнорируются. UCI-поиски выполняются последовательно.

---

<a name="hebrew"></a>

<div dir="rtl">

## עברית

שחמט בדפדפן בסגנון "זכוכית וניאון": משחק מול חבר על אותו מסך או מול מנוע Stockfish, עם שעון שחמט, כלים שנלקחו ובחירת כלי בהכתרת רגלי.

**הדגמה:** https://dubnovalexey.github.io/Cosmo-Glass-Chess/

### הדגמה קצרה

בחרו משחק לשני שחקנים או מול AI, בצעו מסע ונסו את השהיית השעון והיפוך הלוח. התחלה מחדש יוצרת משחק חדש; כאשר רגלי מגיע לשורה האחרונה אפשר לבחור כלי.

### טכנולוגיות

HTML5 · CSS3 · JavaScript · Web Workers · Stockfish (UCI) · GitHub Pages

### קוד של צד שלישי

Stockfish מופץ ברישיון GNU GPL v3 — פרטים ב-`assets/js/STOCKFISH-LICENSE.md`.

### הרצה מקומית

המנוע רץ ב-Web Worker, לכן יש לפתוח את הדף דרך שרת מקומי (למשל `npx serve .`).

### תוכניות

אלה הצעות לפיתוח; לוח השחמט העצמאי ממשיך לפעול בנפרד.

- **עיצוב:** להוסיף ניווט בלוח באמצעות מקלדת, מצב חשיבה/השהיה ברור ופקדים קריאים במסכים צרים.
- **הנדסה:** להגביל את זמן ההמתנה לחיפוש עם התאוששות ולהרחיב בדיקות דפדפן למחזור החיים של המנוע והשעונים.
- **פונקציונליות:** להוסיף רשימת מסעים, ייצוא PGN וביטול מסע עם ביטול מפורש של חיפוש ה-AI הפעיל.

### בדיקות מנוע

`node --test tests/engine-races.test.cjs` בודק מסעים מאוחרים, התחלה מחדש, השהיה ושחזור BFCache בעזרת Worker מדומה; הוא אינו מחליף בדיקת Stockfish בדפדפן אמיתי.

</div>

---

<a name="spanish"></a>

## Español

Ajedrez en el navegador con estilo «cristal y neón»: juegue con un amigo en la misma pantalla o contra el motor Stockfish, con reloj de ajedrez, un «cementerio» de piezas capturadas y elección de pieza al coronar un peón.

**Demo:** https://dubnovalexey.github.io/Cosmo-Glass-Chess/

### Recorrido rápido

Elija jugar a dos o contra la IA, haga una jugada, pruebe la pausa del reloj y el giro del tablero. Reiniciar empieza una partida nueva; cuando un peón llega a la última fila, se puede elegir la pieza.

### Funciones

- Jugador contra jugador o contra la IA; el nivel de la IA fija la profundidad de cálculo de Stockfish.
- Juego con blancas o con negras, giro del tablero.
- Un reloj para cada bando con tiempo configurable, pausa y reinicio.
- Ventana de coronación (dama, torre, alfil, caballo) y piezas capturadas a los lados del tablero.
- Sonidos de jugada, captura, jaque y final de partida.

### Cómo está hecho

- `chess-logic.js` guarda el estado de la partida y habla con el motor, `chess-render.js` dibuja el tablero, `chess-timer.js` lleva el reloj.
- Stockfish corre en un **Web Worker**, así que el cálculo del motor se hace fuera del hilo principal de la interfaz. El Worker recibe la posición en formato FEN y responde con la mejor jugada (protocolo UCI).

### Tecnologías

HTML5 · CSS3 (glassmorphism) · JavaScript · Web Workers · Stockfish (UCI) · `<dialog>` · GitHub Pages

### Código de terceros

Stockfish se distribuye bajo la licencia GNU GPL v3: autores y enlaces al código fuente en `assets/js/STOCKFISH-LICENSE.md`. Las reglas de movimiento son de la biblioteca [chess.js](https://github.com/jhlywa/chess.js) 0.10.3 (BSD-2-Clause), cargada desde cdnjs.

### Cómo ejecutarlo

El motor funciona en un Web Worker, así que abra la página mediante un servidor local (por ejemplo, `npx serve .`), no como archivo.

### Planes

Son propuestas de desarrollo; el tablero independiente se mantiene funcionando por separado.

- **Visual:** añadir control del tablero con el teclado, un estado claro de «pensando/pausa» y elementos legibles en pantallas estrechas.
- **Ingeniería:** limitar la espera de la búsqueda con un timeout y recuperación, y ampliar las pruebas en navegador del ciclo de vida del motor y del reloj.
- **Funciones:** añadir la lista de jugadas, exportación PGN y deshacer jugada con cancelación explícita de la búsqueda de la IA en curso.

### Pruebas del motor

`node --test tests/engine-races.test.cjs` comprueba que la jugada pendiente se cancela al reiniciar, al pausar, al cambiar la posición y al cerrar la página. Tras volver mediante BFCache, el turno actual de la IA se lanza una sola vez y se ignoran las respuestas del Worker antiguo. Las búsquedas UCI se ejecutan una tras otra.

---

<a name="french"></a>

## Français

Des échecs dans le navigateur au style « verre et néon » : jouez avec un ami sur le même écran ou contre le moteur Stockfish, avec pendule, « cimetière » des pièces prises et choix de la pièce à la promotion d'un pion.

**Démo :** https://dubnovalexey.github.io/Cosmo-Glass-Chess/

### Visite rapide

Choisissez de jouer à deux ou contre l'IA, jouez un coup, essayez la pause de la pendule et la rotation de l'échiquier. Recommencer lance une nouvelle partie ; quand un pion atteint la dernière rangée, on peut choisir la pièce.

### Fonctions

- Joueur contre joueur ou contre l'IA ; le niveau de l'IA fixe la profondeur de calcul de Stockfish.
- Jouer les blancs ou les noirs, rotation de l'échiquier.
- Une pendule pour chaque camp avec temps réglable, pause et remise à zéro.
- Fenêtre de promotion (dame, tour, fou, cavalier) et pièces prises sur les bords de l'échiquier.
- Sons pour le coup, la prise, l'échec et la fin de partie.

### Comment c'est fait

- `chess-logic.js` garde l'état de la partie et dialogue avec le moteur, `chess-render.js` dessine l'échiquier, `chess-timer.js` tient la pendule.
- Stockfish tourne dans un **Web Worker** : le calcul du moteur se fait hors du fil principal de l'interface. Le Worker reçoit la position au format FEN et répond par le meilleur coup (protocole UCI).

### Technologies

HTML5 · CSS3 (glassmorphism) · JavaScript · Web Workers · Stockfish (UCI) · `<dialog>` · GitHub Pages

### Code tiers

Stockfish est distribué sous licence GNU GPL v3 : auteurs et liens vers les sources dans `assets/js/STOCKFISH-LICENSE.md`. Les règles de déplacement viennent de la bibliothèque [chess.js](https://github.com/jhlywa/chess.js) 0.10.3 (BSD-2-Clause), chargée depuis cdnjs.

### Lancer le projet

Le moteur tourne dans un Web Worker : ouvrez donc la page via un serveur local (par exemple `npx serve .`), et non comme un fichier.

### Projets

Ce sont des pistes d'évolution ; l'échiquier autonome reste fonctionnel à part.

- **Visuel :** ajouter le contrôle de l'échiquier au clavier, un état clair « réflexion/pause » et des éléments lisibles sur écran étroit.
- **Ingénierie :** borner l'attente de la recherche par un timeout avec reprise, et étendre les tests en navigateur du cycle de vie du moteur et de la pendule.
- **Fonctions :** ajouter la liste des coups, l'export PGN et l'annulation d'un coup avec arrêt explicite de la recherche en cours de l'IA.

### Tests du moteur

`node --test tests/engine-races.test.cjs` vérifie que le coup en attente est annulé au redémarrage, à la pause, au changement de position et à la fermeture de la page. Après un retour via le BFCache, le tour actuel de l'IA n'est lancé qu'une fois et les réponses de l'ancien Worker sont ignorées. Les recherches UCI s'exécutent l'une après l'autre.
