import { UUID } from './uuid.js';
/**
 * Node Type.
 */
export declare enum NodeType {
    Character = 0,
    Location = 1,
    Organization = 2,
    Plot = 3,
    Story = 4,
    Relation = 5
}
export declare enum NodeStatus {
    None = 0,
    Good = 1,
    Maybe = 2,
    Investigate = 3,
    Rejected = 4
}
export declare enum CharacterImportance {
    Other = 0,
    Main = 1,
    Supporting = 2,
    Minor = 3
}
/**
 * Point.
 */
export type Point = {
    /**
     * X coordinate.
     */
    x: number;
    /**
     * Y coordinate.
     */
    y: number;
};
export type Color_Hex = `#${string}`;
export type Node = {
    id: UUID;
    location: Point;
    type: NodeType;
    name: string;
    status: NodeStatus;
    color: Color_Hex;
};
export type Character = Node & {
    imageSrc: string;
    importance: CharacterImportance;
    personality: string;
    quirk: string;
    like: string;
    dislike: string;
    strength: string;
    weakness: string;
    flaw: string;
    motivation: string;
    other: string;
};
export type Location = Node & {
    imageSrc: string;
    description: string;
    memorable: string;
};
export type Organization = Node & {
    objective: string;
    description: string;
};
export type Plot = Node & {
    description: string;
    events: string;
    aftermath: string;
};
export type Story = Node & {
    description: string;
};
export type Relation = Node & {
    history: string;
    conflict: string;
    description: string;
};
export type NodePositionResults = {
    top: number;
    bottom: number;
    left: number;
    right: number;
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
};
export type Link = {
    nodeFromId: UUID;
    nodeToId: UUID;
};
export type State = {
    nodes: Node[];
    nodesCached: HTMLDivElement[];
    links: Link[];
    linesCached: HTMLDivElement[];
    selectedNodeElement: HTMLDivElement | null;
    createOngoingLinkId: UUID | null;
    deleting: boolean;
};
export declare const CALCULATION_INCREMENT: number;
