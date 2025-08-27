import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import { getCommentText, isEnumType, isEnumTypeNode, isNodeDeprecated, isNotImplemented, isOneOfType, isPrimitiveType, isSpecialUnionType, getUnionCommentText } from './utils';


const rootDir = path.resolve(__dirname, '../../');
const version = process.argv[2];

if (!version) {
    console.error('Please specify a version number. For example: v1.31.2');
    process.exit(1);
}

const inputDir = path.join(rootDir, 'src', 'elchi', 'versions', version, 'models');
const outputDir = path.join(rootDir, 'src', 'elchi', 'versions', version, 'tags');
const tagInfoList: { version: string; tagName: string; filePath: string; relativePath: string, modelPath: string }[] = [];
const outputFileContents: Map<string, string[]> = new Map();

function processFile(
    filePath: string,
    program: ts.Program,
    globalInterfaceMap: Map<string, { node: ts.InterfaceDeclaration; filePath: string }>
) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) return;

    const checker = program.getTypeChecker();
    const interfaces: ts.InterfaceDeclaration[] = [];

    function visit(node: ts.Node) {
        if (ts.isInterfaceDeclaration(node)) {
            interfaces.push(node);
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    interfaces.forEach(interfaceNode => {
        const interfaceName = interfaceNode.name.text;
        globalInterfaceMap.set(interfaceName, { node: interfaceNode, filePath });
    });

    interfaces.forEach(interfaceNode => {
        processInterface(
            interfaceNode,
            filePath,
            checker,
            globalInterfaceMap,
            new Set(),
            processedInterfacesInFile,
            sourceFile
        );
    });
}

function getEnumValues(type: ts.Type): string[] {
    const enumValues: string[] = [];

    if (type.isUnion()) {
        type.types.forEach(subType => {
            const symbol = subType.getSymbol();
            const literalValue = symbol ? symbol.getName() : null;
            if (literalValue) {
                enumValues.push(literalValue);
            }
        });
    }
    return enumValues;
}

function processInterface(
    interfaceNode: ts.InterfaceDeclaration,
    filePath: string,
    checker: ts.TypeChecker,
    globalInterfaceMap: Map<string, { node: ts.InterfaceDeclaration; filePath: string }>,
    processedInterfaces: Set<string> = new Set(),
    processedInterfacesInFile: Map<string, Set<string>>,
    sourceFile: ts.SourceFile,
    parentInterfaceName?: string
) {
    const interfaceName = interfaceNode.name.text;
    const fullInterfaceName = parentInterfaceName
        ? `${parentInterfaceName}.${interfaceName}`
        : interfaceName;

    if (processedInterfaces.has(fullInterfaceName)) return;
    processedInterfaces.add(fullInterfaceName);

    const fields: any[] = [];
    const singleFields: string[] = [];

    interfaceNode.members.forEach(member => {
        if (ts.isPropertySignature(member)) {
            const fieldName = member.name.getText();

            if (fieldName === '$type') {
                return;
            }

            const fieldTypeNode = member.type;
            const fieldType = fieldTypeNode
                ? checker.typeToString(checker.getTypeAtLocation(fieldTypeNode))
                : 'any';

            const isDeprecated = isNodeDeprecated(member);
            const isUnion = fieldTypeNode ? isOneOfType(checker.getTypeAtLocation(fieldTypeNode), checker) : false;
            const isPrimitive = isPrimitiveType(fieldType);
            const isEnum = fieldTypeNode ? isEnumTypeNode(fieldTypeNode, checker) : false;
            const isSpecialUnion = fieldTypeNode
                ? isSpecialUnionType(fieldTypeNode, checker)
                : false;

            const comment = getCommentText(member, sourceFile);

            let enumValues: string[] | null = null;
            if (isEnum) {
                const type = checker.getTypeAtLocation(fieldTypeNode as ts.TypeNode);
                enumValues = getEnumValues(type);
            }

            if (isSpecialUnion && fieldTypeNode) {
                const [unionFields, u_singleFields] = expandUnionType(
                    fieldTypeNode,
                    checker,
                    fieldName,
                    comment,
                    sourceFile,
                );

                fields.push(...unionFields);
                if (u_singleFields.length > 0) {
                    singleFields.push(...u_singleFields);
                }
            } else {
                fields.push({
                    name: fieldName,
                    isUnion: isUnion,
                    isDeprecated: isDeprecated,
                    fieldType: fieldType,
                    enums: enumValues,
                    comment: comment,
                    notImp: isNotImplemented(comment),
                });

                if ((isPrimitive || isEnum) && !isDeprecated) {
                    singleFields.push(fieldName);
                }
            }

            if (!isUnion && !isPrimitive && !isSpecialUnion) {
                const typeSymbol = fieldTypeNode
                    ? checker.getTypeAtLocation(fieldTypeNode).getSymbol()
                    : undefined;
                if (typeSymbol && typeSymbol.declarations) {
                    const declarationFile =
                        typeSymbol.declarations[0].getSourceFile().fileName;
                    const isSameFile = path.resolve(declarationFile) === path.resolve(filePath);

                    if (isSameFile) {
                        const nestedInterfaceNode = typeSymbol.declarations.find(
                            ts.isInterfaceDeclaration
                        );
                        if (nestedInterfaceNode) {
                            processInterface(
                                nestedInterfaceNode,
                                filePath,
                                checker,
                                globalInterfaceMap,
                                processedInterfaces,
                                processedInterfacesInFile,
                                sourceFile,
                                interfaceName
                            );
                        }
                    }
                }
            }
        }
    });

    if (fields.length === 0) {
        return;
    }

    const relativePath = path.relative(inputDir, filePath).replace(/\\/g, '/');
    const outputFileName = `${path.basename(filePath)}`;
    const outputFilePath = path.join(outputDir, path.dirname(relativePath), outputFileName);
    const modelFilePath = path.join(inputDir, path.dirname(relativePath), outputFileName);
    const version = path.relative(outputDir, outputFilePath).split(path.sep)[0];

    tagInfoList.push({
        version: version,
        tagName: `${interfaceName}`,
        filePath: outputFilePath,
        relativePath: relativePath.replace(/\.ts$/, ''),
        modelPath: modelFilePath,
    });

    if (singleFields.length > 0) {
        tagInfoList.push({
            version: version,
            tagName: `${interfaceName}_SingleFields`,
            filePath: outputFilePath,
            relativePath: relativePath.replace(/\.ts$/, ''),
            modelPath: modelFilePath,
        });
    }

    const outputFileDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputFileDir)) {
        fs.mkdirSync(outputFileDir, { recursive: true });
    }

    if (!processedInterfacesInFile.has(outputFilePath)) {
        processedInterfacesInFile.set(outputFilePath, new Set());
    }
    const processedInThisFile = processedInterfacesInFile.get(outputFilePath)!;

    if (processedInThisFile.has(interfaceName)) {
        return;
    }
    processedInThisFile.add(interfaceName);

    if (!outputFileContents.has(outputFilePath)) {
        const importPath = '@elchi/tags/tagsType';
        outputFileContents.set(outputFilePath, [`import {OutType} from '${importPath}';\n`]);
    }
    const contentArray = outputFileContents.get(outputFilePath)!;

    let interfaceContent = `
export const ${interfaceName}: OutType = { "${interfaceName}": ${JSON.stringify(
        fields,
        null,
        2
    )} };
`;

    if (singleFields.length > 0) {
        interfaceContent += `
export const ${interfaceName}_SingleFields = ${JSON.stringify(singleFields, null, 2)};
`;
    }

    contentArray.push(interfaceContent.trim());
}

function expandUnionType(
    typeNode: ts.TypeNode | undefined,
    checker: ts.TypeChecker,
    parentName: string,
    parentComment: string,
    sourceFile: ts.SourceFile
): [any[], string[]] {
    const fields: any[] = [];
    const singleFields: string[] = [];

    if (!typeNode) {
        return [fields, []];
    }

    const type = checker.getTypeAtLocation(typeNode);
    if (type.isUnion()) {
        for (const subType of type.types) {
            let enumValues: string[] | null = null;
            if (isEnumType(subType)) {
                enumValues = getEnumValues(subType);
            }

            if (enumValues && enumValues.length > 0) {
                fields.push({
                    name: parentName,
                    isUnion: true,
                    isDeprecated: false,
                    fieldType: 'UnionType',
                    enums: enumValues,
                    comment: parentComment,
                    notImp: isNotImplemented(parentComment),
                });
            } else {
                const properties = checker.getPropertiesOfType(subType);

                properties.filter(prop => prop.name !== '$case').forEach(prop => {
                    if (prop.valueDeclaration && ts.isPropertySignature(prop.valueDeclaration)) {
                        const comment = getUnionCommentText(prop.valueDeclaration, sourceFile);
                        const fieldType = checker.typeToString(checker.getTypeAtLocation(prop.valueDeclaration));
                        const isEnum = isEnumTypeNode(prop.valueDeclaration.type, checker);
                        const fieldEnums = isEnum ? getEnumValues(checker.getTypeAtLocation(prop.valueDeclaration)) : null;
                        const isDeprecated = isNodeDeprecated(prop.valueDeclaration);

                        fields.push({
                            name: `${parentName}.${prop.name}`,
                            isUnion: true,
                            isDeprecated: isDeprecated,
                            fieldType: fieldType,
                            enums: fieldEnums,
                            comment: comment || parentComment,
                            notImp: isNotImplemented(comment || parentComment),
                        });

                        if ((isPrimitiveType(fieldType) || isEnum) && !isDeprecated) {
                            singleFields.push(`${parentName}.${prop.name}`);
                        }
                    }
                });
            }
        }
    } else {
        const typeString = checker.typeToString(type);
        if (typeString.includes('$case')) {

            const subTypes = typeString
                .split('|')
                .map(t => t.trim())
                .filter(t => t.includes('$case'));

            for (const subTypeString of subTypes) {
                const match = /\{\s*\$case:\s*"([^"]+)";\s*([^}]+)\s*\}/.exec(subTypeString);
                if (match) {
                    const caseKey = match[1];
                    let caseFields = match[2].trim();
                    const typeMatch = /([^:]+):\s*([^;]+);/.exec(caseFields);
                    if (typeMatch) {
                        caseFields = typeMatch[2].trim();
                    }

                    let comment = "";
                    const enumType = checker.getTypeFromTypeNode(typeNode);
                    const isEnum = isEnumType(enumType);
                    const enumValues = isEnum ? getEnumValues(enumType) : null;

                    const members = type.getProperties();
                    const member = members.find(member => member.name === caseKey);
                    if (member && member.declarations) {
                        member.declarations.forEach(declaration => {
                            comment = getUnionCommentText(declaration, sourceFile);
                        });
                    }

                    fields.push({
                        name: `${parentName}.${caseKey}`,
                        isUnion: true,
                        isDeprecated: false,
                        fieldType: isEnum ? 'EnumType' : caseFields,
                        enums: enumValues,
                        comment: comment || parentComment,
                        notImp: isNotImplemented(parentComment),
                    });

                    if ((isPrimitiveType(caseFields) || isEnum)) {
                        singleFields.push(`${parentName}.${caseKey}`);
                    }
                }
            }
        }
    }

    return [fields, singleFields];
}

function getAllTsFiles(dir: string, filesList: string[] = []) {
    const files = fs.readdirSync(dir);

    files.forEach(function (file) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getAllTsFiles(fullPath, filesList);
        } else if (stat.isFile() && file.endsWith('.ts')) {
            const relativePath = path.relative(inputDir, fullPath);
            const pathSegments = relativePath.split(path.sep);
            if (
                pathSegments.includes('v2') ||
                pathSegments.includes('v2alpha') ||
                pathSegments.includes('v3alpha') ||
                pathSegments.includes('v2alpha1')
            ) {
                return;
            }
            filesList.push(fullPath);
        }
    });

    return filesList;
}

if (!fs.existsSync(inputDir)) {
    console.error(`Version folder not found: ${inputDir}`);
    process.exit(1);
}

if (fs.existsSync(outputDir)) {
    fse.emptyDirSync(outputDir);
} else {
    fs.mkdirSync(outputDir, { recursive: true });
}

const tsFiles = getAllTsFiles(inputDir);
const program = ts.createProgram(tsFiles, {});
const globalInterfaceMap: Map<string, { node: ts.InterfaceDeclaration; filePath: string }> = new Map();
const processedInterfacesInFile: Map<string, Set<string>> = new Map();

tsFiles.forEach(filePath => {
    processFile(filePath, program, globalInterfaceMap);
});

for (const [outputFilePath, contentArray] of outputFileContents.entries()) {
    const finalContent = contentArray.join('\n\n');
    fs.writeFileSync(outputFilePath, finalContent.trim());
}

generateTagMap(outputDir, tagInfoList);

function generateTagMap(
    baseDir: string,
    tagInfoList: { tagName: string; filePath: string; relativePath: string }[]
) {
    const tagMap: { [relativePath: string]: { [tagName: string]: string } } = {};

    tagInfoList.forEach(tagInfo => {
        const { tagName, relativePath } = tagInfo;
        const importPath = `./${relativePath}`;

        if (!tagMap[relativePath]) {
            tagMap[relativePath] = {};
        }

        if (!tagMap[relativePath][tagName]) {
            tagMap[relativePath][tagName] = importPath;
        }
    });

    const tagMapEntries: string[] = Object.entries(tagMap).map(([relativePath, tags]) => {
        const imports = Object.keys(tags)
            .map(tagName => `        '${tagName}': module.${tagName}`)
            .join(',\n');

        return `    '${relativePath}': () => import('./${relativePath}').then(module => ({\n${imports}\n    })),`;
    });

    const tagMapContent = `
export const tagMap: { [relativePath: string]: () => Promise<any> } = {
${tagMapEntries.join('\n')}
};
`;

    const tagMapFilePath = path.join(baseDir, 'tagMap.ts');
    fs.writeFileSync(tagMapFilePath, tagMapContent.trim());
}

function generateModelMap(
    baseDir: string,
    modelInfoList: { tagName: string; filePath: string; relativePath: string, modelPath: string }[]
) {
    const modelMap: { [relativePath: string]: { [modelName: string]: string } } = {};

    modelInfoList.forEach(modelInfo => {
        const { tagName, relativePath } = modelInfo;
        const importPath = `./${relativePath}`;

        if (!modelMap[relativePath]) {
            modelMap[relativePath] = {};
        }

        if (!modelMap[relativePath][tagName]) {
            modelMap[relativePath][tagName] = importPath;
        }
    });

    if (Object.keys(modelMap).length === 0) {
        console.log('modelMap empty, is not process any model info.');
    } else {
        console.log('modelMap processed:');
    }

    const modelMapEntries: string[] = Object.entries(modelMap).map(([relativePath, models]) => {
        const imports = Object.keys(models)
            .filter(modelName => !modelName.endsWith('_SingleFields'))
            .map(modelName => `        '${modelName}': module.${modelName}`)
            .join(',\n');

        return `    '${relativePath}': () => import('./${relativePath}').then(module => ({\n${imports}\n    })),`;
    });

    const modelMapContent = `
export const modelMap: { [relativePath: string]: () => Promise<{ [key: string]: any }> } = {
${modelMapEntries.join('\n')}
};
`;

    console.log(baseDir)
    const modelMapFilePath = path.join(baseDir, 'modelMap.ts');
    fs.writeFileSync(modelMapFilePath, modelMapContent.trim());
    console.log(`Created/Updated: ${modelMapFilePath}`);
}

generateModelMap(inputDir, tagInfoList);
