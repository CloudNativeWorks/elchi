import ts from "typescript";
import { styleComment } from "./commentStyle";


export function isEnumType(type: ts.Type): boolean {
    return !!(type.flags & ts.TypeFlags.Enum) || !!(type.flags & ts.TypeFlags.EnumLiteral);
}

export function isEnumTypeNode(typeNode: ts.TypeNode | undefined, checker: ts.TypeChecker): boolean {
    if (!typeNode) return false;
    const type = checker.getTypeAtLocation(typeNode);
    return !!(type.flags & ts.TypeFlags.Enum) || !!(type.flags & ts.TypeFlags.EnumLiteral);
}

export function getCommentText(node: ts.Node, sourceFile: ts.SourceFile): string {
    const ss = node.getFullStart()
    const aa = sourceFile.getFullText()
    const commentRanges = ts.getLeadingCommentRanges(aa, ss) || [];
    return styleComment(commentRanges, sourceFile);
}

export function getUnionCommentText(node: ts.Node, sourceFile: ts.SourceFile): string {
    let comments = "";
    let currentNode: ts.Node | undefined = node;
    while (currentNode) {
        const fullText = sourceFile.getFullText();
        const commentRanges = ts.getLeadingCommentRanges(fullText, currentNode.getFullStart());

        if (commentRanges && commentRanges.length > 0) {
            comments = styleComment(commentRanges, sourceFile);
            break;
        }
        currentNode = currentNode.parent;
    }
    return comments.trim();
}

export function isNodeDeprecated(node: ts.Node | undefined): boolean {
    if (!node) return false;
    const jsDocTags = ts.getJSDocTags(node);
    return jsDocTags.some(tag => tag.tagName.getText() === 'deprecated');
}

export function isOneOfType(type: ts.Type, checker: ts.TypeChecker): boolean {
    if (type.isUnion()) {
        return type.types.every(subType => {
            return (subType.flags & ts.TypeFlags.Undefined) ||
                ((subType.flags & ts.TypeFlags.Object) &&
                    checker.getPropertiesOfType(subType).some(prop => prop.name === '$case'));
        });
    }
    return false;
}

export function isSpecialUnionType(typeNode: ts.TypeNode | undefined, checker: ts.TypeChecker): boolean {
    if (!typeNode) return false;
    const type = checker.getTypeAtLocation(typeNode);

    if (type.isUnion()) {
        for (const subType of type.types) {
            const properties = checker.getPropertiesOfType(subType);
            if (!properties.some(prop => prop.name === '$case')) {
                return false;
            }
        }
        return true;
    }

    const typeString = checker.typeToString(type);
    if (typeString.includes('$case')) {
        console.log('Manually detected as special union:', typeString);
        return true;
    }

    return false;
}

export function isNotImplemented(comment: string): boolean {
    return comment.includes('#not-implemented-hide:');
}

export function isPrimitiveType(typeName: string): boolean {
    return ['string', 'string[]', 'Duration', 'number', 'number[]', 'boolean', 'any', 'unknown', 'void', 'undefined', 'null'].includes(
        typeName
    );
}
