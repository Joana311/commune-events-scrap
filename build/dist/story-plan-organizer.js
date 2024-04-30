var _a, _b, _c, _d, _e, _f;
import { CharacterImportance, 
//NodePositionResults,
NodeStatus, NodeType, } from './definition.js';
import { randomUUID } from './uuid.js';
import { get_node, get_node_element, calculate_shortest_distance, does_link_exist } from './helper.js';
const create_node = (location, type, nodes) => {
    const baseNode = {
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
            node = Object.assign(Object.assign({}, baseNode), { imageSrc: '', importance: CharacterImportance.Other, personality: '', quirk: '', like: '', dislike: '', strength: '', weakness: '', flaw: '', motivation: '', other: '' });
            break;
        case NodeType.Location:
            node = Object.assign(Object.assign({}, baseNode), { imageSrc: '', description: '', memorable: '' });
            break;
        case NodeType.Organization:
            node = Object.assign(Object.assign({}, baseNode), { objective: '', description: '' });
            break;
        case NodeType.Plot:
            node = Object.assign(Object.assign({}, baseNode), { description: '', events: '', aftermath: '' });
            break;
        case NodeType.Story:
            node = Object.assign(Object.assign({}, baseNode), { description: '' });
            break;
        case NodeType.Relation:
            node = Object.assign(Object.assign({}, baseNode), { history: '', conflict: '', description: '' });
            break;
        default:
            break;
    }
    if (node) {
        nodes.push(node);
        create_node_element(node, state);
    }
};
const create_node_element = (node, state) => {
    const newElement = document.createElement('div');
    const newNodeElement = document.body.appendChild(newElement);
    newNodeElement.id = node.id;
    newNodeElement.className = 'node';
    newNodeElement.style.top = node.location.y + 'px';
    newNodeElement.style.left = node.location.x + 'px';
    newNodeElement.style.borderColor = node.color;
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
                create_link(element.id, state.createOngoingLinkId, state);
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
const create_line = (nodeId1, nodeId2, state) => {
    const node1 = get_node(nodeId1, state.nodes);
    const node2 = get_node(nodeId2, state.nodes);
    if (node1 && node2) {
        const newElement = document.createElement('div');
        const newLine = document.body.appendChild(newElement);
        newLine.className = 'line';
        const points = calculate_shortest_distance(node1, node2);
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
                }
                else {
                    lineElement.classList.remove('line-highlighted');
                    lineElement.classList.add('line-unhighlighted');
                }
            }
            else {
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
const redraw_lines = (state) => {
    for (const line of state.linesCached) {
        line.remove();
    }
    state.linesCached.splice(state.linesCached.length);
    for (const link of state.links) {
        create_line(link.nodeFromId, link.nodeToId, state);
    }
};
const create_link = (nodeId1, nodeId2, state) => {
    if (nodeId1 && nodeId2 && !does_link_exist(nodeId1, nodeId2, state.links)) {
        state.links.push({ nodeFromId: nodeId1, nodeToId: nodeId2 });
        redraw_lines(state);
    }
};
const delete_link = (nodeId1, nodeId2, state) => {
    for (let i = state.links.length - 1; i >= 0; i--) {
        const link = state.links[i];
        if ((nodeId1 === link.nodeFromId && nodeId2 === link.nodeToId) ||
            (nodeId2 === link.nodeFromId && nodeId1 === link.nodeToId)) {
            state.links.splice(i, 1);
        }
    }
    redraw_lines(state);
};
const delete_node = (nodeElement, state) => {
    if (nodeElement) {
        const indexElement = state.nodesCached.indexOf(nodeElement);
        if (indexElement !== -1) {
            state.nodesCached.splice(indexElement, 1);
        }
        const nodeFound = get_node(nodeElement.id, state.nodes);
        if (nodeFound) {
            const index = state.nodes.indexOf(nodeFound);
            if (index !== -1) {
                state.nodes.splice(index, 1);
                for (let i = state.links.length - 1; i >= 0; i--) {
                    const link = state.links[i];
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
const refresh = (state) => {
    for (const nodeElement of state.nodesCached) {
        if (state.selectedNodeElement) {
            if (nodeElement === state.selectedNodeElement) {
                state.selectedNodeElement.classList.add('node-highlighted');
                state.selectedNodeElement.classList.remove('node-unhighlighted');
            }
            else {
                nodeElement.classList.remove('node-highlighted');
                nodeElement.classList.add('node-unhighlighted');
            }
        }
        else {
            nodeElement.classList.remove('node-highlighted');
            nodeElement.classList.remove('node-unhighlighted');
        }
    }
    if (state.selectedNodeElement) {
        const connectedNodeIds = [];
        for (const link of state.links) {
            if (link.nodeFromId === state.selectedNodeElement.id) {
                connectedNodeIds.push(link.nodeToId);
            }
            else if (link.nodeToId === state.selectedNodeElement.id) {
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
            const nodeElement = get_node_element(node.id);
            if (nodeElement) {
                nodeElement.style.left = node.location.x.toString();
            }
        }
        if (node.location.y < 0) {
            node.location.y = 0;
            const nodeElement = get_node_element(node.id);
            if (nodeElement) {
                nodeElement.style.top = node.location.y.toString();
            }
        }
    }
    redraw_lines(state);
    console.log(state);
};
const clear = (state) => {
    state.selectedNodeElement = null;
    refresh(state);
};
const state = {
    nodes: [],
    nodesCached: [],
    links: [],
    linesCached: [],
    selectedNodeElement: null,
    createOngoingLinkId: null,
    deleting: false,
};
state.nodes.push({
    id: 'dc4090ef-6c95-4c24-ac57-ff4126811365',
    location: {
        x: 50,
        y: 100,
    },
    type: NodeType.Character,
    name: '',
    status: NodeStatus.None,
    color: '#FF0000',
    imageSrc: '',
    importance: CharacterImportance.Main,
    personality: '',
    quirk: '',
    like: '',
    dislike: '',
    strength: '',
    weakness: '',
    flaw: '',
    motivation: '',
    other: '',
}, {
    id: 'f6f06d09-986e-43fb-a28c-eb0c1b9d3394',
    location: {
        x: 100,
        y: 300,
    },
    type: NodeType.Location,
    name: '',
    status: NodeStatus.None,
    color: '#0000FF',
    imageSrc: '',
    description: 'This is a description.',
    memorable: '',
}, {
    id: 'dc7d4b9b-cec0-48a5-af38-f025d96e088d',
    location: {
        x: 100,
        y: 550,
    },
    type: NodeType.Organization,
    name: '',
    status: NodeStatus.None,
    color: '#00FF00',
    objective: '',
    description: 'This is a description.',
}, {
    id: '53b21444-da1e-43a1-a83a-fdf4ba93f0ad',
    location: {
        x: 100,
        y: 800,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#00FFFF',
    description: 'This is a description.',
    events: '',
    aftermath: '',
}, {
    id: '22903bda-eedf-406e-b4c4-e857d289f5d9',
    location: {
        x: 100,
        y: 1050,
    },
    type: NodeType.Relation,
    name: '',
    status: NodeStatus.None,
    color: '#FF00FF',
    history: '',
    conflict: '',
    description: '',
}, {
    id: '018eed2c-431c-4c11-95af-036fe40f4c7a',
    location: {
        x: 500,
        y: 150,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FFFF00',
    description: 'This is a description.',
    events: '',
    aftermath: '',
}, {
    id: '8ea99741-5b1e-4885-be6f-4e890d8cf684',
    location: {
        x: 500,
        y: 400,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#66FF00',
    description: 'This is a description.',
    events: '',
    aftermath: '',
}, {
    id: '25839240-5f8b-43ec-bf2f-9aca680cdd20',
    location: {
        x: 500,
        y: 650,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FF6600',
    description: 'This is a description.',
    events: '',
    aftermath: '',
}, {
    id: '4960b134-5e62-4b6b-9e94-84f9d6fa45b1',
    location: {
        x: 500,
        y: 950,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#FF0066',
    description: 'This is a description.',
    events: '',
    aftermath: '',
}, {
    id: 'bb6a4fd4-74ea-4013-bcf6-b5c35a68ca19',
    location: {
        x: 500,
        y: 1200,
    },
    type: NodeType.Plot,
    name: '',
    status: NodeStatus.None,
    color: '#6600FF',
    description: 'This is a description.',
    events: '',
    aftermath: '',
});
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
window.onbeforeunload = function (event) {
    console.log(event);
    //event.preventDefault();
};
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
function keydownResponse(event, state) {
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
function keyupResponse(event, state) {
    if (event.key === 'd') {
        state.deleting = false;
    }
}
(_a = document.getElementById('create-node-character')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (event) => {
    create_node({ x: event.x - 5, y: event.y - 5 }, NodeType.Character, state.nodes);
});
(_b = document.getElementById('create-node-location')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (event) => {
    create_node({ x: event.x - 5, y: event.y - 5 }, NodeType.Location, state.nodes);
});
(_c = document.getElementById('create-node-organization')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', (event) => {
    create_node({ x: event.x - 5, y: event.y - 5 }, NodeType.Organization, state.nodes);
});
(_d = document.getElementById('create-node-plot')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', (event) => {
    create_node({ x: event.x - 5, y: event.y - 5 }, NodeType.Plot, state.nodes);
});
(_e = document.getElementById('create-node-story')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', (event) => {
    create_node({ x: event.x - 5, y: event.y - 5 }, NodeType.Story, state.nodes);
});
(_f = document.getElementById('create-node-relation')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', (event) => {
    create_node({ x: event.x - 5, y: event.y - 5 }, NodeType.Relation, state.nodes);
});
window.URL = window.URL || window.webkitURL;
const exportButton = document.getElementById('export');
if (exportButton) {
    console.log(state);
    const fileName = 'myfile.txt';
    const fileContent = JSON.stringify(state.nodes[0]);
    const myFile = new Blob([fileContent], { type: 'application/json' });
    exportButton.setAttribute('href', window.URL.createObjectURL(myFile));
    exportButton.setAttribute('download', fileName);
}
/*
exportButton?.addEventListener('click', () => {
});
*/
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
//# sourceMappingURL=story-plan-organizer.js.map