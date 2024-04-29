import { UUID } from './uuid.js';

/**
 * Node Type.
 */
export enum NodeType {
  Character,
  Location,
  Organization,
  Plot,
  Story,
  Relation,
}

export enum NodeStatus {
  None,
  Good,
  Maybe,
  Investigate,
  Rejected,
}

export enum CharacterImportance {
  Other,
  Main,
  Supporting,
  Minor,
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

export const CALCULATION_INCREMENT: number = 20;
