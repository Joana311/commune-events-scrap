import {
  Character,
  CharacterImportance,
  Color_Hex,
  Location,
  Node,
  NodeStatus,
  NodeType,
  Organization,
  Plot,
  Point,
  Relation,
  State,
  Story,
} from './definition.js';
import { UUID, randomUUID } from './uuid.js';
import { add_link, redraw_lines } from './link.js';
import { refresh, validate } from './story-plan-organizer.js';

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

export const add_node = (location: Point, type: NodeType, state: State): void => {
  const base: Node = {
    id: randomUUID(),
    location,
    type,
    name: '',
    status: NodeStatus.None,
    color: '#FFFFFF',
  };

  let node: Node | undefined;
  switch (type) {
    case NodeType.Character:
      node = {
        ...base,
        imageSrc: '',
        importance: CharacterImportance.Other,
        personality: '',
        quirk: '',
        like: '',
        dislike: '',
        strength: '',
        weakness: '',
        flaw: '',
        motivation: '',
        other: '',
      } as Character;
      break;
    case NodeType.Location:
      node = {
        ...base,
        imageSrc: '',
        description: '',
        memorable: '',
      } as Location;
      break;
    case NodeType.Organization:
      node = {
        ...base,
        objective: '',
        description: '',
      } as Organization;
      break;
    case NodeType.Plot:
      node = {
        ...base,
        description: '',
        events: '',
        aftermath: '',
      } as Plot;
      break;
    case NodeType.Story:
      node = {
        ...base,
        description: '',
      } as Story;
      break;
    case NodeType.Relation:
      node = {
        ...base,
        history: '',
        conflict: '',
        description: '',
      } as Relation;
      break;
    default:
      break;
  }

  if (node) {
    state.nodes.push(node);
    validate(state);
  }
};

export const create_node_element = (node: Node, state: State): void => {
  const newElement: HTMLDivElement = document.createElement('div');
  const newNodeElement: HTMLDivElement = document.body.appendChild(newElement);
  newNodeElement.id = node.id;
  newNodeElement.className = 'node';
  newNodeElement.style.top = node.location.y + 'px';
  newNodeElement.style.left = node.location.x + 'px';
  newNodeElement.style.borderColor = node.color;

  const iconText: string = (
    document
      .getElementById('create-node-' + NodeType[node.type])
      ?.getElementsByClassName('material-icons')[0] as HTMLElement
  ).innerText;
  newNodeElement.innerHTML = `
    <div style="display: flex;">
      <div class='move tooltip'>
        <i class="material-icons" style="user-select: none; font-size: 50px;">${iconText}</i>
        <span class="tooltip-text">${NodeType[node.type]}</span>
      </div>
      <div style="display: flex; flex-direction: column; width: 100%;">
        <div style="display: flex; flex-direction: row;">
          <button class="node-status">${NodeStatus[node.status]}</button>
          <input class="node-color" type="color" value="${node.color}">
        </div>
        <input class='node-name' value='${node.name}'></input>
      </div>
    </div>
  `;
  
  const input_name = newNodeElement.getElementsByClassName('node-name')[0] as HTMLInputElement;
  // prettier-ignore
  input_name.addEventListener('input', () => {
    node.name = input_name.value;
  }, false);

  const button_status = newNodeElement.getElementsByClassName('node-status')[0] as HTMLButtonElement;
  // prettier-ignore
  button_status.addEventListener('click', () => {
    //node.status = NodeStatus[button_status.value];
    node.status = NodeStatus.Investigate;
  }, false);

  const input_color = newNodeElement.getElementsByClassName('node-color')[0] as HTMLInputElement;
  // prettier-ignore
  input_color.addEventListener('change', () => {
    console.log(input_color.value);
    node.color = input_color.value as Color_Hex;
  }, false);



  console.log('\n\n\n\nPOINT_A');
  console.log(input_color);
  console.log('\n\n\n\n');









  switch (node.type) {
    case NodeType.Character:
      {
      }
      break;
    case NodeType.Location:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Location).description}</textarea>
          </div>
          <button class="accordion">Memorable</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Location).memorable}</textarea>
          </div>
        `;
        const textarea_description = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_description.addEventListener('input', () => {
          (node as Location).description = textarea_description.value;
        }, false);
        const textarea_memorable = newNodeElement.getElementsByTagName('textarea')[1];
        // prettier-ignore
        textarea_memorable.addEventListener('input', () => {
          (node as Location).memorable = textarea_memorable.value;
        }, false);
      }
      break;
    case NodeType.Organization:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Objective</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Organization).objective}</textarea>
          </div>
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Organization).description}</textarea>
          </div>
        `;
        const textarea_objective = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_objective.addEventListener('input', () => {
          (node as Organization).objective = textarea_objective.value;
        }, false);
        const textarea_description = newNodeElement.getElementsByTagName('textarea')[1];
        // prettier-ignore
        textarea_description.addEventListener('input', () => {
          (node as Organization).description = textarea_description.value;
        }, false);
      }
      break;
    case NodeType.Plot:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Plot).description}</textarea>
          </div>
          <button class="accordion">Events</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Plot).events}</textarea>
          </div>
          <button class="accordion">Aftermath</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Plot).aftermath}</textarea>
          </div>
        `;
        const textarea_description = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_description.addEventListener('input', () => {
          (node as Plot).description = textarea_description.value;
        }, false);
        const textarea_events = newNodeElement.getElementsByTagName('textarea')[1];
        // prettier-ignore
        textarea_events.addEventListener('input', () => {
          (node as Plot).events = textarea_events.value;
        }, false);
        const textarea_aftermath = newNodeElement.getElementsByTagName('textarea')[2];
        // prettier-ignore
        textarea_aftermath.addEventListener('input', () => {
          (node as Plot).aftermath = textarea_aftermath.value;
        }, false);
      }
      break;
    case NodeType.Story:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Story).description}</textarea>
          </div>
        `;
        const textarea_description = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_description.addEventListener('input', () => {
          (node as Story).description = textarea_description.value;
        }, false);
      }
      break;
    case NodeType.Relation:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">History</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Relation).history}</textarea>
          </div>
          <button class="accordion">Conflict</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Relation).conflict}</textarea>
          </div>
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Relation).description}</textarea>
          </div>
        `;
        const textarea_history = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_history.addEventListener('input', () => {
          (node as Relation).history = textarea_history.value;
        }, false);
        const textarea_conflict = newNodeElement.getElementsByTagName('textarea')[1];
        // prettier-ignore
        textarea_conflict.addEventListener('input', () => {
          (node as Relation).conflict = textarea_conflict.value;
        }, false);
        const textarea_description = newNodeElement.getElementsByTagName('textarea')[2];
        // prettier-ignore
        textarea_description.addEventListener('input', () => {
          (node as Relation).description = textarea_description.value;
        }, false);
      }
      break;
    default:
      break;
  }

  setup_accordions(newNodeElement, state);

  drag_node_element(newElement, state);

  state.nodesCached.push(newElement);
};

const setup_accordions = (nodeElement: HTMLDivElement, state: State): void => {
  const accordions = nodeElement.getElementsByClassName('accordion');
  for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', (): void => {
      accordions[i].classList.toggle('active');
      const panel = accordions[i].nextElementSibling as HTMLDivElement;
      if (panel) {
        if (panel.style.maxHeight === '0px') {
          panel.style.maxHeight = '100%';
        } else {
          panel.style.maxHeight = '0px';
        }
      }

      const textarea = panel.getElementsByTagName('textarea')[0];
      textarea.setAttribute('style', 'height:' + textarea.scrollHeight + 'px; overflow-y:hidden;');
      textarea.addEventListener(
        'input',
        () => {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        },
        false,
      );

      redraw_lines(state);
    });

    const panel = accordions[i].nextElementSibling as HTMLDivElement;
    const textarea = panel.getElementsByTagName('textarea')[0];
    if (textarea.value !== '') {
      (accordions[i] as HTMLElement).click();
    }
  }
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
        add_link(element.id as UUID, state.createOngoingLinkId, state);
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
        state.selectedNodeElement = element;
      }
      refresh(state);

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

const delete_node = (nodeElement: HTMLDivElement, state: State): void => {
  if (nodeElement === state.selectedNodeElement) {
    state.selectedNodeElement = null;
  }
  const nodeFound: Node | undefined = get_node(nodeElement.id as UUID, state.nodes);
  if (nodeFound) {
    const index = state.nodes.indexOf(nodeFound);
    if (index !== -1) {
      state.nodes.splice(index, 1);
    }
  }
  validate(state);
};
