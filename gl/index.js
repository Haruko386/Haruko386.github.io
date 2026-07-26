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

const VIEW_MODES = Object.freeze({
    SOURCE: 'source',
    UNIFIED: 'unified',
    SPLIT: 'split',
});

const NEXT_VIEW_MODE = Object.freeze({
    [VIEW_MODES.SOURCE]: VIEW_MODES.UNIFIED,
    [VIEW_MODES.UNIFIED]: VIEW_MODES.SPLIT,
    [VIEW_MODES.SPLIT]: VIEW_MODES.SOURCE,
});

const VIEW_BUTTON_LABELS = Object.freeze({
    [VIEW_MODES.SOURCE]: '查看 Diff',
    [VIEW_MODES.UNIFIED]: '左右 Diff',
    [VIEW_MODES.SPLIT]: '浏览代码',
});

const codeRows = document.getElementById('code-rows');
const viewToggle = document.getElementById('view-toggle');
const lineDiff = window.LineDiff;
let currentViewMode = getInitialViewMode();
let currentSourceText = null;
let previousSourceText = null;

viewToggle.addEventListener('click', changeViewMode);
loadPage();
setupEgg();

async function loadPage() {
    viewToggle.disabled = true;

    try {
        currentSourceText = await fetchSource(CURRENT_SOURCE_URL);

        try {
            await activateView(currentViewMode, false);
        } catch (viewError) {
            currentViewMode = VIEW_MODES.SOURCE;
            setViewMode(VIEW_MODES.SOURCE);
            renderSource(currentSourceText);
            updateViewUrl(VIEW_MODES.SOURCE);
            console.warn(
                'Unable to load haruko386.old.go; showing the current source.',
                viewError,
            );
        }
    } catch (error) {
        renderStatus(
            'Unable to load haruko386.go. Open this page through a local web server.',
            true,
        );
        console.error('Failed to load haruko386.go:', error);
    } finally {
        viewToggle.disabled = currentSourceText === null;
        updateViewButton();
    }
}

async function changeViewMode() {
    const nextMode = NEXT_VIEW_MODE[currentViewMode];
    viewToggle.disabled = true;

    try {
        await activateView(nextMode, true);
    } catch (error) {
        currentViewMode = VIEW_MODES.SOURCE;
        setViewMode(VIEW_MODES.SOURCE);
        renderSource(currentSourceText);
        updateViewUrl(VIEW_MODES.SOURCE);
        console.error('Unable to switch code view:', error);
    } finally {
        viewToggle.disabled = false;
        updateViewButton();
    }
}

async function activateView(viewMode, shouldUpdateUrl) {
    if (viewMode !== VIEW_MODES.SOURCE && previousSourceText === null) {
        previousSourceText = await fetchSource(PREVIOUS_SOURCE_URL);
    }

    currentViewMode = viewMode;
    setViewMode(viewMode);

    if (viewMode === VIEW_MODES.SOURCE) {
        renderSource(currentSourceText);
    } else if (viewMode === VIEW_MODES.UNIFIED) {
        renderUnifiedDiff(previousSourceText, currentSourceText);
    } else {
        renderSplitDiff(previousSourceText, currentSourceText);
    }

    if (shouldUpdateUrl) {
        updateViewUrl(viewMode);
    }

    updateViewButton();
}

async function fetchSource(url) {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`${url}: HTTP ${response.status}`);
    }

    return response.text();
}

function getInitialViewMode() {
    const searchParams = new URLSearchParams(window.location.search);
    const requestedView = searchParams.get('view');

    if (requestedView === VIEW_MODES.SPLIT) {
        return VIEW_MODES.SPLIT;
    }

    if (
        requestedView === VIEW_MODES.UNIFIED ||
        requestedView === 'diff' ||
        searchParams.get('diff') === '1'
    ) {
        return VIEW_MODES.UNIFIED;
    }

    return VIEW_MODES.SOURCE;
}

function setViewMode(viewMode) {
    document.body.dataset.view = viewMode;
    codeRows.className = `code-rows ${viewMode}-view`;
}

function updateViewButton() {
    viewToggle.textContent = VIEW_BUTTON_LABELS[currentViewMode];
    viewToggle.setAttribute(
        'aria-label',
        `${VIEW_BUTTON_LABELS[currentViewMode]}，当前为${currentViewMode}模式`,
    );
}

function updateViewUrl(viewMode) {
    const url = new URL(window.location.href);
    url.searchParams.delete('diff');
    url.searchParams.delete('view');

    if (viewMode !== VIEW_MODES.SOURCE) {
        url.searchParams.set('view', viewMode);
    }

    window.history.replaceState(null, '', url);
}

function renderSource(source) {
    const lines = lineDiff.splitLines(source);
    const highlightedLines = highlightSource(lines);

    if (lines.length === 0) {
        renderStatus('No code to display.');
        return;
    }

    const fragment = document.createDocumentFragment();

    lines.forEach((line, index) => {
        fragment.appendChild(createBrowseRow(index + 1, highlightedLines[index]));
    });

    codeRows.replaceChildren(fragment);
}

function renderUnifiedDiff(previousSource, currentSource) {
    const result = lineDiff.compare(previousSource, currentSource);
    const previousHighlights = highlightSource(result.previousLines);
    const currentHighlights = highlightSource(result.currentLines);

    if (result.rows.length === 0) {
        renderStatus('No code to display.');
        return;
    }

    const fragment = document.createDocumentFragment();

    result.rows.forEach((row) => {
        const tokens = row.type === 'removed'
            ? previousHighlights[row.oldLine - 1]
            : currentHighlights[row.newLine - 1];

        fragment.appendChild(createUnifiedRow(row, tokens));
    });

    codeRows.replaceChildren(fragment);
}

function renderSplitDiff(previousSource, currentSource) {
    const result = lineDiff.compare(previousSource, currentSource);

    if (result.rows.length === 0) {
        renderStatus('No code to display.');
        return;
    }

    const previousHighlights = highlightSource(result.previousLines);
    const currentHighlights = highlightSource(result.currentLines);
    const fragment = document.createDocumentFragment();

    buildSplitPairs(result.rows).forEach((pair) => {
        fragment.appendChild(
            createSplitRow(pair, previousHighlights, currentHighlights),
        );
    });

    codeRows.replaceChildren(fragment);
}

function createBrowseRow(lineNumber, tokens) {
    const row = document.createElement('div');
    row.className = 'source-row';

    const number = document.createElement('div');
    number.className = 'ln';
    number.textContent = lineNumber;

    const divider = document.createElement('div');
    divider.className = 'divider';

    const code = document.createElement('div');
    code.className = 'code';
    appendTokens(code, tokens);

    row.append(number, divider, code);
    return row;
}

function createUnifiedRow(diffRow, tokens) {
    const row = document.createElement('div');
    row.className = diffRow.type === 'context'
        ? 'unified-row'
        : `unified-row ${diffRow.type}`;

    const previousNumber = document.createElement('div');
    previousNumber.className = 'ln';
    previousNumber.textContent = diffRow.oldLine ?? '';

    const currentNumber = document.createElement('div');
    currentNumber.className = 'ln';
    currentNumber.textContent = diffRow.newLine ?? '';

    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.textContent = getDiffMarker(diffRow.type);

    if (diffRow.type !== 'context') {
        marker.classList.add(diffRow.type === 'added' ? 'plus' : 'minus');
    }

    const divider = document.createElement('div');
    divider.className = 'divider';

    const code = document.createElement('div');
    code.className = 'code';
    appendTokens(code, tokens);

    row.append(previousNumber, currentNumber, marker, divider, code);
    return row;
}

function buildSplitPairs(rows) {
    const pairs = [];
    let cursor = 0;

    while (cursor < rows.length) {
        if (rows[cursor].type === 'context') {
            pairs.push({
                previous: rows[cursor],
                current: rows[cursor],
            });
            cursor += 1;
            continue;
        }

        const removedRows = [];
        const addedRows = [];

        while (cursor < rows.length && rows[cursor].type !== 'context') {
            if (rows[cursor].type === 'removed') {
                removedRows.push(rows[cursor]);
            } else {
                addedRows.push(rows[cursor]);
            }
            cursor += 1;
        }

        const pairCount = Math.max(removedRows.length, addedRows.length);

        for (let index = 0; index < pairCount; index += 1) {
            pairs.push({
                previous: removedRows[index] ?? null,
                current: addedRows[index] ?? null,
            });
        }
    }

    return pairs;
}

function createSplitRow(pair, previousHighlights, currentHighlights) {
    const row = document.createElement('div');
    row.className = 'split-row';

    const previousTokens = pair.previous
        ? previousHighlights[pair.previous.oldLine - 1]
        : [];
    const currentTokens = pair.current
        ? currentHighlights[pair.current.newLine - 1]
        : [];

    row.append(
        createSplitSide(pair.previous, 'previous', previousTokens),
        createSplitSide(pair.current, 'current', currentTokens),
    );

    return row;
}

function createSplitSide(diffRow, side, tokens) {
    const container = document.createElement('div');
    const rowType = diffRow?.type ?? 'empty';
    container.className = `split-side ${side} ${rowType}`;

    const number = document.createElement('div');
    number.className = 'ln';
    number.textContent = diffRow
        ? (side === 'previous' ? diffRow.oldLine : diffRow.newLine)
        : '';

    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.textContent = diffRow ? getDiffMarker(diffRow.type) : '';

    if (rowType === 'added') {
        marker.classList.add('plus');
    } else if (rowType === 'removed') {
        marker.classList.add('minus');
    }

    const divider = document.createElement('div');
    divider.className = 'divider';

    const code = document.createElement('div');
    code.className = 'code';
    appendTokens(code, tokens);

    container.append(number, marker, divider, code);
    return container;
}

function getDiffMarker(rowType) {
    if (rowType === 'added') {
        return '+';
    }

    if (rowType === 'removed') {
        return '-';
    }

    return '';
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
    const status = document.createElement('div');
    status.className = `source-status${isError ? ' error' : ''}`;
    status.textContent = message;
    codeRows.replaceChildren(status);
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
