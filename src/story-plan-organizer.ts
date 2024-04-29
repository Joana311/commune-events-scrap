import {
  Character,
  //Color_Hex,
  Link,
  Location,
  //ManaBorn,
  Node,
  //NodePositionResults,
  NodeStatus,
  NodeType,
  Organization,
  Plot,
  Point,
  Relation,
  State,
} from './definition.js';
import { UUID, randomUUID } from './uuid.js';
import { get_node, get_node_element, calculate_shortest_distance, does_link_exist } from './helper.js';

const create_node = (type: NodeType, nodes: Node[]): void => {
  const id: UUID = randomUUID();
  const location: Point = { x: 0, y: 0 };

  let node: Node | undefined;
  switch (type) {
    case NodeType.Character:
      node = {
        id,
        location,
        type: NodeType.Character,
        age: 0,
      } as Character;
      break;
    case NodeType.Location:
      node = {
        id,
        location,
        type: NodeType.Character,
        description: '',
      } as Location;
      break;
    case NodeType.Organization:
      node = {
        id,
        location,
        type: NodeType.Character,
        description: '',
      } as Organization;
      break;
    case NodeType.Plot:
      node = {
        id,
        location,
        type: NodeType.Character,
        text: '',
      } as Plot;
      break;
    case NodeType.Relation:
      node = {
        id,
        location,
        type: NodeType.Character,
        description: '',
      } as Relation;
      break;
    default:
      break;
  }

  if (node) {
    nodes.push(node);
    create_node_element(node, state);
  }
};

const create_node_element = (node: Node, state: State): void => {
  const newElement: HTMLDivElement = document.createElement('div');
  const newNodeElement: HTMLDivElement = document.body.appendChild(newElement);
  newNodeElement.id = node.id;
  newNodeElement.className = 'node';
  newNodeElement.style.top = node.location.y + 'px';
  newNodeElement.style.left = node.location.x + 'px';

  switch (node.type) {
    case NodeType.Character:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Location:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Organization:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Plot:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    case NodeType.Relation:
      newNodeElement.innerHTML = `
        <div class='move'></div>
        <input class='name'></input>
        <p>${node.id}</p>
        <p>this</p>
        <p>DIV</p>
      `;
      break;
    default:
      break;
  }

  drag_node_element(newElement, state);
};

const drag_node_element = (element: HTMLDivElement, state: State): void => {
  let pos1: number = 0;
  let pos2: number = 0;
  let pos3: number = 0;
  let pos4: number = 0;

  const moveElement: HTMLDivElement = element.getElementsByClassName('move')[0] as HTMLDivElement;
  moveElement.onmousedown = dragMouseDown;
  moveElement.addEventListener('mouseup', (event: MouseEvent) => {
    if (event.button === 2) {
      // Right mouse button
      if (element.id && state.createOngoingLinkId) {
        create_link(element.id as UUID, state.createOngoingLinkId, state);
      }
      state.createOngoingLinkId = null;
    }
  });

  /**
   *
   * @param event
   */
  function dragMouseDown(event: MouseEvent): void {
    event = event || window.event;
    event.preventDefault();

    if (event.button === 0) {
      // Left mouse button
      if (state.deleting) {
        delete_node(element, state);
        return;
      }

      if (element !== state.selectedNodeElement) {
        if (state.selectedNodeElement) {
          state.selectedNodeElement.classList.remove('node-selected');
        }
        state.selectedNodeElement = element;
        state.selectedNodeElement.classList.add('node-selected');
      }

      pos3 = event.clientX;
      pos4 = event.clientY;
      document.onmouseup = closeDragElement;

      document.onmousemove = elementDrag;
    } else if (event.button === 2) {
      // Right mouse button
      state.createOngoingLinkId = element.id as UUID;
    }
  }

  /**
   *
   * @param event
   */
  function elementDrag(event: MouseEvent): void {
    event = event || window.event;
    event.preventDefault();

    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;

    const node: Node | undefined = get_node(element.id as UUID, state.nodes);
    if (node) {
      node.location.x = element.offsetLeft - pos1;
      node.location.y = element.offsetTop - pos2;

      element.style.top = node.location.y + 'px';
      element.style.left = node.location.x + 'px';

      redraw_lines(state);
    }
  }

  /**
   *
   */
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
};

const create_line = (nodeId1: UUID, nodeId2: UUID, state: State): void => {
  const node1 = get_node(nodeId1, state.nodes);
  const node2 = get_node(nodeId2, state.nodes);
  if (node1 && node2) {
    const newElement: HTMLDivElement = document.createElement('div');
    const newLine: HTMLDivElement = document.body.appendChild(newElement);
    newLine.className = 'line';

    const points: { point1: Point; point2: Point } = calculate_shortest_distance(node1, node2);
    newLine.innerHTML = `
      <svg width='9999' height='9999'>
        <line x1='${points.point1.x}' y1='${points.point1.y}' x2='${points.point2.x}' y2='${points.point2.y}' style='pointer-events: all; stroke: red; stroke-width: 12;'/>
      </svg>
    `;

    state.linesCached.push(newElement);

    if (newLine.firstElementChild && newLine.firstElementChild.firstElementChild) {
      newLine.firstElementChild.firstElementChild.addEventListener('click', () => {
        if (state.deleting) {
          delete_link(nodeId1, nodeId2, state);
        }
      });
    }
  }
};

const redraw_lines = (state: State): void => {
  for (const line of state.linesCached) {
    line.remove();
  }

  for (const link of state.links) {
    create_line(link.nodeFromId, link.nodeToId, state);
  }
};

const create_link = (nodeId1: UUID, nodeId2: UUID, state: State): void => {
  if (nodeId1 && nodeId2 && !does_link_exist(nodeId1, nodeId2, state.links)) {
    state.links.push({ nodeFromId: nodeId1, nodeToId: nodeId2 });
    redraw_lines(state);
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

const delete_node = (nodeElement: HTMLDivElement, state: State): void => {
  if (nodeElement) {
    const nodeFound: Node | undefined = get_node(nodeElement.id as UUID, state.nodes);
    if (nodeFound) {
      const index = state.nodes.indexOf(nodeFound);
      if (index !== -1) {
        state.nodes.splice(index, 1);
        for (let i = state.links.length - 1; i >= 0; i--) {
          const link: Link = state.links[i];
          if (nodeElement.id === link.nodeFromId || nodeElement.id === link.nodeToId) {
            state.links.splice(i, 1);
          }
        }
        nodeElement.remove();
      }
    }
  }
  clear(state);
};

const clear = (state: State): void => {
  if (state.selectedNodeElement) {
    state.selectedNodeElement.classList.remove('node-selected');
  }
  state.selectedNodeElement = null;

  for (const node of state.nodes) {
    if (node.location.x < 0) {
      node.location.x = 0;
      const nodeElement: HTMLDivElement | null = get_node_element(node.id);
      if (nodeElement) {
        nodeElement.style.left = node.location.x.toString();
      }
    }
    if (node.location.y < 0) {
      node.location.y = 0;
      const nodeElement: HTMLDivElement | null = get_node_element(node.id);
      if (nodeElement) {
        nodeElement.style.top = node.location.y.toString();
      }
    }
  }
  redraw_lines(state);
};

const state: State = {
  nodes: [],
  links: [],
  linesCached: [],
  selectedNodeElement: null,
  createOngoingLinkId: null,
  deleting: false,
};

/*
const nodes: Node[] = [];
const links: Link[] = [];
const linesCached: HTMLDivElement[] = [];
let selectedNodeElement: HTMLDivElement | null = null;
let createOngoingLinkId: UUID | null = null;
let deleting: boolean = false;
*/

state.nodes.push(
  {
    id: 'dc4090ef-6c95-4c24-ac57-ff4126811365',
    location: {
      x: 50,
      y: 100,
    },
    type: NodeType.Character,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    imageSrc: '',
    description: '',
    age: 18,
  } as Character,
  {
    id: 'f6f06d09-986e-43fb-a28c-eb0c1b9d3394',
    location: {
      x: 300,
      y: 500,
    },
    type: NodeType.Location,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    imageSrc: '',
    description: 'This is a description.',
  } as Location,
  {
    id: 'dc7d4b9b-cec0-48a5-af38-f025d96e088d',
    location: {
      x: 300,
      y: 700,
    },
    type: NodeType.Organization,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    description: 'This is a description.',
  } as Organization,
  {
    id: '53b21444-da1e-43a1-a83a-fdf4ba93f0ad',
    location: {
      x: 300,
      y: 900,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    text: 'This is a description.',
  } as Plot,
  {
    id: '22903bda-eedf-406e-b4c4-e857d289f5d9',
    location: {
      x: 300,
      y: 1100,
    },
    type: NodeType.Relation,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    description: 'This is a description.',
  } as Relation,
  {
    id: '018eed2c-431c-4c11-95af-036fe40f4c7a',
    location: {
      x: 500,
      y: 4000,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    text: 'This is a description.',
  } as Plot,
  {
    id: '8ea99741-5b1e-4885-be6f-4e890d8cf684',
    location: {
      x: 500,
      y: 600,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    text: 'This is a description.',
  } as Plot,
  {
    id: '25839240-5f8b-43ec-bf2f-9aca680cdd20',
    location: {
      x: 500,
      y: 800,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    text: 'This is a description.',
  } as Plot,
  {
    id: '4960b134-5e62-4b6b-9e94-84f9d6fa45b1',
    location: {
      x: 500,
      y: 1000,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    text: 'This is a description.',
  } as Plot,
  {
    id: 'bb6a4fd4-74ea-4013-bcf6-b5c35a68ca19',
    location: {
      x: 500,
      y: 1200,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
    text: 'This is a description.',
  } as Plot,
);

for (const node of state.nodes) {
  create_node_element(node, state);
}

state.links.push({
  nodeFromId: 'f6f06d09-986e-43fb-a28c-eb0c1b9d3394',
  nodeToId: 'dc4090ef-6c95-4c24-ac57-ff4126811365',
});
state.links.push({
  nodeFromId: '53b21444-da1e-43a1-a83a-fdf4ba93f0ad',
  nodeToId: '22903bda-eedf-406e-b4c4-e857d289f5d9',
});
state.links.push({
  nodeFromId: 'dc7d4b9b-cec0-48a5-af38-f025d96e088d',
  nodeToId: '22903bda-eedf-406e-b4c4-e857d289f5d9',
});
state.links.push({
  nodeFromId: 'dc7d4b9b-cec0-48a5-af38-f025d96e088d',
  nodeToId: 'dc4090ef-6c95-4c24-ac57-ff4126811365',
});

redraw_lines(state);

document.addEventListener('contextmenu', (event) => event.preventDefault());
window.addEventListener('keydown', (event) => keydownResponse(event, state), false);
window.addEventListener('keyup', (event) => keyupResponse(event, state), false);

/**
 *
 * @param event
 * @param nodes Array of all the nodes.
 * @param links Array of all the links.
 * @param linesCached Array of HTML elements of lines.
 * @param state
 */
function keydownResponse(event: KeyboardEvent, state: State): void {
  if (event.key === 'Escape') {
    clear(state);
  }
  if (event.key === 'd') {
    state.deleting = true;
  }
}

/**
 *
 * @param event
 * @param state
 */
function keyupResponse(event: KeyboardEvent, state: State): void {
  if (event.key === 'd') {
    state.deleting = false;
  }
}

const createNodeButton_Character: HTMLButtonElement = document.getElementById(
  'create-node-character',
) as HTMLButtonElement;
createNodeButton_Character.addEventListener('click', (event: Event) => {
  console.log(event);
  create_node(NodeType.Character, state.nodes);
});

/*
const inputImportFileElement = document.getElementById('input-import-file');
if (inputImportFileElement)
{
  inputImportFileElement.onchange = importFile;
}

function importFile(event: Event): void
{
  const files = this.files;
  console.log(files);
  // TODO: Cache this as save location

  const reader = new FileReader();
  reader.onload = onReaderLoad;
  if (event.target)
  {
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event: ProgressEvent<FileReader>): void
  {
    console.log(event.target.result);
    var obj = JSON.parse(event.target.result);
    console.log(obj);
  }
}
*/
