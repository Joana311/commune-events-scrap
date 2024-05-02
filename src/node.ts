import {
  Character,
  CharacterImportance,
  Color_Hex,
  Event,
  Location,
  Lore,
  Node,
  NodeType,
  Organization,
  Point,
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
    color: '#FFFFFF',
  };

  let node: Node | undefined;
  switch (type) {
    case NodeType.Character:
      {
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
      }
      break;
    case NodeType.Location:
      {
        node = {
          ...base,
          imageSrc: '',
          description: '',
        } as Location;
      }
      break;
    case NodeType.Organization:
      {
        node = {
          ...base,
          objective: '',
          detail: '',
        } as Organization;
      }
      break;
    case NodeType.Event:
      {
        node = {
          ...base,
          detail: '',
        } as Event;
      }
      break;
    case NodeType.Story:
      {
        node = {
          ...base,
          description: '',
        } as Story;
      }
      break;
    case NodeType.Lore:
      {
        node = {
          ...base,
          detail: '',
        } as Lore;
      }
      break;
    default:
      break;
  }

  if (node) {
    state.nodes.push(node);
    validate(state);
  }
};

export const get_icon = (type: NodeType): { color: Color_Hex; backgroundColor: Color_Hex; text: string } => {
  let color: Color_Hex;
  let backgroundColor: Color_Hex = '#DEF4FF';
  switch (type) {
    case NodeType.Character:
      {
        color = '#0000FF';
      }
      break;
    case NodeType.Location:
      {
        color = '#1BD900';
      }
      break;
    case NodeType.Organization:
      {
        color = '#FFA500';
      }
      break;
    case NodeType.Event:
      {
        color = '#FF0000';
      }
      break;
    case NodeType.Story:
      {
        color = '#C700C7';
      }
      break;
    case NodeType.Lore:
      {
        color = '#008080';
      }
      break;
    default:
      {
        color = '#FFFFFF';
      }
      break;
  }

  const text: string = (
    document.getElementById('create-node-' + NodeType[type])?.getElementsByClassName('material-icons')[0] as HTMLElement
  ).innerText;

  return { color, backgroundColor, text };
};

export const create_node_element = (node: Node, state: State): void => {
  const newElement: HTMLDivElement = document.createElement('div');
  const newNodeElement: HTMLDivElement = document.body.appendChild(newElement);
  newNodeElement.id = node.id;
  newNodeElement.className = 'node';
  newNodeElement.style.top = node.location.y + 'px';
  newNodeElement.style.left = node.location.x + 'px';
  newNodeElement.style.borderColor = node.color;

  const icon = get_icon(node.type);
  newNodeElement.innerHTML = `
    <div style="display: flex;">
      <div class='move tooltip'>
        <i class="material-icons" style="user-select: none; font-size: 40px; color: ${icon.color}; background-color: ${icon.backgroundColor};">${icon.text}</i>
        <span class="tooltip-text">${NodeType[node.type]}</span>
      </div>
      <input class='node-name' value='${node.name}'></input>
      <input class="node-color" type="color" value="${node.color}">
    </div>
  `;

  switch (node.type) {
    case NodeType.Character:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Personality</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Character).personality}</textarea>
          </div>
          <button class="accordion">Quirk(s)</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Character).quirk}</textarea>
          </div>
          <button class="accordion">Likes and Dislikes</button>
          <div class="panel" style="max-height: 0px; display: flex;">
            <textarea class="textarea-half" style="padding-left: 1px;">${(node as Character).like}</textarea>
            <textarea class="textarea-half" style="padding-right: 1px;">${(node as Character).dislike}</textarea>
          </div>
          <button class="accordion">Strengths and Weaknesses</button>
          <div class="panel" style="max-height: 0px; display: flex;">
            <textarea class="textarea-half" style="padding-left: 1px;">${(node as Character).strength}</textarea>
            <textarea class="textarea-half" style="padding-right: 1px;">${(node as Character).weakness}</textarea>
          </div>
          <button class="accordion">Flaw(s)</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Character).flaw}</textarea>
          </div>
          <button class="accordion">Motivation(s)</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Character).motivation}</textarea>
          </div>
          <button class="accordion">Other</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Character).other}</textarea>
          </div>
        `;
        const textarea_description = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_description.addEventListener('input', (): void => {
          (node as Location).description = textarea_description.value;
        }, false);
      }
      break;
    case NodeType.Location:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Location).description}</textarea>
          </div>
        `;
        const textarea_description = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_description.addEventListener('input', (): void => {
          (node as Location).description = textarea_description.value;
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
          <button class="accordion">Details</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Organization).detail}</textarea>
          </div>
        `;
        const textarea_objective = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_objective.addEventListener('input', (): void => {
          (node as Organization).objective = textarea_objective.value;
        }, false);
        const textarea_detail = newNodeElement.getElementsByTagName('textarea')[1];
        // prettier-ignore
        textarea_detail.addEventListener('input', (): void => {
          (node as Organization).detail = textarea_detail.value;
        }, false);
      }
      break;
    case NodeType.Event:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Details</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Event).detail}</textarea>
          </div>
        `;
        const textarea_detail = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_detail.addEventListener('input', (): void => {
          (node as Event).detail = textarea_detail.value;
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
        textarea_description.addEventListener('input', (): void => {
          (node as Story).description = textarea_description.value;
        }, false);
      }
      break;
    case NodeType.Lore:
      {
        newNodeElement.innerHTML += `
          <button class="accordion">Details</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${(node as Lore).detail}</textarea>
          </div>
        `;
        const textarea_detail = newNodeElement.getElementsByTagName('textarea')[0];
        // prettier-ignore
        textarea_detail.addEventListener('input', (): void => {
          (node as Lore).detail = textarea_detail.value;
        }, false);





        let newItem = document.createElement("div");
        let newImg = document.createElement("img");
        newItem.appendChild(newImg);
        newNodeElement.appendChild(newItem);
        
        newImg.src = "images/splash.png";
        //newImg.src = ""
        
        





      }
      break;
    default:
      break;
  }

  // addEventListeners need to be after all the += innerHTML
  const input_name = newNodeElement.getElementsByClassName('node-name')[0] as HTMLInputElement;
  // prettier-ignore
  input_name.addEventListener('input', (): void => {
    node.name = input_name.value;
  }, false);

  const input_color = newNodeElement.getElementsByClassName('node-color')[0] as HTMLInputElement;
  // prettier-ignore
  input_color.addEventListener('input', (): void => {
    node.color = input_color.value as Color_Hex;
    newNodeElement.style.borderColor = node.color;
    redraw_lines(state);
  }, false);

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

      const textareas = panel.getElementsByTagName('textarea');
      for (let i = 0; i < textareas.length; i++) {
        const textarea = textareas[i];
        textarea.setAttribute('style', textarea.getAttribute('style') + 'height:' + textarea.scrollHeight + 'px; overflow-y:hidden;');
        textarea.addEventListener(
          'input',
          () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          },
          false,
        );
      }

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
