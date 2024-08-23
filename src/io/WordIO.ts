import * as vscode from "vscode";
import * as common from "../common";
import Seq, { seq } from "../utils/seq";
import * as positions from "../utils/positions";
import * as lineUtils from "../utils/lines";
import {
    positionToRange,
    rangeToPosition,
} from "../utils/selectionsAndRanges";
import * as editor from "../utils/editor";
import SubjectIOBase, { IterationOptions } from "./SubjectIOBase";
import { Direction, TextObject } from "../common";

function iterVertically(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(
        (function* () {
            let cont = true;
            let currentPosition = rangeToPosition(
                options.startingPosition,
                options.direction
            );
            const column = common.getVirtualColumn();
            while (cont) {
                cont = false;
                
                const nextLine = lineUtils.getNextSignificantLine(
                    document,
                    currentPosition,
                    options.direction
                );
                
                currentPosition = currentPosition.with(column);
                if (nextLine) {
                    const newPosition = currentPosition.with(
                        nextLine.lineNumber,
                        column
                    );
                    const wordRange = findWordClosestTo(document, newPosition, {
                        limitToCurrentLine: true,
                    });
                    
                    if (wordRange) {
                        yield wordRange;

                        options.startingPosition = positionToRange(newPosition);
                        cont = true;
                    }
                }
            }
        })
    );
}

function iterHorizontally(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(function* () {
        let searchPosition: vscode.Position | undefined = rangeToPosition(
            options.startingPosition,
            options.direction
        );

        const diff = options.direction === Direction.forwards ? 2 : -2;
        let first = true;
        do {
            const wordRange = document.getWordRangeAtPosition(searchPosition);
            
            if (wordRange) {
                if (!first || options.currentInclusive) {
                    common.setVirtualColumn(searchPosition.character);
                    yield wordRange;
                }
                
                searchPosition = positions.translateWithWrap(
                    document,
                    wordRange[
                        options.direction === Direction.forwards ? "end" : "start"
                    ],
                    diff
                );
            } else {
                searchPosition = positions.translateWithWrap(
                    document,
                    searchPosition,
                    diff
                );
            }
            
            first = false;
        } while (searchPosition);
    });
}

function iterAll(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(function* () {
        let searchPosition: vscode.Position | undefined = rangeToPosition(
            options.startingPosition,
            options.direction
        );

        const diff = options.direction === Direction.forwards ? 2 : -2;
        let first = true;

        do {
            const wordRange = document.getWordRangeAtPosition(searchPosition);

            if (wordRange) {
                if (!first || options.currentInclusive) {
                    yield wordRange;
                }

                searchPosition = positions.translateWithWrap(
                    document,
                    wordRange[
                        options.direction === Direction.forwards ? "end" : "start"
                    ],
                    diff
                );
            } else {
                searchPosition = positions.translateWithWrap(
                    document,
                    searchPosition,
                    diff
                );
            }

            first = false;
        } while (searchPosition);
    });
}

function getContainingWordAt(
    document: vscode.TextDocument,
    position: vscode.Position
): vscode.Range | undefined {
    return document.getWordRangeAtPosition(position);
}

function findWordClosestTo(
    document: vscode.TextDocument,
    position: vscode.Position,
    options: { limitToCurrentLine: boolean }
): vscode.Range {
    const wordUnderCursor = document.getWordRangeAtPosition(position);

    if (wordUnderCursor) {
        return wordUnderCursor;
    }

    const iterObjects = options.limitToCurrentLine ? iterScope : iterAll;

    const wordRange = seq([
        iterObjects(document, {
            startingPosition: position,
            direction: Direction.backwards,
        }).tryFirst(),
        iterObjects(document, {
            startingPosition: position,
            direction: Direction.forwards,
        }).tryFirst(),
    ])
        .filterUndefined()
        .tryMinBy((w) => Math.abs(w.end.line - position.line));

    return wordRange ?? new vscode.Range(position, position);
}

export function swapHorizontally(
    document: vscode.TextDocument,
    edit: vscode.TextEditorEdit,
    range: vscode.Range,
    direction: common.Direction
): vscode.Range {
    const targetWordRange = iterAll(document, {
        startingPosition: range,
        direction,
    }).tryFirst();

    if (targetWordRange) {
        editor.swap(document, edit, range, targetWordRange);

        return targetWordRange;
    }

    return range;
}

export function swapVertically(
    document: vscode.TextDocument,
    edit: vscode.TextEditorEdit,
    range: vscode.Range,
    direction: common.Direction
): vscode.Range {
    const targetWordRange = iterVertically(document, {
        startingPosition: range,
        direction,
    }).tryFirst();

    if (targetWordRange) {
        editor.swap(document, edit, range, targetWordRange);

        return targetWordRange;
    }

    return range;
}

function iterScope(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(function* () {
        let searchPosition: vscode.Position | undefined = rangeToPosition(
            options.startingPosition,
            options.direction
        );

        const startingLine = searchPosition.line;

        const diff = options.direction === Direction.forwards ? 2 : -2;
        let first = true;

        do {
            const wordRange = document.getWordRangeAtPosition(searchPosition);

            if (wordRange) {
                if (options.currentInclusive || !first) {
                    yield wordRange;
                }

                searchPosition = positions.translateWithWrap(
                    document,
                    options.direction === Direction.forwards
                        ? wordRange.end
                        : wordRange.start,
                    diff
                );
            } else {
                searchPosition = positions.translateWithWrap(
                    document,
                    searchPosition,
                    diff
                );
            }

            first = false;
        } while (searchPosition && searchPosition.line === startingLine);
    });
}

export default class WordIO extends SubjectIOBase {
    deletableSeparators = /^[\s,.:=+\-*\/%]+$/;
    defaultSeparationText = " ";

    getContainingObjectAt = getContainingWordAt;

    getClosestObjectTo(
        document: vscode.TextDocument,
        position: vscode.Position
    ) {
        return findWordClosestTo(document, position, {
            limitToCurrentLine: false,
        });
    }

    iterAll = iterAll;
    iterVertically = iterVertically;
    iterHorizontally = iterHorizontally;

    swapHorizontally = swapHorizontally;
    swapVertically = swapVertically;
    iterScope = iterScope;
}
