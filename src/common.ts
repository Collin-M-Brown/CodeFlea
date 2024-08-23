import { Config } from "./config";
import * as vscode from "vscode";

export type TextObject = vscode.Range;
export type DirectionOrNearest = Direction | "nearest";
export let lastSkip: Skip | undefined = undefined;
export let column: number = 0;

export type SubTextRange = {
    text: string;
    range: { start: number; end: number };
};

export type Change = "greaterThan" | "lessThan";

export const Direction = {
    backwards: "backwards",
    forwards: "forwards",
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

export const IterationDirection = {
    ...Direction,
    alternate: "alternate",
} as const;

export type IterationDirection =
    typeof IterationDirection[keyof typeof IterationDirection];

export type RelativeIndentation =
    | "more-indentation"
    | "less-indentation"
    | "same-indentation"
    | "no-indentation";

export type IndentationRequest = RelativeIndentation | "any-indentation";

export type JumpPhaseType = "single-phase" | "dual-phase";

export type JumpLocation = {
    jumpCode: string;
    position: vscode.Position;
};

export type Parameter<T> = T extends (arg: infer U) => any ? U : never;

export type ExtensionContext = {
    statusBar: vscode.StatusBarItem;
    config: Config;
    editor: vscode.TextEditor;
};

export type Char = string & { length: 1 };

export function opposite(direction: Direction) {
    return direction === Direction.forwards ? Direction.backwards : Direction.forwards;
}

export function directionToDelta(direction: Direction) {
    return direction === Direction.forwards
        ? (x: number) => x + 1
        : (x: number) => x - 1;
}

export function directionToFactor(direction: Direction) {
    return direction === Direction.forwards ? 1 : -1;
}

export function invert(direction: Direction) {
    return direction === Direction.forwards
        ? Direction.backwards
        : Direction.forwards;
}

export type ColourString = `#${string}`;

export type Skip =
    | { kind: "SkipTo"; char: Char }
    | { kind: "SkipOver"; char?: Char };

export function setLastSkip(skip: Skip | undefined): void {
    lastSkip = skip;
}

export function getLastSkip(): Skip | undefined {
    return lastSkip;
}

export function setVirtualColumn(newColumn: number): void {
    column = newColumn;
}

export function getVirtualColumn(): number {
    return column;
}