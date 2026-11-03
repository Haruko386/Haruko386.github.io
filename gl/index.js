const MAIN_SOURCE = 'haruko386.go';
const LIFE_SOURCE = 'life.go';

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
const sourceTitle = document.getElementById('source-title');
const editorBody = document.getElementById('editor-body');
const backButton = document.getElementById('back-button');

let loadId = 0;

loadPage();
setupEgg();
setupNavigation();

async function loadPage() {
    const fileName = getCurrentFile();
    const currentLoadId = ++loadId;
    sourceTitle.textContent = fileName;
    editorBody.setAttribute('aria-label', `${fileName} source code`);
    backButton.disabled = fileName === MAIN_SOURCE;
    renderStatus(`Loading ${fileName}...`);

    try {
        const source = await fetchSource(`./${fileName}`);
        if (currentLoadId === loadId) {
            renderSource(source, fileName);
        }
    } catch (error) {
        if (currentLoadId !== loadId) {
            return;
        }
        renderStatus(
            `Unable to load ${fileName}. Open this page through a local web server.`,
            true,
        );
        console.error(`Failed to load ${fileName}:`, error);
    }
}

function getCurrentFile() {
    return new URLSearchParams(window.location.search).get('file') === LIFE_SOURCE
        ? LIFE_SOURCE
        : MAIN_SOURCE;
}

function setupNavigation() {
    backButton.addEventListener('click', () => navigateTo(MAIN_SOURCE));
    codeRows.addEventListener('click', (event) => {
        const link = event.target.closest('.source-link');
        if (link) {
            event.preventDefault();
            navigateTo(LIFE_SOURCE);
        }
    });
    window.addEventListener('popstate', loadPage);
}

function navigateTo(fileName) {
    if (fileName === getCurrentFile()) {
        return;
    }

    const url = new URL(window.location.href);
    if (fileName === MAIN_SOURCE) {
        url.searchParams.delete('file');
    } else {
        url.searchParams.set('file', fileName);
    }
    window.history.pushState(null, '', url);
    loadPage();
}

async function fetchSource(url) {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`${url}: HTTP ${response.status}`);
    }

    return response.text();
}

function renderSource(source, fileName) {
    const normalizedSource = source.replace(/\r\n?/g, '\n');
    const content = normalizedSource.endsWith('\n')
        ? normalizedSource.slice(0, -1)
        : normalizedSource;
    const lines = content === '' ? [] : content.split('\n');
    const highlightedLines = highlightSource(lines);

    if (lines.length === 0) {
        renderStatus('No code to display.');
        return;
    }

    const fragment = document.createDocumentFragment();

    lines.forEach((line, index) => {
        const linkExecute = fileName === MAIN_SOURCE &&
            /^\s*world\.Execute\(me\)\s*$/.test(line);
        fragment.appendChild(createBrowseRow(index + 1, highlightedLines[index], linkExecute));
    });

    codeRows.replaceChildren(fragment);
}

function createBrowseRow(lineNumber, tokens, linkExecute) {
    const row = document.createElement('div');
    row.className = 'source-row';

    const number = document.createElement('div');
    number.className = 'ln';
    number.textContent = lineNumber;

    const divider = document.createElement('div');
    divider.className = 'divider';

    const code = document.createElement('div');
    code.className = 'code';
    appendTokens(code, tokens, linkExecute);

    row.append(number, divider, code);
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

function appendTokens(container, tokens = [], linkExecute = false) {
    tokens.forEach((tokenData) => {
        if (linkExecute && tokenData.value === 'Execute') {
            const link = document.createElement('a');
            link.className = 'source-link';
            link.href = '?file=life.go';
            link.textContent = tokenData.value;
            link.setAttribute('aria-label', '查看 life.go 中的 Execute');
            container.appendChild(link);
            return;
        }

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
