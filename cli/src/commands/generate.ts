import generator, {
  generateListOfTypes,
} from "@solworks/idl-to-typescript-generator-lib";
import type { Arguments, CommandBuilder } from "yargs";
import { readFile, writeFile } from 'fs/promises';

type Options = {
  path: string;
  includeAccounts: boolean | undefined;
  includeTypes: boolean | undefined;
  includeEnums: boolean | undefined;
  includeEvents: boolean | undefined;
  includeExport: boolean | undefined;
  useBigNumberForBN: boolean | undefined;
  useInterfaceInsteadOfTypeDef: boolean | undefined;
  verbose: boolean | undefined;
  outputToConsole: boolean | undefined;
  outputToFile: boolean | undefined;
  outputFilePath: string | undefined;
};

export const command: string =
  "generate <path> [includeAccounts] [includeTypes] [includeEnums] [includeEvents] [includeExport] [useBigNumberForBN] [useInterfaceInsteadOfTypeDef] [verbose] [outputToConsole] [outputToFile] [outputFilePath]";
export const desc: string = "generate typescript definitions for the given idl";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      includeAccounts: { type: "boolean", default: true },
      includeTypes: { type: "boolean", default: true },
      includeEnums: { type: "boolean", default: true },
      includeEvents: { type: "boolean", default: true },
      includeExport: { type: "boolean", default: true },
      useBigNumberForBN: { type: "boolean", default: false },
      useInterfaceInsteadOfTypeDef: { type: "boolean", default: false },
      verbose: { type: "boolean", default: false },
      outputToConsole: { type: "boolean", default: true },
      outputToFile: { type: "boolean", default: false },
      outputFilePath: { type: "string", default: "output.ts" },
    })
    .positional("path", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const {
    path,
    includeAccounts,
    includeTypes,
    includeEnums,
    includeEvents,
    includeExport,
    useBigNumberForBN,
    useInterfaceInsteadOfTypeDef,
    verbose,
    outputToConsole,
    outputToFile,
    outputFilePath,
  } = argv;

  if (verbose) {
    process.stdout.write(
      `generate typescript definitions for the given idl: ${path}\n`
    );
    process.stdout.write(`includeAccounts: ${includeAccounts}\n`);
    process.stdout.write(`includeTypes: ${includeTypes}\n`);
    process.stdout.write(`includeEnums: ${includeEnums}\n`);
    process.stdout.write(`includeEvents: ${includeEvents}\n`);
    process.stdout.write(`includeExport: ${includeExport}\n`);
    process.stdout.write(`useBigNumberForBN: ${useBigNumberForBN}\n`);
    process.stdout.write(
      `useInterfaceInsteadOfTypeDef: ${useInterfaceInsteadOfTypeDef}\n`
    );
    process.stdout.write(`verbose: ${verbose}\n`);
    process.stdout.write(`outputToConsole: ${outputToConsole}\n`);
    process.stdout.write(`outputToFile: ${outputToFile}\n`);
    process.stdout.write(`outputFilePath: ${outputFilePath}\n`);
  }

  try {
    let fileContents = await readFile(path, { encoding: 'utf-8' });
    let jsonData = JSON.parse(fileContents);
    let types = generateListOfTypes({
      jsonData,
      includeAccounts: includeAccounts === undefined ? true : includeAccounts,
      includeTypes: includeTypes === undefined ? true : includeTypes,
      includeEnums: includeEnums === undefined ? true : includeEnums,
      includeEvents: includeEvents === undefined ? true : includeEvents,
    });
    let res = generator({
      jsonData,
      includeAccounts: includeAccounts === undefined ? true : includeAccounts,
      includeTypes: includeTypes === undefined ? true : includeTypes,
      includeEnums: includeEnums === undefined ? true : includeEnums,
      includeEvents: includeEvents === undefined ? true : includeEvents,
      includeExport: includeExport === undefined ? true : includeExport,
      useBigNumberForBN:
        useBigNumberForBN === undefined ? true : useBigNumberForBN,
      interfaceOrType:
        useInterfaceInsteadOfTypeDef === undefined
          ? "interface"
          : useInterfaceInsteadOfTypeDef === true
          ? "interface"
          : "type",
      useNumberForBN: false,
      typeSelection: types.map((type) => ({ name: type, enabled: true })),
    });

    if (outputToConsole) {
      process.stdout.write(res + "\n");
    } 
    
    if (outputToFile && outputFilePath) {
      await writeFile(outputFilePath, res);
    }
  } catch (err: any) {
    process.stderr.write(err);
  }

  process.exit(0);
};
