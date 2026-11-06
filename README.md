# Cyber Chess

[English](#english) · [Русский](#russian) · [עברית](#hebrew)

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
