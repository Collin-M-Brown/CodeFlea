import * as vscode from "vscode";
import { SubjectName } from "./subjects/SubjectName";
import { char } from "./utils/quickMenus";

export type ColorConfig = {
    char: string;
    subWord: string;
    word: string;
    line: string;
    block: string;
    bracket: string;
}
export let colorConfig: ColorConfig;

export type JumpConfig = {
    characters: string;
};

export type Config = {
    jump: JumpConfig;
    scrollStep: number;
    defaultSubject: SubjectName;
};

export function loadConfig(): Config {
    const config = vscode.workspace.getConfiguration("codeFlea");
    colorConfig = {
        char: config.get<string>("color.char") || "ff8000",
        subWord: config.get<string>("color.subWord") || "ff6699",
        word: config.get<string>("color.word") || "964d4d",
        line: config.get<string>("color.line") || "8feb34",
        block: config.get<string>("color.block") || "aba246",
        bracket: config.get<string>("color.bracket") || "9900ff",
    };
    return {
        jump: config.get<JumpConfig>("jump")!,
        scrollStep: config.get<number>("scrollStep") || 10,
        defaultSubject: config.get<SubjectName>("defaultSubject") ?? "WORD",
    };
}
