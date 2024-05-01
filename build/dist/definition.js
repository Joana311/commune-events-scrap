export var NodeType;
(function (NodeType) {
    NodeType["Character"] = "Character";
    NodeType["Location"] = "Location";
    NodeType["Organization"] = "Organization";
    NodeType["Plot"] = "Plot";
    NodeType["Story"] = "Story";
    NodeType["Relation"] = "Relation";
})(NodeType || (NodeType = {}));
export var NodeStatus;
(function (NodeStatus) {
    NodeStatus["None"] = "None";
    NodeStatus["Maybe"] = "Maybe";
    NodeStatus["Good"] = "Good";
    NodeStatus["Investigate"] = "Investigate";
    NodeStatus["Rejected"] = "Rejected";
})(NodeStatus || (NodeStatus = {}));
export var CharacterImportance;
(function (CharacterImportance) {
    CharacterImportance["Other"] = "Other";
    CharacterImportance["Main"] = "Main";
    CharacterImportance["Supporting"] = "Supporting";
    CharacterImportance["Minor"] = "Minor";
})(CharacterImportance || (CharacterImportance = {}));
export const CALCULATION_INCREMENT = 20;
//# sourceMappingURL=definition.js.map