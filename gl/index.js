const CURRENT_SOURCE_URL = './haruko386.go';
const PREVIOUS_SOURCE_URL = './haruko386.old.go';

const GO_KEYWORDS = new Set([
    'break', 'case', 'chan', 'const', 'continue', 'default', 'defer',
    'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import',
    'interface', 'map', 'package', 'range', 'return', 'select', 'struct',
    'switch', 'type', 'var',
]);

const GO_TYPES = new Set([
    'any', 'bool', 'byte', 'comparable', 'complex64', 'complex128',
    'error', 'float32', 'float64', 'int', 'int8', 'int16', 'int32',
    'int64', 'rune', 'string', 'uint', 'uint8', 'uint16', 'uint32',
    'uint64', 'uintptr',
]);

const GO_CONSTANTS = new Set(['false', 'iota', 'nil', 'true']);
const GO_OPERATORS = [
    '<<=', '>>=', '&^=', '...', ':=', '==', '!=', '<=', '>=', '&&', '||',
    '++', '--', '<<', '>>', '&^', '<-', '+=', '-=', '*=', '/=', '%=',
    '&=', '|=', '^=', '+', '-', '*', '/', '%', '&', '|', '^', '!', '=',
    '<', '>',
];

const codeRows = document.getElementById('code-rows');
const windowTitle = document.querySelector('.title');
const lineDiff = window.LineDiff;
const wantsDiffView =
    new URLSearchParams(window.location.search).get('diff') === '1';

loadPage();
setupEgg();

async function loadPage() {
    try {
        const currentSource = await fetchSource(CURRENT_SOURCE_URL);

        if (!wantsDiffView) {
            setViewMode(false);
            renderSource(currentSource);
            return;
        }

        try {
            const previousSource = await fetchSource(PREVIOUS_SOURCE_URL);
            setViewMode(true);
            renderDiff(previousSource, currentSource);
        } catch (error) {
            setViewMode(false);
            renderSource(currentSource);
            console.warn(
                'Unable to load haruko386.old.go; showing the current source.',
                error,
            );
        }
    } catch (error) {
        renderStatus(
            'Unable to load haruko386.go. Open this page through a local web server.',
            true,
        );
        console.error('Failed to load haruko386.go:', error);
    }
}

async function fetchSource(url) {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`${url}: HTTP ${response.status}`);
    }

    return response.text();
}

function setViewMode(isDiffView) {
    document.body.dataset.view = isDiffView ? 'diff' : 'source';
    windowTitle.textContent = isDiffView
        ? 'haruko386.go (diff)'
        : 'haruko386.go';
}

function renderSource(source) {
    const lines = lineDiff.splitLines(source);
    const highlightedLines = highlightSource(lines);
    const rows = lines.map((text, index) => ({
        type: 'context',
        oldLine: null,
        newLine: index + 1,
        text,
    }));

    renderRows(rows, [], highlightedLines);
}

function renderDiff(previousSource, currentSource) {
    const result = lineDiff.compare(previousSource, currentSource);
    const previousHighlights = highlightSource(result.previousLines);
    const currentHighlights = highlightSource(result.currentLines);

    renderRows(result.rows, previousHighlights, currentHighlights);
}

function renderRows(rows, previousHighlights, currentHighlights) {
    if (rows.length === 0) {
        renderStatus('No code to display.');
        return;
    }

    const fragment = document.createDocumentFragment();

    rows.forEach((row) => {
        const tokens = row.type === 'removed'
            ? previousHighlights[row.oldLine - 1]
            : currentHighlights[row.newLine - 1];

        fragment.appendChild(createSourceRow(row, tokens));
    });

    codeRows.replaceChildren(fragment);
}

function createSourceRow(diffRow, tokens) {
    const row = document.createElement('div');
    row.className = diffRow.type === 'context'
        ? 'row'
        : `row ${diffRow.type}`;

    const previousNumber = document.createElement('div');
    previousNumber.className = 'ln';
    previousNumber.textContent = diffRow.oldLine ?? '';

    const currentNumber = document.createElement('div');
    currentNumber.className = 'ln';
    currentNumber.textContent = diffRow.newLine ?? '';

    const marker = document.createElement('div');
    marker.className = 'marker';

    if (diffRow.type === 'added') {
        marker.classList.add('plus');
        marker.textContent = '+';
    } else if (diffRow.type === 'removed') {
        marker.classList.add('minus');
        marker.textContent = '-';
    } else {
        marker.classList.add('dot');
        marker.textContent = '·';
    }

    const divider = document.createElement('div');
    divider.className = 'divider';

    const code = document.createElement('div');
    code.className = 'code';
    appendTokens(code, tokens);

    row.append(previousNumber, currentNumber, marker, divider, code);
    return row;
}

function highlightSource(lines) {
    const lexerState = {
        inBlockComment: false,
        inRawString: false,
    };

    return lines.map((line) => tokenizeGoLine(line, lexerState));
}

function tokenizeGoLine(line, state) {
    const tokens = [];
    let cursor = 0;

    while (cursor < line.length) {
        if (state.inBlockComment) {
            const commentEnd = line.indexOf('*/', cursor);
            const end = commentEnd === -1 ? line.length : commentEnd + 2;
            pushToken(tokens, line.slice(cursor, end), 'c-comment');
            cursor = end;
            state.inBlockComment = commentEnd === -1;
            continue;
        }

        if (state.inRawString) {
            const stringEnd = line.indexOf('`', cursor);
            const end = stringEnd === -1 ? line.length : stringEnd + 1;
            pushToken(tokens, line.slice(cursor, end), 'c-green');
            cursor = end;
            state.inRawString = stringEnd === -1;
            continue;
        }

        if (line.startsWith('//', cursor)) {
            pushToken(tokens, line.slice(cursor), 'c-comment');
            break;
        }

        if (line.startsWith('/*', cursor)) {
            const commentEnd = line.indexOf('*/', cursor + 2);
            const end = commentEnd === -1 ? line.length : commentEnd + 2;
            pushToken(tokens, line.slice(cursor, end), 'c-comment');
            cursor = end;
            state.inBlockComment = commentEnd === -1;
            continue;
        }

        const character = line[cursor];

        if (character === '`') {
            const stringEnd = line.indexOf('`', cursor + 1);
            const end = stringEnd === -1 ? line.length : stringEnd + 1;
            pushToken(tokens, line.slice(cursor, end), 'c-green');
            cursor = end;
            state.inRawString = stringEnd === -1;
            continue;
        }

        if (character === '"' || character === '\'') {
            const end = findQuotedLiteralEnd(line, cursor, character);
            pushToken(tokens, line.slice(cursor, end), 'c-green');
            cursor = end;
            continue;
        }

        const identifier = line.slice(cursor).match(/^[A-Za-z_][A-Za-z0-9_]*/);
        if (identifier) {
            const value = identifier[0];
            let className = 'c-white';

            if (GO_KEYWORDS.has(value)) {
                className = 'c-purple';
            } else if (GO_TYPES.has(value)) {
                className = 'c-orange';
            } else if (GO_CONSTANTS.has(value)) {
                className = 'c-blue';
            } else if (isFunctionCall(line, cursor + value.length)) {
                className = 'c-blue';
            } else if (/^[A-Z]/.test(value)) {
                className = 'c-orange';
            }

            pushToken(tokens, value, className);
            cursor += value.length;
            continue;
        }

        const number = line.slice(cursor).match(
            /^(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|0[bB][01](?:_?[01])*|0[oO][0-7](?:_?[0-7])*|\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?i?)/,
        );
        if (number) {
            pushToken(tokens, number[0], 'c-cyan');
            cursor += number[0].length;
            continue;
        }

        const operator = GO_OPERATORS.find((value) =>
            line.startsWith(value, cursor),
        );
        if (operator) {
            pushToken(tokens, operator, 'c-cyan');
            cursor += operator.length;
            continue;
        }

        pushToken(tokens, character, null);
        cursor += 1;
    }

    return tokens;
}

function findQuotedLiteralEnd(line, start, quote) {
    let cursor = start + 1;

    while (cursor < line.length) {
        if (line[cursor] === '\\') {
            cursor += 2;
            continue;
        }

        cursor += 1;
        if (line[cursor - 1] === quote) {
            break;
        }
    }

    return cursor;
}

function isFunctionCall(line, start) {
    let cursor = start;

    while (cursor < line.length && /\s/.test(line[cursor])) {
        cursor += 1;
    }

    return line[cursor] === '(';
}

function pushToken(tokens, value, className) {
    const previousToken = tokens[tokens.length - 1];

    if (previousToken && previousToken.className === className) {
        previousToken.value += value;
        return;
    }

    tokens.push({ value, className });
}

function appendTokens(container, tokens = []) {
    tokens.forEach((tokenData) => {
        if (!tokenData.className) {
            container.appendChild(document.createTextNode(tokenData.value));
            return;
        }

        const token = document.createElement('span');
        token.className = tokenData.className;
        token.textContent = tokenData.value;
        container.appendChild(token);
    });
}

function renderStatus(message, isError = false) {
    const row = document.createElement('div');
    row.className = `row source-status${isError ? ' error' : ''}`;

    const previousNumber = document.createElement('div');
    previousNumber.className = 'ln';

    const currentNumber = document.createElement('div');
    currentNumber.className = 'ln';

    const marker = document.createElement('div');
    marker.className = 'marker';

    const divider = document.createElement('div');
    divider.className = 'divider';

    const code = document.createElement('div');
    code.className = 'code';
    code.textContent = message;

    row.append(previousNumber, currentNumber, marker, divider, code);
    codeRows.replaceChildren(row);
}

function setupEgg() {
    const triggerTarget = document.getElementById('trigger-target');
    const eggImageContainer = document.getElementById('egg-image-container');
    const eggImage = document.getElementById('egg-image');

    if (!triggerTarget || !eggImageContainer || !eggImage) {
        return;
    }

    const triggerSequence = 'ghj14174';
    const showDurationMs = 3000;
    const inputTimeoutMs = 10000;
    let isListeningForKeypress = false;
    let inputBuffer = '';
    let timeoutId = null;

    eggImage.src = './doc/unforgetable.jpg';

    triggerTarget.addEventListener('click', () => {
        if (isListeningForKeypress) {
            return;
        }

        isListeningForKeypress = true;
        inputBuffer = '';
        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetState, inputTimeoutMs);
    });

    document.addEventListener('keydown', (event) => {
        if (!isListeningForKeypress) {
            return;
        }

        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetState, inputTimeoutMs);

        const key = event.key.toLowerCase();
        if (!triggerSequence.includes(key)) {
            return;
        }

        inputBuffer += key;
        if (inputBuffer === triggerSequence) {
            triggerEgg();
            resetState();
        } else if (!triggerSequence.startsWith(inputBuffer)) {
            resetState();
        }
    });

    function triggerEgg() {
        eggImageContainer.classList.add('show');
        eggImage.classList.add('show');

        setTimeout(() => {
            eggImageContainer.classList.remove('show');
            eggImage.classList.remove('show');
        }, showDurationMs);
    }

    function resetState() {
        isListeningForKeypress = false;
        inputBuffer = '';
        clearTimeout(timeoutId);
    }
}
