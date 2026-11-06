// UCI-гонки и BFCache: старый ответ/таймер не меняют новую партию, восстановление продолжает AI-ход.
const test = require('node:test'), assert = require('node:assert/strict'), vm = require('node:vm'), fs = require('node:fs'), path = require('node:path');
function fixture({turn = 'b', level = '3', active = true, terminal = false} = {}) {
    const handlers = new Map(), page = new Map(), timers = new Map(), moves = [], workers = [];
    let worker, timerId = 0, fen = 'initial', ended = 0;
    const game = { fen: () => fen, turn: () => turn, board: () => [], in_check: () => false,
        in_checkmate: () => terminal, in_draw: () => false, in_stalemate: () => false, in_threefold_repetition: () => false,
        move(value) { moves.push(value); fen = 'after'; turn = 'w'; return {}; } };
    class Worker { constructor() { worker = this; workers.push(this); this.messages = []; } postMessage(value) { this.messages.push(value); } terminate() { this.terminated = true; } }
    const window = { isGameActive: active, playerColor: 'w', addEventListener: (name, handler) => page.set(name, handler),
        endGame: () => { ended++; window.isGameActive = false; } };
    const document = { addEventListener: (name, handler) => handlers.set(name, handler), dispatchEvent: event => handlers.get(event.type)?.(), getElementById: () => ({ value: level }) };
    const context = vm.createContext({ window, document, Worker, Chess: function() { return game; }, Audio: class { play() { return Promise.resolve(); } },
        CustomEvent: class { constructor(type) { this.type = type; } }, setTimeout: fn => { timers.set(++timerId, fn); return timerId; }, clearTimeout: id => timers.delete(id), console });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/chess-logic.js'), 'utf8'), context);
    return { window, get worker() { return worker; }, workers, moves, timers, request: () => handlers.get('chessMoveCompleted')(),
        setFen: value => { fen = value; }, flush: () => { for (const [id, fn] of timers) { timers.delete(id); fn(); } }, page, ended: () => ended };
}

test('reset cancels an already scheduled engine move', () => {
    const f = fixture(); f.request(); f.worker.onmessage({ data: 'bestmove e7e5' });
    assert.equal(f.timers.size, 1); f.window.cancelEngineSearch(); f.setFen('new-game'); f.flush(); assert.equal(f.moves.length, 0);
});

test('pause/resume drains old search before accepting a new answer', () => {
    const f = fixture(); f.request(); f.window.cancelEngineSearch(); f.request();
    f.worker.onmessage({ data: 'bestmove e7e5' }); assert.equal(f.timers.size, 0);
    f.worker.onmessage({ data: 'bestmove d7d5' }); f.flush(); assert.deepEqual(f.moves, ['d7d5']);
});

test('FEN change and page hide invalidate delayed callbacks and release the worker', () => {
    const f = fixture(); f.request(); f.worker.onmessage({ data: 'bestmove e7e5' }); f.setFen('other'); f.flush();
    assert.equal(f.moves.length, 0); f.page.get('pagehide')(); assert.equal(f.worker.terminated, true);
});

for (const stage of ['search', 'delay']) test(`BFCache restore during ${stage} restarts exactly one current AI search`, () => {
    const f = fixture(); f.request(); const previous = f.worker;
    if (stage === 'delay') { previous.onmessage({ data: 'bestmove e7e5' }); assert.equal(f.timers.size, 1); }
    f.page.get('pagehide')(); assert.equal(previous.terminated, true); assert.equal(f.timers.size, 0);
    f.page.get('pageshow')(); const restored = f.worker;
    assert.notEqual(restored, previous); assert.equal(f.workers.length, 2);
    assert.equal(restored.messages.filter(message => message.startsWith('go ')).length, 1);
    f.page.get('pageshow')();
    assert.equal(f.workers.length, 2); assert.equal(restored.messages.filter(message => message.startsWith('go ')).length, 1);
    previous.onmessage({ data: 'bestmove d7d5' }); assert.equal(f.timers.size, 0);
    restored.onmessage({ data: 'bestmove c7c5' }); assert.equal(f.timers.size, 1);
    f.flush(); assert.deepEqual(f.moves, ['c7c5']);
});

test('BFCache restore never starts AI for a human turn, pause, level zero or finished match', () => {
    for (const settings of [{turn:'w'}, {active:false}, {level:'0'}, {terminal:true}]) {
        const f = fixture(settings); f.page.get('pagehide')(); f.page.get('pageshow')();
        assert.equal(f.worker.messages.filter(message => message.startsWith('go ')).length, 0);
        assert.equal(f.timers.size, 0); assert.deepEqual(f.moves, []);
        assert.equal(f.ended(), settings.terminal ? 1 : 0);
    }
});
