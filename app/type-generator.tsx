import { CheckedState } from "@radix-ui/react-checkbox";





interface TypeDefinition {
  kind: string
  fields?: TypeField[]
  variants?: TypeVariant[]
  array?: [TypeDefinition, number]
  defined?: string
  type?: string
  option?: TypeDefinition | string
  vec?: TypeDefinition | string
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

interface JSONData {
  types: Type[];
  accounts: Type[];
}

const typeMap = [
  {
    name: "bool",
    space: 1,
    type: "boolean",
  },
  {
    name: "u8",
    space: 1,
    type: "number",
  },
  {
    name: "i8",
    space: 1,
    type: "number",
  },
  {
    name: "u16",
    space: 2,
    type: "number",
  },
  {
    name: "i16",
    space: 2,
    type: "number",
  },
  {
    name: "u32",
    space: 4,
    type: "number",
  },
  {
    name: "i32",
    space: 4,
    type: "number",
  },
  {
    name: "u64",
    space: 8,
    type: "BN",
  },
  {
    name: "i64",
    space: 8,
    type: "BN",
  },
  {
    name: "u128",
    space: 16,
    type: "BN",
  },
  {
    name: "i128",
    space: 16,
    type: "BN",
  },
  {
    name: "publicKey",
    space: 32,
    type: "PublicKey",
  },
  {
    name: "Enum",
    space: 1,
    type: "number",
  },
  {
    name: "f32",
    space: 4,
    type: "number",
  },
  {
    name: "f64",
    space: 8,
    type: "number",
  },
]

export function generateTypeScriptTypes({
  jsonData,
  useNumberForBN,
  includeAccounts,
  includeTypes,
  includeEnums,
  useBigNumberForBN,
}: {
  jsonData: JSONData
  useNumberForBN: CheckedState
  includeAccounts: boolean
  includeTypes: boolean
  includeEnums: boolean,
  useBigNumberForBN: boolean
}): string {
  const typeScriptTypes: string[] = []

  if (includeTypes) {
    for (const type of jsonData.types) {
      const typeName = type.name
      const typeDefinition = type.type
      const typeScriptType = generateTypeScriptType(
        typeDefinition,
        useNumberForBN,
        useBigNumberForBN
      )
      if (type.type.kind !== "enum") {
        typeScriptTypes.push(`interface ${typeName} ${typeScriptType}`)
      }
    }
  }

  if (includeEnums) {
    for (const type of jsonData.types) {
      const typeName = type.name
      const typeDefinition = type.type
      const typeScriptType = generateTypeScriptType(
        typeDefinition,
        useNumberForBN,
        useBigNumberForBN
      )
      if (type.type.kind === "enum") {
        typeScriptTypes.push(`enum ${typeName} ${typeScriptType}`)
      }
    }
  }

  if (includeAccounts) {
    for (const type of jsonData.accounts) {
      const typeName = type.name
      const typeDefinition = type.type
      const typeScriptType = generateTypeScriptType(
        typeDefinition,
        useNumberForBN,
        useBigNumberForBN
      )
      typeScriptTypes.push(`interface ${typeName} ${typeScriptType}`)
    }
  }

  return typeScriptTypes.join("\n\n")
}

function generateTypeScriptType(typeDefinition: TypeDefinition, useNumberForBN: CheckedState, useBigNumberForBN: CheckedState): string {
  if (typeDefinition.kind === 'struct') {
    const fields = typeDefinition.fields || [];
    const fieldTypes = fields
      // @ts-ignore
      .map((field) => `   ${field.name}: ${generateTypeScriptType(field.type, useNumberForBN, useBigNumberForBN)};`)
      .join('\n');
    return `{\n${fieldTypes}\n}`;
  } else if (typeDefinition.kind === 'enum') {
    const variants = typeDefinition.variants || [];
    const variantNames = variants
      // @ts-ignore
      .map((variant) => `   ${variant.name} = '${variant.name}',`)
      .join('\n');
    return `{\n${variantNames}\n}`;
  } else if (typeDefinition.array) {
    const [definedType, length] = typeDefinition.array;
    return `[${generateTypeScriptType(definedType, useNumberForBN, useBigNumberForBN)}: ${length}]`;
  } else if (typeDefinition.defined) {
    return `${typeDefinition.defined}`;
  } else if (typeDefinition.option) {
    if (typeof typeDefinition.option === 'string') {
      return `${typeDefinition.option} | null`;
    } else {
      return `${generateTypeScriptType(
        typeDefinition.option,
        useNumberForBN,
        useBigNumberForBN
      )} | null`
    }
  } else if (typeDefinition.vec) {
    if (typeof typeDefinition.vec === "string") {
      return `${typeDefinition.vec}[]`
    } else {
      return `${generateTypeScriptType(typeDefinition.vec, useNumberForBN, useBigNumberForBN)}[]`
    }
  } else {
    if (typeDefinition.type) {
      const typeMapEntry = typeMap.find((entry) => entry.name === typeDefinition.type);
      if (typeMapEntry) {
        return typeMapEntry.type;
      }
    } else {
      // @ts-ignore
      const typeMapEntry = typeMap.find((entry) => entry.name === typeDefinition.toString());
      if (typeMapEntry) {
        if (typeMapEntry.type === 'BN') {
          if (useNumberForBN === 'indeterminate') {
            return 'BN | number';
          } else if (useNumberForBN) {
            return 'number';
          } else if (useBigNumberForBN) {
            return 'BigNumber';
          } else {
            return 'BN';
          }
        }
        return typeMapEntry.type;
      }
    }
    return `${typeDefinition}`;
  }
}