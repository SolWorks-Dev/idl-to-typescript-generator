interface TypeDefinition {
    kind: string;
    fields?: TypeField[];
    variants?: TypeVariant[];
    array?: [TypeDefinition, number];
    defined?: string;
    type?: string;
    option?: TypeDefinition | string;
    vec?: TypeDefinition | string;
}
interface TypeField {
    name: string;
    type: TypeDefinition | string;
}
interface TypeVariant {
    name: string;
}
interface Type {
    name: string;
    type: TypeDefinition;
}
interface Event {
    name: string;
    fields: TypeField[];
}
interface JSONData {
    types?: Type[];
    accounts: Type[];
    events?: Event[];
}
declare const typeMap: {
    name: string;
    space: number;
    type: string;
}[];
declare function generateListOfTypes({ jsonData, includeAccounts, includeTypes, includeEnums, includeEvents, }: {
    jsonData: JSONData;
    includeAccounts: boolean;
    includeTypes: boolean;
    includeEnums: boolean;
    includeEvents: boolean;
}): string[];
declare function generateTypeScriptTypes({ jsonData, useNumberForBN, includeAccounts, includeTypes, includeEnums, includeEvents, useBigNumberForBN, typeSelection, interfaceOrType, includeExport, }: {
    jsonData: JSONData;
    useNumberForBN: boolean;
    includeAccounts: boolean;
    includeTypes: boolean;
    includeEnums: boolean;
    includeEvents: boolean;
    useBigNumberForBN: boolean;
    typeSelection: {
        name: string;
        enabled: boolean;
    }[];
    interfaceOrType: 'interface' | 'type';
    includeExport: boolean;
}): string;
export { generateTypeScriptTypes as default, generateListOfTypes, TypeDefinition, TypeField, TypeVariant, Type, Event, JSONData, typeMap, };
//# sourceMappingURL=index.d.ts.map