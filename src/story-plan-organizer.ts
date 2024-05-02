import { Dto, NodeType, State } from './definition.js';
import { UUID } from './uuid.js';
import { add_node, create_node_element, get_icon, get_node, get_node_element } from './node.js';
import { redraw_lines } from './link.js';

export const refresh = (state: State): void => {
  for (const nodeElement of state.nodesCached) {
    if (state.selectedNodeElement) {
      if (nodeElement === state.selectedNodeElement) {
        state.selectedNodeElement.classList.add('node-highlighted');
        state.selectedNodeElement.classList.remove('node-unhighlighted');
      } else {
        nodeElement.classList.remove('node-highlighted');
        nodeElement.classList.add('node-unhighlighted');
      }
    } else {
      nodeElement.classList.remove('node-highlighted');
      nodeElement.classList.remove('node-unhighlighted');
    }
  }

  if (state.selectedNodeElement) {
    const connectedNodeIds: UUID[] = [];
    for (const link of state.links) {
      if (link.nodeFromId === state.selectedNodeElement.id) {
        connectedNodeIds.push(link.nodeToId);
      } else if (link.nodeToId === state.selectedNodeElement.id) {
        connectedNodeIds.push(link.nodeFromId);
      }
    }
    for (const nodeId of connectedNodeIds) {
      const nodeElement = get_node_element(nodeId);
      if (nodeElement) {
        nodeElement.classList.add('node-highlighted');
        nodeElement.classList.remove('node-unhighlighted');
      }
    }
  }

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

const clear = (state: State): void => {
  state.selectedNodeElement = null;

  refresh(state);
};

const load = (dto: Dto, state: State): void => {
  reset(state);

  state.nodes = dto.nodes;
  state.links = dto.links;

  validate(state);
};

const reset = (state: State): void => {
  state.nodes = [];
  for (const nodeElement of state.nodesCached) {
    nodeElement.remove();
  }
  state.links = [];
  for (const lineElement of state.linesCached) {
    lineElement.remove();
  }
  validate(state);
  state.selectedNodeElement = null;
  state.createOngoingLinkId = null;
  state.deleting = false;
};

// Does not handle refreshing, just validating
export const validate = (state: State): void => {
  // Validate node elements
  for (const node of state.nodes) {
    const nodeElement = get_node_element(node.id);
    if (!nodeElement) {
      create_node_element(node, state);
    }
  }
  for (let i = state.nodesCached.length - 1; i >= 0; i--) {
    const nodeElement = state.nodesCached[i];
    const node = get_node(nodeElement.id as UUID, state.nodes);
    if (!node) {
      const index = state.nodesCached.indexOf(nodeElement);
      if (index !== -1) {
        state.nodesCached.splice(index, 1);
      }
      nodeElement.remove();
    }
  }

  // Validate links
  for (let i = state.links.length - 1; i >= 0; i--) {
    const link = state.links[i];

    const validNode1 = get_node(link.nodeFromId, state.nodes) ? true : false;
    const validNode2 = get_node(link.nodeToId, state.nodes) ? true : false;

    if (!validNode1 || !validNode2) {
      state.links.splice(i, 1);
    }
  }

  // Validate highlights and redraw lines
  refresh(state);
};

const state: State = {
  nodes: [],
  nodesCached: [],
  links: [],
  linesCached: [],
  selectedNodeElement: null,
  createOngoingLinkId: null,
  deleting: false,
};

window.onbeforeunload = function (event: BeforeUnloadEvent) {
  console.log(event);
  //event.preventDefault();
};
document.addEventListener('contextmenu', (event) => event.preventDefault());
window.addEventListener('keydown', (event) => keydownResponse(event, state), false);
window.addEventListener('keyup', (event) => keyupResponse(event, state), false);

function keydownResponse(event: KeyboardEvent, state: State): void {
  if (event.key === 'Escape') {
    clear(state);
  }
  if (event.key === 'd') {
    state.deleting = true;
  }
}

function keyupResponse(event: KeyboardEvent, state: State): void {
  if (event.key === 'd') {
    state.deleting = false;
  }
}

for (const nodeType of [
  NodeType.Character,
  NodeType.Location,
  NodeType.Organization,
  NodeType.Event,
  NodeType.Story,
  NodeType.Lore,
]) {
  const button_create = document.getElementById('create-node-' + NodeType[nodeType]);
  button_create?.addEventListener('click', (event: MouseEvent) => {
    add_node({ x: event.x - 20, y: event.y - 20 }, nodeType, state);
  });
  (button_create?.firstElementChild as HTMLElement).style.color = get_icon(nodeType).color;
}

const download = (filename: string, text: string): void => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

document.getElementById('export')?.addEventListener('click', () => {
  console.log(state);

  const fileName: string = 'story.json';
  const dto: Dto = { nodes: state.nodes, links: state.links };
  const fileContent: string = JSON.stringify(dto, null, 2);

  download(fileName, fileContent);
});

const validJson = (json: string): boolean => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};

(document.getElementById('inputLoadFile') as HTMLInputElement).onchange = (event: Event) => {
  const reader = new FileReader();
  reader.onload = onReaderLoad;

  const tempElement = event.target as HTMLInputElement;
  if (tempElement && tempElement.files) {
    reader.readAsText(tempElement.files[0]);
  }

  function onReaderLoad(event: ProgressEvent<FileReader>): void {
    console.log(event);
    if (event.target && event.target.result) {
      const jsonString = event.target.result as string;
      if (validJson(jsonString)) {
        const jsonObject = JSON.parse(jsonString);
        load(jsonObject as Dto, state);
        console.log('\n\n\nPOINT_A');
        console.log(document.getElementById('inputLoadFile'));
        console.log(document.getElementById('inputLoadFile')?.nextElementSibling);
        console.log(document.getElementById('inputLoadFile')?.nextElementSibling as HTMLButtonElement);
        (document.getElementById('inputLoadFile')?.nextElementSibling as HTMLButtonElement).disabled = true;
      }
    }
  }
};
