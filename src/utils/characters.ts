import * as vscode from 'vscode';
import { IterationOptions } from '../io/SubjectIOBase';
import Enumerable, { enumerable } from './Enumerable';
import { iterLines } from './lines';
import { wordRangeToPosition } from './selectionsAndRanges';
import * as common from "../common";

export function iterCharacters(
    document: vscode.TextDocument,
    options: IterationOptions
): Enumerable<{ char: string; position: vscode.Position }> {
    return enumerable(function* () {
        let first = true;

        const startingPosition = wordRangeToPosition(
            options.startingPosition,
            options.direction
        );

        const withinBounds = (position: vscode.Position) => {
            if (options.bounds) {
                return options.bounds.contains(position);
            } else {
                return true;
            }
        };

        for (const line of iterLines(document, {
            ...options,
            currentInclusive: true,
        })) {
            if (options.direction === common.Direction.forwards) {
                for (
                    let i = first ? startingPosition.character : 0;
                    i < line.text.length;
                    i++
                ) {
                    if (first && !options.currentInclusive) {
                        first = false;
                        continue;
                    }

                    const position = new vscode.Position(line.lineNumber, i);

                    if (!withinBounds(position)) {
                        return;
                    }

                    yield {
                        char: line.text[i],
                        position: position,
                    };

                    first = false;
                }
            } else {
                for (
                    let i = first
                        ? startingPosition.character
                        : line.text.length - 1;
                    i >= 0;
                    i--
                ) {
                    if (first && !options.currentInclusive) {
                        first = false;
                        continue;
                    }

                    const position = new vscode.Position(line.lineNumber, i);

                    if (!withinBounds(position)) {
                        return;
                    }

                    yield {
                        char: line.text[i],
                        position: position,
                    };

                    first = false;
                }
            }

            first = false;
        }
    });
}
