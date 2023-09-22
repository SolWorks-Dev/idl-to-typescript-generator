"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const idl_to_typescript_generator_lib_1 = __importStar(require("@solworks/idl-to-typescript-generator-lib"));
const promises_1 = require("fs/promises");
exports.command = "generate <path> [includeAccounts] [includeTypes] [includeEnums] [includeEvents] [includeExport] [useBigNumberForBN] [useInterfaceInsteadOfTypeDef] [verbose] [outputToConsole] [outputToFile] [outputFilePath]";
exports.desc = "generate typescript definitions for the given idl";
const builder = (yargs) => yargs
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
exports.builder = builder;
const handler = (argv) => __awaiter(void 0, void 0, void 0, function* () {
    const { path, includeAccounts, includeTypes, includeEnums, includeEvents, includeExport, useBigNumberForBN, useInterfaceInsteadOfTypeDef, verbose, outputToConsole, outputToFile, outputFilePath, } = argv;
    if (verbose) {
        process.stdout.write(`generate typescript definitions for the given idl: ${path}\n`);
        process.stdout.write(`includeAccounts: ${includeAccounts}\n`);
        process.stdout.write(`includeTypes: ${includeTypes}\n`);
        process.stdout.write(`includeEnums: ${includeEnums}\n`);
        process.stdout.write(`includeEvents: ${includeEvents}\n`);
        process.stdout.write(`includeExport: ${includeExport}\n`);
        process.stdout.write(`useBigNumberForBN: ${useBigNumberForBN}\n`);
        process.stdout.write(`useInterfaceInsteadOfTypeDef: ${useInterfaceInsteadOfTypeDef}\n`);
        process.stdout.write(`verbose: ${verbose}\n`);
        process.stdout.write(`outputToConsole: ${outputToConsole}\n`);
        process.stdout.write(`outputToFile: ${outputToFile}\n`);
        process.stdout.write(`outputFilePath: ${outputFilePath}\n`);
    }
    try {
        let fileContents = yield (0, promises_1.readFile)(path, { encoding: 'utf-8' });
        let jsonData = JSON.parse(fileContents);
        let types = (0, idl_to_typescript_generator_lib_1.generateListOfTypes)({
            jsonData,
            includeAccounts: includeAccounts === undefined ? true : includeAccounts,
            includeTypes: includeTypes === undefined ? true : includeTypes,
            includeEnums: includeEnums === undefined ? true : includeEnums,
            includeEvents: includeEvents === undefined ? true : includeEvents,
        });
        let res = (0, idl_to_typescript_generator_lib_1.default)({
            jsonData,
            includeAccounts: includeAccounts === undefined ? true : includeAccounts,
            includeTypes: includeTypes === undefined ? true : includeTypes,
            includeEnums: includeEnums === undefined ? true : includeEnums,
            includeEvents: includeEvents === undefined ? true : includeEvents,
            includeExport: includeExport === undefined ? true : includeExport,
            useBigNumberForBN: useBigNumberForBN === undefined ? true : useBigNumberForBN,
            interfaceOrType: useInterfaceInsteadOfTypeDef === undefined
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
            yield (0, promises_1.writeFile)(outputFilePath, res);
        }
    }
    catch (err) {
        process.stderr.write(err);
    }
    process.exit(0);
});
exports.handler = handler;
