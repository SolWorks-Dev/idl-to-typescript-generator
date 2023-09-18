"use client";

import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Logger } from "@solworks/soltoolkit-sdk";
import { ArrowLeftRight, Check, Clipboard, ClipboardCopy, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { generateListOfTypes, generateTypeScriptTypes } from "./type-generator";
const logger = new Logger("core");

export default function IndexPage() {
  const { toast } = useToast();
  const [idl, setIdl] = useState("");
  const [typeNames, setTypeNames] = useState<{
    name: string;
    enabled: boolean;
  }[]>([]);
  const [types, setTypes] = useState("");
  const [includeAccounts, setIncludeAccounts] = useState<CheckedState>(false);
  const [includeTypes, setIncludeTypes] = useState<CheckedState>(true);
  const [includeEnums, setIncludeEnums] = useState<CheckedState>(true);
  const [includeEvents, setIncludeEvents] = useState<CheckedState>(true);
  const [bnTypeReplacement, setBnTypeReplacement] = useState<"number" | "bignumber" | "bn">("bn");

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
        <div className="flex items-center justify-start space-x-4 pt-2">
          <Textarea
            placeholder="Paste your IDL here."
            onChange={(e) => {
              setIdl(e.target.value);
              try {
                let typeList = generateListOfTypes({
                  jsonData: JSON.parse(e.target.value),
                  includeAccounts: includeAccounts === true,
                  includeTypes: includeTypes === true,
                  includeEnums: includeEnums === true,
                  includeEvents: includeEvents === true,
                });
                setTypeNames(typeList.map((typeName) => { return { name: typeName, enabled: true } }));
              } catch (e: any) {
                console.log(e);
              }
            }}
            value={idl}
            className="h-[300px]"
          />
          <div className="flex flex-col gap-2 w-[400px] sticky top-0">
            <div className="mb-4">
              <h3 className="text-xl font-bold leading-tight tracking-tighter md:text-xl">
              Settings
              </h3>
              <div className="text-md">
                <div className="inline-block pr-4 text-base text-muted-foreground">
                  Configure generation settings.
                </div>
              </div>
            </div>
            <RadioGroup defaultValue="bn" value={bnTypeReplacement} onValueChange={(value) => {
              console.log(value);
              setBnTypeReplacement(value as "number" | "bignumber" | "bn");
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bn" id="option-one" />
                <text className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Do not replace BN
                </text>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="number" id="option-two" />
                <text className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Replace BN with number type
                </text>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bignumber" id="option-three" />
                <text className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Replace BN with BigNumber type
                </text>
              </div>
            </RadioGroup>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms2" checked={includeTypes} onCheckedChange={(value) => {
                setIncludeTypes(value);
                try {
                  let typeList = generateListOfTypes({
                    jsonData: JSON.parse(idl),
                    includeAccounts: includeAccounts === true,
                    includeTypes: value === true,
                    includeEnums: includeEnums === true,
                    includeEvents: includeEvents === true,
                  });
                  setTypeNames(typeList.map((typeName) => { return { name: typeName, enabled: true } }));
                } catch (e: any) {
                  console.log(e);
                }
              }} />
              <label
                htmlFor="terms2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Types
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms2" checked={includeAccounts} onCheckedChange={(value) => {
                setIncludeAccounts(value);
                try {
                  let typeList = generateListOfTypes({
                    jsonData: JSON.parse(idl),
                    includeAccounts: value === true,
                    includeTypes: includeTypes === true,
                    includeEnums: includeEnums === true,
                    includeEvents: includeEvents === true,
                  });
                  setTypeNames(typeList.map((typeName) => { return { name: typeName, enabled: true } }));
                } catch (e: any) {
                  console.log(e);
                }
              }} />
              <label
                htmlFor="terms2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Accounts
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms2" checked={includeEnums} onCheckedChange={(value) => {
                setIncludeEnums(value);
                try {
                  let typeList = generateListOfTypes({
                    jsonData: JSON.parse(idl),
                    includeAccounts: includeAccounts === true,
                    includeTypes: includeTypes === true,
                    includeEnums: value === true,
                    includeEvents: includeEvents === true,
                  });
                  setTypeNames(typeList.map((typeName) => { return { name: typeName, enabled: true } }));
                } catch (e: any) {
                  console.log(e);
                }
              }} />
              <label
                htmlFor="terms2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Enums
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms2" checked={includeEvents} onCheckedChange={(value) => {
                setIncludeEvents(value);
                try {
                  let typeList = generateListOfTypes({
                    jsonData: JSON.parse(idl),
                    includeAccounts: includeAccounts === true,
                    includeTypes: includeTypes === true,
                    includeEnums: includeEnums === true,
                    includeEvents: value === true,
                  });
                  setTypeNames(typeList.map((typeName) => { return { name: typeName, enabled: true } }));
                } catch (e: any) {
                  console.log(e);
                }
              }} />
              <label
                htmlFor="terms2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Events
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start space-x-4 pt-2">
          <Button
            variant="outline"
            onClick={async () => {
              const clipboard = await navigator.clipboard.readText();
              setIdl(clipboard);
              try {
                let typeList = generateListOfTypes({
                  jsonData: JSON.parse(clipboard),
                  includeAccounts: includeAccounts === true,
                  includeTypes: includeTypes === true,
                  includeEnums: includeEnums === true,
                  includeEvents: includeEvents === true,
                });
                setTypeNames(typeList.map((typeName) => { return { name: typeName, enabled: true } }));
              } catch (e: any) {
                console.log(e);
              }
            }}
          >
                <ClipboardCopy className="mr-2 h-4 w-4" /> Paste
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              setIdl("");
              setTypeNames([]);
            }}
          >
                <X className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button
            variant="default"
            onClick={async () => {
              try {
                const json = JSON.parse(idl);
                const types = generateTypeScriptTypes({
                  jsonData: json,
                  includeAccounts: includeAccounts === true,
                  includeTypes: includeTypes === true,
                  includeEnums: includeEnums === true,
                  includeEvents: includeEvents === true,
                  useNumberForBN: bnTypeReplacement === "number",
                  useBigNumberForBN: bnTypeReplacement === "bignumber",
                  typeSelection: typeNames,
                })
                setTypes(types)
                toast({
                  title: "Success",
                  description: `Types have been generated.`,
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
            <ArrowLeftRight className="mr-2 h-4 w-4" /> Generate
          </Button>
          
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
        <div className="flex items-center justify-start space-x-4 pt-2">
          <Textarea
            placeholder={"Types will appear here."}
            value={types}
            className="h-[500px]"
          />
           <div className="flex flex-col gap-2 w-[400px] sticky top-0">
            <div className="mb-4">
              <h3 className="text-xl font-bold leading-tight tracking-tighter md:text-xl">
              Select Included Types
              </h3>
              <div className="text-md">
                <div className="inline-block pr-4 text-base text-muted-foreground">
                  Choose which types to include in the generated types. This will populate once an IDL is entered.
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start space-x-4 pb-4">
              <Button
                variant="outline"
                onClick={async () => {
                  setTypeNames(typeNames.map((type) => { return { name: type.name, enabled: true } }));
                }}
              >
                <Check className="mr-2 h-4 w-4" /> Select All
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  setTypeNames(typeNames.map((type) => { return { name: type.name, enabled: false } }));
                }}
              >
                <X className="mr-2 h-4 w-4" /> Deselect All
              </Button>
            </div>
            {typeNames.map((typeName) => {
              return (
                <div className="flex items-center space-x-2">
                  <Checkbox id={typeName.name} checked={typeName.enabled} onCheckedChange={(value) => {
                    setTypeNames(typeNames.map((type) => {
                      if (type.name === typeName.name) {
                        return { name: typeName.name, enabled: value };
                      } else {
                        return type;
                      }
                    }) as { name: string, enabled: boolean }[]);
                  }} />
                  <label
                    htmlFor={typeName.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {typeName.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
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
      <Toaster />
    </section>
  )
}