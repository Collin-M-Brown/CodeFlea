import WordIO from "../io/WordIO";
import SubjectBase from "./SubjectBase";
import { colorConfig } from "../config";

export default class WordSubject extends SubjectBase {
    protected subjectIO = new WordIO();

    public readonly outlineColour = {
        dark: `#${colorConfig.word}`,
        light: "#964d4d",
    } as const;

    public readonly name = "WORD";
    public readonly displayName = "word";
    public readonly jumpPhaseType = "dual-phase";
}
