import { UUID } from './uuid.js';

/**
 * Node Type.
 */
export enum NodeType {
  Character,
  Location,
  Organization,
  Plot,
  Relation,
}

export enum NodeStatus {
  None,
  Good,
  Maybe,
  Investigate,
  Rejected,
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

/*
export type ManaBorn = Character & {
  manaAmount: number;
  manaRecovery: number;
  manaEfficiency: number;
  manaOutput: number;
  sense: number;
};
*/

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
  nodesCached: HTMLDivElement[];
  links: Link[];
  linesCached: HTMLDivElement[];
  selectedNodeElement: HTMLDivElement | null;
  createOngoingLinkId: UUID | null;
  deleting: boolean;
};

export const CALCULATION_INCREMENT: number = 1;
