import { Dto, NodeType, State } from './definition.js';
import { redraw_lines } from './link.js';
import { add_node, create_node_element, get_icon, get_node, get_node_element } from './node.js';
import { UUID } from './uuid.js';

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
    if (node.location.y < 110) {
      node.location.y = 110;
      const nodeElement: HTMLDivElement | null = get_node_element(node.id);
      console.log('\n\n\nPOINT_A');
      console.log(nodeElement);
      if (nodeElement) {
        console.log('\n\n\nPOINT_B');
        nodeElement.style.top = node.location.y.toString();
      }
    }
  }

  redraw_lines(state);
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
  event.preventDefault();
};
document.addEventListener('contextmenu', (event: MouseEvent): void => event.preventDefault());
window.addEventListener('keydown', (event: KeyboardEvent): void => keydownResponse(event, state), false);
window.addEventListener('keyup', (event: KeyboardEvent): void => keyupResponse(event, state), false);

function keydownResponse(event: KeyboardEvent, state: State): void {
  if (event.key === 'Escape') {
    state.selectedNodeElement = null;
    refresh(state);
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

// Loading Toolbar create node button icon colors
for (const nodeType of [
  NodeType.Character,
  NodeType.Location,
  NodeType.Organization,
  NodeType.Event,
  NodeType.Story,
  NodeType.Lore,
]) {
  const button_create = document.getElementById('create-node-' + NodeType[nodeType]);
  button_create?.addEventListener('click', (event: MouseEvent): void => {
    add_node({ x: event.pageX, y: event.pageY + 100 }, nodeType, state);
  });
  (button_create?.firstElementChild as HTMLElement).style.color = get_icon(nodeType).color;
}

// Export
const download = (fileName: string, text: string): void => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

document.getElementById('export')?.addEventListener('click', (): void => {
  console.log(state);

  const fileName: string = 'story.json';
  const dto: Dto = { nodes: state.nodes, links: state.links };
  const fileContent: string = JSON.stringify(dto, null, 2);
  download(fileName, fileContent);
});

// Import
const validJson = (json: string): boolean => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
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

(document.getElementById('inputLoadFile') as HTMLInputElement).onchange = (event: Event): void => {
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
        const button = document.getElementById('button-load') as HTMLButtonElement;
        button.disabled = true;
        button.innerText = '';

        // To maximize the textareas the next time user shows all
        document.getElementById('toggle-visibility')?.click();
        document.getElementById('toggle-visibility')?.click();
        document.getElementById('toggle-visibility')?.click();
        document.getElementById('toggle-visibility')?.click();
        document.getElementById('toggle-visibility')?.click();
      }
    }
  }
};

// Hide / Show All
let toggleVisibility: number = 0;
document.getElementById('toggle-visibility')?.addEventListener('click', (): void => {
  const accordions = document.getElementsByClassName('accordion');
  for (let i = 0; i < accordions.length; i++) {
    const panel = accordions[i].nextElementSibling as HTMLDivElement;
    if (panel) {
      if (toggleVisibility % 3 === 0) {
        // Hide All
        if (panel.style.maxHeight !== '0px') {
          (accordions[i] as HTMLElement).click();
        }
      } else if (toggleVisibility % 3 === 1) {
        // Show Events, otherwise Hide
        const id = accordions[i].parentElement?.id;
        if (id && get_node(id as UUID, state.nodes)?.type === NodeType.Event) {
          const textarea: HTMLTextAreaElement = panel.getElementsByTagName('textarea')[0];
          if (panel.style.maxHeight === '0px' && textarea.value !== '') {
            (accordions[i] as HTMLElement).click();
          }
        } else if (panel.style.maxHeight !== '0px') {
          (accordions[i] as HTMLElement).click();
        }
      } else if (toggleVisibility % 3 === 2) {
        // Show All
        const textarea: HTMLTextAreaElement = panel.getElementsByTagName('textarea')[0];
        const textareaRight: HTMLTextAreaElement | undefined = panel.getElementsByTagName('textarea')[1];
        if (
          panel.style.maxHeight === '0px' &&
          (textarea.value !== '' || (textareaRight && textareaRight.value !== ''))
        ) {
          (accordions[i] as HTMLElement).click();
        }
      }
    }
  }
  ++toggleVisibility;
});
