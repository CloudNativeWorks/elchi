import ts from "typescript";


export function styleComment(commentRanges: ts.CommentRange[], sourceFile: ts.SourceFile): string {
    let comments = '';
    for (const range of commentRanges) {
        const comment = sourceFile.getFullText().substring(range.pos, range.end);

        if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
            if (comment.startsWith('/**')) {
                comments += comment
                    .replace(/^\/\*\*+/, '')
                    .replace(/\*\/$/, '')
                    .replace(/^\s*\* ?/gm, '')
                    .replace(/^\s+/, (match) => match)
                    .replace(/\t/g, '    ')
                    .replace(/\n{3,}/g, '\n\n')
                    .replace(/(\s|^):(\w+)(?=\s|$)/g, '$1`:$2`')
                    .trimEnd();
            }
        }
    }

    const lines = comments.split('\n');
    const result: string[] = [];
    let insideCodeBlock = false;
    let insideAdmonition = false;
    let previousLineWasEmpty = false;
    let isValidatedYamlBlock = false;
    let sawNonEmptyLineAfterEmpty = false;


    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.trim().toLowerCase().startsWith('.. validated-code-block:: yaml')) {
            insideCodeBlock = true;
            isValidatedYamlBlock = true;
            previousLineWasEmpty = false;
            sawNonEmptyLineAfterEmpty = false;
            result.push("```yaml\n");
            continue;
        }

        if (line.trim().toLowerCase().startsWith('.. code-block:: yaml')) {
            insideCodeBlock = true;
            result.push("```yaml\n");
            continue;
        }

        if (line.trim().toLowerCase().startsWith('.. code-block:: json')) {
            insideCodeBlock = true;
            result.push("```json\n");
            continue;   
        }

        if (line.trim().toLowerCase().startsWith('.. note::')) {
            insideAdmonition = true;
            result.push(":::note\n");
            continue;
        }

        if (line.trim().toLowerCase().startsWith('.. attention::')) {
            insideAdmonition = true;
            result.push(":::attention\n");
            continue;
        }

        if (line.trim().toLowerCase().startsWith('.. warning::')) {
            insideAdmonition = true;
            result.push(":::warning\n");
            continue;
        }

        if (insideCodeBlock || insideAdmonition) {
            if (line.trim() === '') {
                if (isValidatedYamlBlock && sawNonEmptyLineAfterEmpty) {
                    result.push("```\n");
                    insideCodeBlock = false;
                    isValidatedYamlBlock = false;
                } else {
                    previousLineWasEmpty = true;
                    result.push('\n');
                }
            } else {
                if (previousLineWasEmpty) {
                    sawNonEmptyLineAfterEmpty = true;
                }
                if (insideCodeBlock) {
                    result.push(`${line}\n`);
                } else {
                    result.push(`${line.trim()} `);
                }
                previousLineWasEmpty = false;
            }

            if (i + 1 < lines.length && lines[i + 1].trim() === '' && !isValidatedYamlBlock) {
                if (insideCodeBlock) {
                    result.push("```\n");
                    insideCodeBlock = false;
                } else if (insideAdmonition) {
                    result.push("\n:::\n");
                    insideAdmonition = false;
                }
            }

            continue;
        }

        if (line.trim() === '') {
            if (!previousLineWasEmpty) {
                result.push('\n\n');
                previousLineWasEmpty = true;
            }
        } else {
            if (previousLineWasEmpty || result.length === 0) {
                result.push(line);
            } else {
                result[result.length - 1] += ` ${line.trim()}`;
            }
            previousLineWasEmpty = false;
        }
    }

    const cleanedComments = result.join('')
        .replace(/:ref:`([^`]+) <([^>]+)>`/g, '`$1`')
        .replace(/:ref:`([^`]+)<([^>]+)>`/g, '`$1`')
        .replace(/:ref:/g, '')
        .replace(/@deprecated/g, '')
        .replace(/\[#comment:.*?\]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\[#next-major-version: .*?\]/g, '')
        .replace(/\[#extension-category: (.*?)\]/g, 'extension-category: $1')
        .trim();

    return cleanedComments;
}
