import {
  CALCULATION_INCREMENT,
  Character,
  Color_Hex,
  Link,
  Location,
  ManaBorn,
  Node,
  NodePositionResults,
  NodeStatus,
  NodeType,
  Organization,
  Plot,
  Point,
  Relation,
} from 'definition.js';
import { UUID, randomUUID } from './uuid.js';

export const get_node = (id: UUID, nodes: Node[]): Node | undefined => {
  let foundNode;
  for (const node of nodes) {
    if (node.id === id) {
      foundNode = node;
      break;
    }
  }
  return foundNode;
};

export const get_node_element = (id: UUID): HTMLDivElement | null => {
  const htmlElement: HTMLElement | null = document.getElementById(id);
  return htmlElement ? (htmlElement as HTMLDivElement) : null;
};

const calculate_element_positions = (node: Node): NodePositionResults | undefined => {
  const element = get_node_element(node.id);
  if (element) {
    const top = node.location.y;
    const bottom = node.location.y + element.offsetHeight;
    const left = node.location.x;
    const right = node.location.x + element.offsetWidth;

    const topLeft = { x: node.location.x, y: node.location.y };
    const topRight = { x: node.location.x + element.offsetWidth, y: node.location.y };
    const bottomLeft = { x: node.location.x, y: node.location.y + element.offsetHeight };
    const bottomRight = { x: node.location.x + element.offsetWidth, y: node.location.y + element.offsetHeight };

    return { top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight };
  } else {
    return undefined;
  }
};

const calculate_distance = (point1: Point, point2: Point): number => {
  const a = point1.x - point2.x;
  const b = point1.y - point2.y;
  return Math.sqrt(a * a + b * b);
};

const calculate_shortest_distance_2 = (point: Point, node2: Node): { point: Point; distance: number } => {
  const currentShortestPoint = { point: { x: 0, y: 0 }, distance: 999999999999 };

  const nodePositions2: NodePositionResults | undefined = calculate_element_positions(node2);
  if (nodePositions2) {
    // 1. Sweep TopLeft to TopRight
    for (let x = nodePositions2.left; x < nodePositions2.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions2.top };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
    // 2. Sweep TopRight to BottomRight
    for (let y = nodePositions2.top; y < nodePositions2.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions2.right, y: y };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
    // 3. Sweep BottomLeft to BottomRight
    for (let x = nodePositions2.left; x < nodePositions2.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions2.bottom };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
    // 4. Sweep TopLeft to BottomLeft
    for (let y = nodePositions2.top; y < nodePositions2.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions2.left, y: y };
      const distance = calculate_distance(point, tempPoint);
      if (distance < currentShortestPoint.distance) {
        currentShortestPoint.point = tempPoint;
        currentShortestPoint.distance = distance;
      }
    }
  }

  return currentShortestPoint;
};

export const calculate_shortest_distance = (node1: Node, node2: Node): { point1: Point; point2: Point } => {
  const currentShortestPoints = { point1: { x: 0, y: 0 }, point2: { x: 0, y: 0 }, distance: 999999999999 };

  const nodePositions1: NodePositionResults | undefined = calculate_element_positions(node1);
  if (nodePositions1) {
    // 1. Sweep TopLeft to TopRight
    for (let x = nodePositions1.left; x < nodePositions1.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions1.top };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
    // 2. Sweep TopRight to BottomRight
    for (let y = nodePositions1.top; y < nodePositions1.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions1.right, y: y };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
    // 3. Sweep BottomLeft to BottomRight
    for (let x = nodePositions1.left; x < nodePositions1.right; x = x + CALCULATION_INCREMENT) {
      const tempPoint = { x: x, y: nodePositions1.bottom };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
    // 4. Sweep TopLeft to BottomLeft
    for (let y = nodePositions1.top; y < nodePositions1.bottom; y = y + CALCULATION_INCREMENT) {
      const tempPoint = { x: nodePositions1.left, y: y };
      const result: { point: Point; distance: number } = calculate_shortest_distance_2(tempPoint, node2);
      if (result.distance < currentShortestPoints.distance) {
        currentShortestPoints.point1 = tempPoint;
        currentShortestPoints.point2 = result.point;
        currentShortestPoints.distance = result.distance;
      }
    }
  }

  return { point1: currentShortestPoints.point1, point2: currentShortestPoints.point2 };
};

export const does_link_exist = (nodeId1: UUID, nodeId2: UUID, links: Link[]): boolean => {
  for (const link of links) {
    if (
      (nodeId1 === link.nodeFromId && nodeId2 === link.nodeToId) ||
      (nodeId2 === link.nodeFromId && nodeId1 === link.nodeToId)
    ) {
      return true;
    }
  }
  return false;
};
