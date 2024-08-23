import CharIO from "../io/CharIO";
import SubjectBase from "./SubjectBase";
import { colorConfig } from "../config";

export default class CharSubject extends SubjectBase {
    protected subjectIO = new CharIO();
    public outlineColour = { 
        dark: `#${colorConfig.char}`,
        light: "#ff8000" 
    } as const;
    public readonly name = "CHAR";
    public readonly displayName = "char";
    public readonly jumpPhaseType = "dual-phase";
}
