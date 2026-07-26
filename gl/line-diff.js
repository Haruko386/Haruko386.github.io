(function initializeLineDiff(root) {
    function splitLines(source) {
        const normalized = source.replace(/\r\n?/g, '\n');

        if (normalized === '') {
            return [];
        }

        const content = normalized.endsWith('\n')
            ? normalized.slice(0, -1)
            : normalized;

        return content.split('\n');
    }

    function compare(previousSource, currentSource) {
        const previousLines = splitLines(previousSource);
        const currentLines = splitLines(currentSource);
        const table = buildLongestCommonSubsequenceTable(
            previousLines,
            currentLines,
        );
        const rows = buildDiffRows(previousLines, currentLines, table);

        return {
            previousLines,
            currentLines,
            rows,
        };
    }

    function buildLongestCommonSubsequenceTable(previousLines, currentLines) {
        const table = Array.from(
            { length: previousLines.length + 1 },
            () => new Uint32Array(currentLines.length + 1),
        );

        for (let oldIndex = previousLines.length - 1; oldIndex >= 0; oldIndex -= 1) {
            for (let newIndex = currentLines.length - 1; newIndex >= 0; newIndex -= 1) {
                if (previousLines[oldIndex] === currentLines[newIndex]) {
                    table[oldIndex][newIndex] =
                        table[oldIndex + 1][newIndex + 1] + 1;
                } else {
                    table[oldIndex][newIndex] = Math.max(
                        table[oldIndex + 1][newIndex],
                        table[oldIndex][newIndex + 1],
                    );
                }
            }
        }

        return table;
    }

    function buildDiffRows(previousLines, currentLines, table) {
        const rows = [];
        let oldIndex = 0;
        let newIndex = 0;

        while (
            oldIndex < previousLines.length ||
            newIndex < currentLines.length
        ) {
            if (
                oldIndex < previousLines.length &&
                newIndex < currentLines.length &&
                previousLines[oldIndex] === currentLines[newIndex]
            ) {
                rows.push({
                    type: 'context',
                    oldLine: oldIndex + 1,
                    newLine: newIndex + 1,
                    text: currentLines[newIndex],
                });
                oldIndex += 1;
                newIndex += 1;
                continue;
            }

            const shouldRemove =
                oldIndex < previousLines.length &&
                (
                    newIndex === currentLines.length ||
                    table[oldIndex + 1][newIndex] >=
                        table[oldIndex][newIndex + 1]
                );

            if (shouldRemove) {
                rows.push({
                    type: 'removed',
                    oldLine: oldIndex + 1,
                    newLine: null,
                    text: previousLines[oldIndex],
                });
                oldIndex += 1;
                continue;
            }

            rows.push({
                type: 'added',
                oldLine: null,
                newLine: newIndex + 1,
                text: currentLines[newIndex],
            });
            newIndex += 1;
        }

        return rows;
    }

    const lineDiff = {
        compare,
        splitLines,
    };

    root.LineDiff = lineDiff;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = lineDiff;
    }
}(typeof globalThis !== 'undefined' ? globalThis : window));
