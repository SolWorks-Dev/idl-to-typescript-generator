"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMap = exports.generateListOfTypes = exports.default = void 0;
const typeMap = [
    {
        name: 'bool',
        space: 1,
        type: 'boolean',
    },
    {
        name: 'u8',
        space: 1,
        type: 'number',
    },
    {
        name: 'i8',
        space: 1,
        type: 'number',
    },
    {
        name: 'u16',
        space: 2,
        type: 'number',
    },
    {
        name: 'i16',
        space: 2,
        type: 'number',
    },
    {
        name: 'u32',
        space: 4,
        type: 'number',
    },
    {
        name: 'i32',
        space: 4,
        type: 'number',
    },
    {
        name: 'u64',
        space: 8,
        type: 'BN',
    },
    {
        name: 'i64',
        space: 8,
        type: 'BN',
    },
    {
        name: 'u128',
        space: 16,
        type: 'BN',
    },
    {
        name: 'i128',
        space: 16,
        type: 'BN',
    },
    {
        name: 'publicKey',
        space: 32,
        type: 'PublicKey',
    },
    {
        name: 'Enum',
        space: 1,
        type: 'number',
    },
    {
        name: 'f32',
        space: 4,
        type: 'number',
    },
    {
        name: 'f64',
        space: 8,
        type: 'number',
    },
];
exports.typeMap = typeMap;
function generateListOfTypes({ jsonData, includeAccounts, includeTypes, includeEnums, includeEvents, }) {
    const types = [];
    if (jsonData.types && includeTypes) {
        for (const type of jsonData.types) {
            if (type.type.kind !== 'enum') {
                const typeName = type.name;
                types.push(typeName);
            }
        }
    }
    if (jsonData.types && includeEnums) {
        for (const type of jsonData.types) {
            if (type.type.kind === 'enum') {
                const typeName = type.name;
                types.push(typeName);
            }
        }
    }
    if (jsonData.accounts && includeAccounts) {
        for (const type of jsonData.accounts) {
            const typeName = type.name;
            types.push(typeName);
        }
    }
    if (jsonData.events && includeEvents) {
        for (const event of jsonData.events) {
            const typeName = event.name;
            types.push(typeName);
        }
    }
    return types.sort();
}
exports.generateListOfTypes = generateListOfTypes;
function generateTypeScriptTypes({ jsonData, useNumberForBN, includeAccounts, includeTypes, includeEnums, includeEvents, useBigNumberForBN, typeSelection, interfaceOrType, includeExport, }) {
    var _a, _b, _c, _d;
    const typeScriptTypes = [];
    if (includeTypes && jsonData.types) {
        for (const type of jsonData.types) {
            const typeName = type.name;
            let isTypeSelected = ((_a = typeSelection.find((type) => type.name === typeName)) === null || _a === void 0 ? void 0 : _a.enabled) || false;
            if (isTypeSelected && type.type.kind !== 'enum') {
                const typeDefinition = type.type;
                const typeScriptType = generateTypeScriptType(typeDefinition, useNumberForBN, useBigNumberForBN);
                typeScriptTypes.push(interfaceOrType === 'interface'
                    ? `${includeExport ? 'export ' : ''}interface ${typeName} ${typeScriptType}`
                    : `${includeExport ? 'export ' : ''}type ${typeName} = ${typeScriptType}`);
            }
        }
    }
    if (includeEnums && jsonData.types) {
        for (const type of jsonData.types) {
            const typeName = type.name;
            let isTypeSelected = ((_b = typeSelection.find((type) => type.name === typeName)) === null || _b === void 0 ? void 0 : _b.enabled) || false;
            if (isTypeSelected && type.type.kind === 'enum') {
                const typeDefinition = type.type;
                const typeScriptType = generateTypeScriptType(typeDefinition, useNumberForBN, useBigNumberForBN);
                typeScriptTypes.push(`${includeExport ? 'export ' : ''}enum ${typeName} ${typeScriptType}`);
            }
        }
    }
    if (includeAccounts && jsonData.accounts) {
        for (const type of jsonData.accounts) {
            const typeName = type.name;
            let isTypeSelected = ((_c = typeSelection.find((type) => type.name === typeName)) === null || _c === void 0 ? void 0 : _c.enabled) || false;
            if (isTypeSelected) {
                const typeDefinition = type.type;
                const typeScriptType = generateTypeScriptType(typeDefinition, useNumberForBN, useBigNumberForBN);
                typeScriptTypes.push(interfaceOrType === 'interface'
                    ? `${includeExport ? 'export ' : ''}interface ${typeName} ${typeScriptType}`
                    : `${includeExport ? 'export ' : ''}type ${typeName} = ${typeScriptType}`);
            }
        }
    }
    if (includeEvents && jsonData.events) {
        for (const event of jsonData.events) {
            const typeName = event.name;
            let isTypeSelected = ((_d = typeSelection.find((type) => type.name === typeName)) === null || _d === void 0 ? void 0 : _d.enabled) || false;
            if (isTypeSelected) {
                const typeDefinition = {
                    kind: 'struct',
                    fields: event.fields,
                };
                const typescriptType = generateTypeScriptType(typeDefinition, useNumberForBN, useBigNumberForBN);
                typeScriptTypes.push(interfaceOrType === 'interface'
                    ? `${includeExport ? 'export ' : ''}interface ${typeName} ${typescriptType}`
                    : `${includeExport ? 'export ' : ''}type ${typeName} = ${typescriptType}`);
            }
        }
    }
    return typeScriptTypes.join('\n\n');
}
exports.default = generateTypeScriptTypes;
function generateTypeScriptType(typeDefinition, useNumberForBN, useBigNumberForBN) {
    if (typeDefinition.kind === 'struct') {
        const fields = typeDefinition.fields || [];
        const fieldTypes = fields
            .map((field) => 
        // @ts-ignore
        `   ${field.name}: ${generateTypeScriptType(field.type, useNumberForBN, useBigNumberForBN)};`)
            .join('\n');
        return `{\n${fieldTypes}\n}`;
    }
    else if (typeDefinition.kind === 'enum') {
        const variants = typeDefinition.variants || [];
        const variantNames = variants
            // @ts-ignore
            .map((variant) => `   ${variant.name} = '${variant.name}',`)
            .join('\n');
        return `{\n${variantNames}\n}`;
    }
    else if (typeDefinition.array) {
        const [definedType, length] = typeDefinition.array;
        return `[${generateTypeScriptType(definedType, useNumberForBN, useBigNumberForBN)}: ${length}]`;
    }
    else if (typeDefinition.defined) {
        return `${typeDefinition.defined}`;
    }
    else if (typeDefinition.option) {
        if (typeof typeDefinition.option === 'string') {
            return `${typeDefinition.option} | null`;
        }
        else {
            return `${generateTypeScriptType(typeDefinition.option, useNumberForBN, useBigNumberForBN)} | null`;
        }
    }
    else if (typeDefinition.vec) {
        if (typeof typeDefinition.vec === 'string') {
            return `${typeDefinition.vec}[]`;
        }
        else {
            return `${generateTypeScriptType(typeDefinition.vec, useNumberForBN, useBigNumberForBN)}[]`;
        }
    }
    else {
        if (typeDefinition.type) {
            const typeMapEntry = typeMap.find((entry) => entry.name === typeDefinition.type);
            if (typeMapEntry) {
                return typeMapEntry.type;
            }
        }
        else {
            // @ts-ignore
            const typeMapEntry = typeMap.find((entry) => entry.name === typeDefinition.toString());
            if (typeMapEntry) {
                if (typeMapEntry.type === 'BN') {
                    if (useNumberForBN) {
                        return 'number';
                    }
                    else if (useBigNumberForBN) {
                        return 'BigNumber';
                    }
                    else {
                        return 'BN';
                    }
                }
                return typeMapEntry.type;
            }
        }
        return `${typeDefinition}`;
    }
}
