import {
  Character,
  CharacterImportance,
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

  switch (node.type) {
    case NodeType.Character:
      {
        const iconText = (
          document.getElementById('create-node-character')?.getElementsByClassName('material-icons')[0] as HTMLElement
        ).innerText;
        newNodeElement.innerHTML = `
          <div style="display: flex;">
            <div class='move'>
              <i class="material-icons" style="user-select: none; font-size: 50px;">${iconText}</i>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; height: 20px;">
                <button id="node-status">${NodeStatus[node.status]}</button>
                <input id="node-color" type="color" value="${node.color}">
              </div>
              <input class='name' value='${node.name}'></input>
            </div>
          </div>
          <p>${node.id}</p>
          <p>this</p>
          <p>DIV</p>
        `;
      }
      break;
    case NodeType.Location:
      {
        const iconText = (
          document.getElementById('create-node-location')?.getElementsByClassName('material-icons')[0] as HTMLElement
        ).innerText;
        newNodeElement.innerHTML = `
          <div style="display: flex;">
            <div class='move'>
              <i class="material-icons" style="user-select: none; font-size: 50px;">${iconText}</i>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; height: 20px;">
                <button id="node-status">${NodeStatus[node.status]}</button>
                <input id="node-color" type="color" value="${node.color}">
              </div>
              <input class='name' value='${node.name}'></input>
            </div>
          </div>
          <p>${node.id}</p>
          <p>this</p>
          <p>DIV</p>
        `;
      }
      break;
    case NodeType.Organization:
      {
        const iconText = (
          document
            .getElementById('create-node-organization')
            ?.getElementsByClassName('material-icons')[0] as HTMLElement
        ).innerText;
        newNodeElement.innerHTML = `
          <div style="display: flex;">
            <div class='move'>
              <i class="material-icons" style="user-select: none; font-size: 50px;">${iconText}</i>
            </div>
            <div style="display: flex; flex-direction: column; width: 100%;">
              <div style="display: flex; flex-direction: row; height: 20px;">
                <button id="node-status">${NodeStatus[node.status]}</button>
                <input id="node-color" type="color" value="${node.color}">
              </div>
              <input class='name' value='${node.name}'></input>
            </div>
          </div>
          <button class="accordion">Objective</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </textarea>
          </div>
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>
              Lorem ip
              sum dolor sit amet, conse
              ctetur adipis
              icing elit, sed do eius
              mod tempor incid
              idunt ut labore et dolore mag
              na aliqua. Ut enim ad mi
              nim veniam, quis nos
              trud exercita
              tion ullamco lab
              oris nisi ut ali
              quip ex ea com
              modo cons
              equat.
            </textarea>
          </div>
        `;
        const accordions = newNodeElement.getElementsByClassName('accordion');
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
            textarea.setAttribute('style', 'height:' + textarea.scrollHeight + 'px;overflow-y:hidden;');
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
      }
      break;
    case NodeType.Plot:
      {
        const iconText = (
          document.getElementById('create-node-plot')?.getElementsByClassName('material-icons')[0] as HTMLElement
        ).innerText;
        newNodeElement.innerHTML = `
          <div style="display: flex;">
            <div class='move'>
              <i class="material-icons" style="user-select: none; font-size: 50px;">${iconText}</i>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; height: 20px;">
                <button id="node-status">${NodeStatus[node.status]}</button>
                <input id="node-color" type="color" value="${node.color}">
              </div>
              <input class='name' value='${node.name}'></input>
            </div>
          </div>
          <p>${node.id}</p>
          <p>this</p>
          <p>DIV</p>
        `;
      }
      break;
    case NodeType.Story:
      {
        const iconText = (
          document.getElementById('create-node-story')?.getElementsByClassName('material-icons')[0] as HTMLElement
        ).innerText;
        newNodeElement.innerHTML = `
          <div style="display: flex;">
            <div class='move'>
              <i class="material-icons" style="user-select: none; font-size: 50px;">${iconText}</i>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; height: 20px;">
                <button id="node-status">${NodeStatus[node.status]}</button>
                <input id="node-color" type="color" value="${node.color}">
              </div>
              <input class='name' value='${node.name}'></input>
            </div>
          </div>
          <p>${node.id}</p>
          <p>this</p>
          <p>DIV</p>
        `;
      }
      break;
    case NodeType.Relation:
      {
        const iconText = (
          document.getElementById('create-node-relation')?.getElementsByClassName('material-icons')[0] as HTMLElement
        ).innerText;
        newNodeElement.innerHTML = `
          <div style="display: flex;">
            <div class='move'>
              <i class="material-icons" style="user-select: none; font-size: 50px;">${iconText}</i>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; height: 20px;">
                <button id="node-status">${NodeStatus[node.status]}</button>
                <input id="node-color" type="color" value="${node.color}">
              </div>
              <input class='name' value='${node.name}'></input>
            </div>
          </div>
          <p>${node.id}</p>
          <p>this</p>
          <p>DIV</p>
        `;
      }
      break;
    default:
      break;
  }

  drag_node_element(newElement, state);

  state.nodesCached.push(newElement);
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
