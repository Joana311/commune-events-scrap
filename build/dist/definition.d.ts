import { UUID } from './uuid.js';
/**
 * Node Type.
 */
export declare enum NodeType {
    Character = 0,
    Location = 1,
    Organization = 2,
    Plot = 3,
    Relation = 4
}
export declare enum NodeStatus {
    None = 0,
    Good = 1,
    Maybe = 2,
    Investigate = 3,
    Rejected = 4
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
    description: string;
    age: number;
};
export type ManaBorn = Character & {
    manaAmount: number;
    manaRecovery: number;
    manaEfficiency: number;
    manaOutput: number;
    sense: number;
};
export type Location = Node & {
    imageSrc: string;
    description: string;
};
export type Organization = Node & {
    description: string;
};
export type Plot = Node & {
    text: string;
};
export type Relation = Node & {
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
    links: Link[];
    linesCached: HTMLDivElement[];
    selectedNodeElement: HTMLDivElement | null;
    createOngoingLinkId: UUID | null;
    deleting: boolean;
};
export declare const CALCULATION_INCREMENT: number;
