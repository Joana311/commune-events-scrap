import { Node, NodeType, Point, State } from './definition.js';
import { UUID } from './uuid.js';
export declare const get_node: (id: UUID, nodes: Node[]) => Node | undefined;
export declare const get_node_element: (id: UUID) => HTMLDivElement | null;
export declare const add_node: (location: Point, type: NodeType, state: State) => void;
export declare const create_node_element: (node: Node, state: State) => void;
