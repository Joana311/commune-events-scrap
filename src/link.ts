import { CALCULATION_INCREMENT, Link, Node, NodePositionResults, Point, State } from './definition.js';
import { UUID } from './uuid.js';
import { get_node, get_node_element } from './node.js';

const does_link_exist = (nodeId1: UUID, nodeId2: UUID, links: Link[]): boolean => {
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

const calculate_shortest_distance = (node1: Node, node2: Node): { point1: Point; point2: Point } => {
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

const create_line = (nodeId1: UUID, nodeId2: UUID, state: State): void => {
  const node1 = get_node(nodeId1, state.nodes);
  const node2 = get_node(nodeId2, state.nodes);
  if (node1 && node2) {
    const newElement: HTMLDivElement = document.createElement('div');
    const newLine: HTMLDivElement = document.body.appendChild(newElement);
    newLine.className = 'line';

    const points: { point1: Point; point2: Point } = calculate_shortest_distance(node1, node2);
    const gradientId = nodeId1 + '_' + nodeId2;
    newLine.innerHTML = `
        <svg width='9999' height='9999'>
          <defs>
            <linearGradient id="${gradientId}" x1='${points.point1.x}' y1='${points.point1.y}' x2='${points.point2.x}' y2='${points.point2.y}' gradientUnits="userSpaceOnUse">
              <stop stop-color="${node1.color}" offset="0"/>
              <stop stop-color="${node2.color}" offset="1"/>
            </linearGradient>
          </defs>
          <line x1='${points.point1.x}' y1='${points.point1.y}' x2='${points.point2.x}' y2='${points.point2.y}' stroke='url(#${gradientId})' style='pointer-events: all;'/>
        </svg>
      `;

    state.linesCached.push(newElement);

    const lineElement = newLine.getElementsByTagName('line')[0];
    if (lineElement) {
      const nodeElement1 = get_node_element(nodeId1);
      const nodeElement2 = get_node_element(nodeId2);
      if (state.selectedNodeElement) {
        if (nodeElement1 === state.selectedNodeElement || nodeElement2 === state.selectedNodeElement) {
          lineElement.classList.add('line-highlighted');
          lineElement.classList.remove('line-unhighlighted');
        } else {
          lineElement.classList.remove('line-highlighted');
          lineElement.classList.add('line-unhighlighted');
        }
      } else {
        lineElement.classList.remove('line-highlighted');
        lineElement.classList.remove('line-unhighlighted');
      }

      lineElement.addEventListener('click', () => {
        if (state.deleting) {
          delete_link(nodeId1, nodeId2, state);
        }
      });
    }
  }
};

const delete_link = (nodeId1: UUID, nodeId2: UUID, state: State): void => {
  for (let i = state.links.length - 1; i >= 0; i--) {
    const link: Link = state.links[i];
    if (
      (nodeId1 === link.nodeFromId && nodeId2 === link.nodeToId) ||
      (nodeId2 === link.nodeFromId && nodeId1 === link.nodeToId)
    ) {
      state.links.splice(i, 1);
    }
  }
  redraw_lines(state);
};

export const redraw_lines = (state: State): void => {
  for (const line of state.linesCached) {
    line.remove();
  }
  state.linesCached.splice(state.linesCached.length);

  for (const link of state.links) {
    create_line(link.nodeFromId, link.nodeToId, state);
  }
};

export const add_link = (nodeId1: UUID, nodeId2: UUID, state: State): void => {
  if (nodeId1 && nodeId2 && !does_link_exist(nodeId1, nodeId2, state.links)) {
    state.links.push({ nodeFromId: nodeId1, nodeToId: nodeId2 });
    redraw_lines(state);
  }
};
