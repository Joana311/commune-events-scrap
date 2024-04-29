import { Link, Node, Point } from './definition.js';
import { UUID } from './uuid.js';
export declare const get_node: (id: UUID, nodes: Node[]) => Node | undefined;
export declare const get_node_element: (id: UUID) => HTMLDivElement | null;
export declare const calculate_shortest_distance: (node1: Node, node2: Node) => {
    point1: Point;
    point2: Point;
};
export declare const does_link_exist: (nodeId1: UUID, nodeId2: UUID, links: Link[]) => boolean;
