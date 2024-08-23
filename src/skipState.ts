import { Skip } from './common';

export let lastSkip: Skip | undefined = undefined;
export let column: number = 0;  
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