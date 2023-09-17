"use client"

import { useState } from "react"
import {
  Logger,
} from "@solworks/soltoolkit-sdk"
import { ArrowLeftRight, Clipboard, ClipboardCopy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"

const logger = new Logger("core")


export default function IndexPage() {
  const { toast } = useToast();
  const [idl, setIdl] = useState("");
  const [types, setTypes] = useState("");
  const [useNumberForBN, setUseNumberForBN] = useState<CheckedState>(false);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Generate TypeScript types from Anchor IDL 🧠
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          IDL Type Generator
        </h1>
      </div>
      <Separator />
      <div className="grid w-full gap-2">
        <div className="grid w-full gap-0">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-2xl">
            Enter IDL
          </h1>
          <div className="max-w-[700px] text-lg">
            <div className="inline-block pr-4 text-base text-muted-foreground">
              Step 1: Enter your IDL file to convert.
            </div>
          </div>
        </div>
        <div>
          <Textarea
            placeholder="Paste your IDL here."
            onChange={(e) => {
              setIdl(e.target.value);
            }}
            value={idl}
            className="h-[300px]"
          />
        </div>
        <div className="flex items-center justify-start space-x-4 pt-2">
          <Button
            variant="outline"
            onClick={async () => {
              const clipboard = await navigator.clipboard.readText();
              setIdl(clipboard);
            }}
          >
                <ClipboardCopy className="mr-2 h-4 w-4" /> Paste
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              setIdl("");
            }}
          >
                <X className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button
            variant="default"
            onClick={async () => {
              try {
                const json = JSON.parse(idl);
                const types = generateTypeScriptTypes(json, useNumberForBN);
                setTypes(types);
              } catch (e: any) {
                console.log(e);
                toast({
                  title: "Error",
                  description: `${e.message}`,
                  duration: 5000,
                })
              }
            }}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" /> Generate
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms2" checked={useNumberForBN} onCheckedChange={setUseNumberForBN} />
            <label
              htmlFor="terms2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Use number type for BN
            </label>
          </div>
        </div>
      </div>
      <div className="grid w-full gap-2">
        <div className="grid w-full gap-0">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-2xl">
            Generate Types
          </h1>
          <div className="max-w-[700px] text-base text-muted-foreground">
            <div className="inline-block pr-4">
              Step 2: Generate types from IDL.
            </div>
          </div>
        </div>
        <Textarea
          placeholder={"Types will appear here."}
          value={types}
          className="h-[500px]"
        />
        <div className="flex items-center justify-start space-x-4 pt-2">
          <Button
            variant="outline"
            onClick={async () => {
              setTypes("");
            }}
          >
                <X className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button
            variant="default"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(types);
                toast({
                  title: "Copied",
                  description: `Types have been copied to clipboard.`,
                  duration: 5000,
                })
              } catch (e: any) {
                console.log(e);
                toast({
                  title: "Error",
                  description: `${e.message}`,
                  duration: 5000,
                })
              }
            }}
          >
            <Clipboard className="mr-2 h-4 w-4" /> Copy
          </Button>
          </div>
      </div>
    </section>
  )
}


interface TypeDefinition {
  kind: string;
  fields?: TypeField[];
  variants?: TypeVariant[];
  array?: [TypeDefinition, number];
  defined?: string;
  type?: string;
  option?: TypeDefinition | string;
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
}

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
  }
]

function generateTypeScriptTypes(jsonData: JSONData, useNumberForBN: CheckedState): string {
  const typeScriptTypes: string[] = [];

  for (const type of jsonData.types) {
    const typeName = type.name;
    const typeDefinition = type.type;
    const typeScriptType = generateTypeScriptType(typeDefinition, useNumberForBN);
    if (type.type.kind === 'enum') {
      typeScriptTypes.push(`enum ${typeName} ${typeScriptType}`);
    } else {
      typeScriptTypes.push(`interface ${typeName} ${typeScriptType}`);
    }
  }

  return typeScriptTypes.join('\n\n');
}

function generateTypeScriptType(typeDefinition: TypeDefinition, useNumberForBN: CheckedState): string {
  if (typeDefinition.kind === 'struct') {
    const fields = typeDefinition.fields || [];
    const fieldTypes = fields
      // @ts-ignore
      .map((field) => `   ${field.name}: ${generateTypeScriptType(field.type, useNumberForBN)};`)
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
    return `[${generateTypeScriptType(definedType, useNumberForBN)}: ${length}]`;
  } else if (typeDefinition.defined) {
    return `${typeDefinition.defined}`;
  } else if (typeDefinition.option) {
    if (typeof typeDefinition.option === 'string') {
      return `${typeDefinition.option} | null`;
    } else {
      return `${generateTypeScriptType(typeDefinition.option, useNumberForBN)} | null`;
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