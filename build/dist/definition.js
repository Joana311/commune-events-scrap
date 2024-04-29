/**
 * Node Type.
 */
export var NodeType;
(function (NodeType) {
    NodeType[NodeType["Character"] = 0] = "Character";
    NodeType[NodeType["Location"] = 1] = "Location";
    NodeType[NodeType["Organization"] = 2] = "Organization";
    NodeType[NodeType["Plot"] = 3] = "Plot";
    NodeType[NodeType["Story"] = 4] = "Story";
    NodeType[NodeType["Relation"] = 5] = "Relation";
})(NodeType || (NodeType = {}));
export var NodeStatus;
(function (NodeStatus) {
    NodeStatus[NodeStatus["None"] = 0] = "None";
    NodeStatus[NodeStatus["Good"] = 1] = "Good";
    NodeStatus[NodeStatus["Maybe"] = 2] = "Maybe";
    NodeStatus[NodeStatus["Investigate"] = 3] = "Investigate";
    NodeStatus[NodeStatus["Rejected"] = 4] = "Rejected";
})(NodeStatus || (NodeStatus = {}));
export var CharacterImportance;
(function (CharacterImportance) {
    CharacterImportance[CharacterImportance["Other"] = 0] = "Other";
    CharacterImportance[CharacterImportance["Main"] = 1] = "Main";
    CharacterImportance[CharacterImportance["Supporting"] = 2] = "Supporting";
    CharacterImportance[CharacterImportance["Minor"] = 3] = "Minor";
})(CharacterImportance || (CharacterImportance = {}));
export const CALCULATION_INCREMENT = 1;
//# sourceMappingURL=definition.js.map