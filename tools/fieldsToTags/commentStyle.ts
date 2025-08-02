import ts from "typescript";


export function styleComment(commentRanges: ts.CommentRange[], sourceFile: ts.SourceFile): string {
    let comments = '';
    for (const range of commentRanges) {
        const comment = sourceFile.getFullText().substring(range.pos, range.end);

        if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
            if (comment.startsWith('/**')) {
                comments += comment
                    .replace(/^\/\*\*+/, '')  // /** başlangıcını kaldır
                    .replace(/\*\/$/, '')  // */ sonunu kaldır
                    .replace(/^\s*\* ?/gm, '')  // Satır başındaki * işaretlerini kaldır
                    .replace(/^\s+/, (match) => match) // Her satırın başındaki girintiyi koru
                    .replace(/\t/g, '    ')  // Tab'ları boşluklarla değiştir
                    .replace(/\n{3,}/g, '\n\n')  // Üç veya daha fazla boş satırı ikiye indir
                    .replace(/(\s|^):(\w+)(?=\s|$)/g, '$1`:$2`')  // Tek iki nokta ile başlayan ifadeleri `` arasına al
                    .trimEnd(); // Sondaki gereksiz boşlukları kaldır, baştakiler kalsın
            }
        }
    }

    const lines = comments.split('\n');
    const result: string[] = [];
    let insideCodeBlock = false;
    let insideAdmonition = false;
    let previousLineWasEmpty = false;
    let isValidatedYamlBlock = false;
    let sawNonEmptyLineAfterEmpty = false; // Boş satırdan sonra dolu bir satır gördüğümüzü takip eder


    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.trim().toLowerCase().startsWith('.. validated-code-block:: yaml')) {
            insideCodeBlock = true;
            isValidatedYamlBlock = true;
            previousLineWasEmpty = false;
            sawNonEmptyLineAfterEmpty = false;
            result.push("```yaml\n");  // YAML kod bloğu başlangıcını ekle
            continue;
        }

        // .. code-block:: yaml ifadesini değiştir
        if (line.trim().toLowerCase().startsWith('.. code-block:: yaml')) {
            insideCodeBlock = true;
            result.push("```yaml\n");  // code-block başlangıcını değiştir
            continue;
        }

        // .. code-block:: json ifadesini değiştir
        if (line.trim().toLowerCase().startsWith('.. code-block:: json')) {
            insideCodeBlock = true;
            result.push("```json\n");  // JSON için code-block başlangıcını değiştir
            continue;
        }

        // .. note:: ifadesini değiştir ve tip başlangıcını ekle
        if (line.trim().toLowerCase().startsWith('.. note::')) {
            insideAdmonition = true;
            result.push(":::note\n");
            continue;
        }

        // .. attention:: ifadesini değiştir ve warning başlangıcını ekle
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
                    result.push('\n');  // İçerideki boş satır
                }
            } else {
                if (previousLineWasEmpty) {
                    sawNonEmptyLineAfterEmpty = true;
                }
                // Eğer kod bloğunun içindeysek satır sonlarını koruyoruz
                if (insideCodeBlock) {
                    result.push(`${line}\n`);  // Code block içinde satır sonlarını olduğu gibi ekle
                } else {
                    result.push(`${line.trim()} `);  // Note ve warning içinde satır sonlarını kaldır
                }
                previousLineWasEmpty = false;
            }

            // Diğer kod blokları için: Eğer bir sonraki satır boşsa, kod bloğunu bitir
            if (i + 1 < lines.length && lines[i + 1].trim() === '' && !isValidatedYamlBlock) {
                if (insideCodeBlock) {
                    result.push("```\n");  // code-block sonu
                    insideCodeBlock = false;
                } else if (insideAdmonition) {
                    result.push("\n:::\n");  // admonition sonu
                    insideAdmonition = false;
                }
            }

            continue;
        }

        // Boş satırları ele al
        if (line.trim() === '') {
            if (!previousLineWasEmpty) {
                result.push('\n\n');  // Boş satır varsa \n ekle
                previousLineWasEmpty = true;
            }
        } else {
            // Satırları birleştir ve boş satırdan sonra yeni paragraf başlat
            if (previousLineWasEmpty || result.length === 0) {
                result.push(line);
            } else {
                result[result.length - 1] += ` ${line.trim()}`;  // Satırları birleştir
            }
            previousLineWasEmpty = false;
        }
    }

    // Son düzenlemeler
    const cleanedComments = result.join('')
        .replace(/:ref:`([^`]+) <([^>]+)>`/g, '`$1`')
        .replace(/:ref:`([^`]+)<([^>]+)>`/g, '`$1`')
        .replace(/:ref:/g, '')
        .replace(/@deprecated/g, '')
        .replace(/\[#comment:.*?\]/g, '')
        .replace(/\n{3,}/g, '\n\n')  // Üç veya daha fazla boş satırı ikiye indir
        .replace(/\[#next-major-version: .*?\]/g, '')  // [#next-major-version: *] ifadesini kaldır
        .replace(/\[#extension-category: (.*?)\]/g, 'extension-category: $1')  // [#extension-category: *] ifadesini temizle
        .trim();

    return cleanedComments;
}
