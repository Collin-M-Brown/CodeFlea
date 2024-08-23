import SubjectBase from "./SubjectBase";
import BracketIO from "../io/BracketIO";
import { colorConfig } from "../config";

export default class InsideBracketSubject extends SubjectBase {
    protected subjectIO = new BracketIO(false);
    public outlineColour = { 
        dark: `#${colorConfig.bracket}`,
        light: "#9900ff" 
    } as const;
    readonly name = "BRACKETS";
    public readonly displayName = "inside brackets";
    public readonly jumpPhaseType = "single-phase";
}
