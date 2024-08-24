import InterwordIO from "../io/InterwordIO";
import SubjectBase from "./SubjectBase";
import { colorConfig } from "../config";

export default class InterwordSubject extends SubjectBase {
    protected subjectIO = new InterwordIO();
    public readonly outlineColour = {
        dark: `#${colorConfig.word}`,
        light: "#964d4d",
    } as const;
    public readonly name = "INTERWORD";
    public readonly displayName = "inter-word";
    public readonly jumpPhaseType = "dual-phase";
}
