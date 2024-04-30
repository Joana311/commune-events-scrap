import { CharacterImportance, NodeStatus, NodeType, } from './definition.js';
import { randomUUID } from './uuid.js';
import { add_link, redraw_lines } from './link.js';
import { refresh, validate } from './story-plan-organizer.js';
export const get_node = (id, nodes) => {
    let foundNode;
    for (const node of nodes) {
        if (node.id === id) {
            foundNode = node;
            break;
        }
    }
    return foundNode;
};
export const get_node_element = (id) => {
    const htmlElement = document.getElementById(id);
    return htmlElement ? htmlElement : null;
};
export const add_node = (location, type, state) => {
    const base = {
        id: randomUUID(),
        location,
        type,
        name: '',
        status: NodeStatus.None,
        color: '#FFFFFF',
    };
    let node;
    switch (type) {
        case NodeType.Character:
            node = Object.assign(Object.assign({}, base), { imageSrc: '', importance: CharacterImportance.Other, personality: '', quirk: '', like: '', dislike: '', strength: '', weakness: '', flaw: '', motivation: '', other: '' });
            break;
        case NodeType.Location:
            node = Object.assign(Object.assign({}, base), { imageSrc: '', description: '', memorable: '' });
            break;
        case NodeType.Organization:
            node = Object.assign(Object.assign({}, base), { objective: '', description: '' });
            break;
        case NodeType.Plot:
            node = Object.assign(Object.assign({}, base), { description: '', events: '', aftermath: '' });
            break;
        case NodeType.Story:
            node = Object.assign(Object.assign({}, base), { description: '' });
            break;
        case NodeType.Relation:
            node = Object.assign(Object.assign({}, base), { history: '', conflict: '', description: '' });
            break;
        default:
            break;
    }
    if (node) {
        state.nodes.push(node);
        validate(state);
    }
};
export const myFunctionTemp = () => {
    console.log('\n\n\n\n\n\nPOINT_C');
};
export const create_node_element = (node, state) => {
    var _a, _b, _c, _d, _e, _f;
    const newElement = document.createElement('div');
    const newNodeElement = document.body.appendChild(newElement);
    newNodeElement.id = node.id;
    newNodeElement.className = 'node';
    newNodeElement.style.top = node.location.y + 'px';
    newNodeElement.style.left = node.location.x + 'px';
    newNodeElement.style.borderColor = node.color;
    switch (node.type) {
        case NodeType.Character:
            {
                const iconText = ((_a = document.getElementById('create-node-character')) === null || _a === void 0 ? void 0 : _a.getElementsByClassName('material-icons')[0]).innerText;
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
                const iconText = ((_b = document.getElementById('create-node-location')) === null || _b === void 0 ? void 0 : _b.getElementsByClassName('material-icons')[0]).innerText;
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
                const iconText = ((_c = document
                    .getElementById('create-node-organization')) === null || _c === void 0 ? void 0 : _c.getElementsByClassName('material-icons')[0]).innerText;
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
          <p>====================================================</p>
          <button onclick="${myFunctionTemp}">Click me 1</button>
          <button onclick="myFunction()">Click me 2</button>
        `;
            }
            break;
        case NodeType.Plot:
            {
                const iconText = ((_d = document.getElementById('create-node-plot')) === null || _d === void 0 ? void 0 : _d.getElementsByClassName('material-icons')[0]).innerText;
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
                const iconText = ((_e = document.getElementById('create-node-story')) === null || _e === void 0 ? void 0 : _e.getElementsByClassName('material-icons')[0]).innerText;
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
                const iconText = ((_f = document.getElementById('create-node-relation')) === null || _f === void 0 ? void 0 : _f.getElementsByClassName('material-icons')[0]).innerText;
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
const drag_node_element = (element, state) => {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    const moveElement = element.getElementsByClassName('move')[0];
    moveElement.onmousedown = dragMouseDown;
    moveElement.addEventListener('mouseup', (event) => {
        if (event.button === 2) {
            // Right mouse button
            if (element.id && state.createOngoingLinkId) {
                add_link(element.id, state.createOngoingLinkId, state);
            }
            state.createOngoingLinkId = null;
        }
    });
    /**
     *
     * @param event
     */
    function dragMouseDown(event) {
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
        }
        else if (event.button === 2) {
            // Right mouse button
            state.createOngoingLinkId = element.id;
        }
    }
    /**
     *
     * @param event
     */
    function elementDrag(event) {
        event = event || window.event;
        event.preventDefault();
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        const node = get_node(element.id, state.nodes);
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
const delete_node = (nodeElement, state) => {
    if (nodeElement === state.selectedNodeElement) {
        state.selectedNodeElement = null;
    }
    const nodeFound = get_node(nodeElement.id, state.nodes);
    if (nodeFound) {
        const index = state.nodes.indexOf(nodeFound);
        if (index !== -1) {
            state.nodes.splice(index, 1);
        }
    }
    validate(state);
};
//# sourceMappingURL=node.js.map