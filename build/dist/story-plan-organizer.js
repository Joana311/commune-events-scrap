var _a;
import { NodeType } from './definition.js';
import { add_node, create_node_element, get_icon, get_node, get_node_element } from './node.js';
import { redraw_lines } from './link.js';
export const refresh = (state) => {
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
};
const clear = (state) => {
    state.selectedNodeElement = null;
    refresh(state);
};
const load = (dto, state) => {
    reset(state);
    state.nodes = dto.nodes;
    state.links = dto.links;
    validate(state);
};
const reset = (state) => {
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
export const validate = (state) => {
    // Validate node elements
    for (const node of state.nodes) {
        const nodeElement = get_node_element(node.id);
        if (!nodeElement) {
            create_node_element(node, state);
        }
    }
    for (let i = state.nodesCached.length - 1; i >= 0; i--) {
        const nodeElement = state.nodesCached[i];
        const node = get_node(nodeElement.id, state.nodes);
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
const state = {
    nodes: [],
    nodesCached: [],
    links: [],
    linesCached: [],
    selectedNodeElement: null,
    createOngoingLinkId: null,
    deleting: false,
};
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
for (const nodeType of [NodeType.Character, NodeType.Location, NodeType.Organization, NodeType.Event, NodeType.Story, NodeType.Lore]) {
    const button_create_character = document.getElementById('create-node-' + NodeType[nodeType]);
    button_create_character === null || button_create_character === void 0 ? void 0 : button_create_character.addEventListener('click', (event) => {
        add_node({ x: event.x - 20, y: event.y - 20 }, nodeType, state);
    });
    (button_create_character === null || button_create_character === void 0 ? void 0 : button_create_character.firstElementChild).style.color = get_icon(nodeType).color;
}
const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
(_a = document.getElementById('export')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    console.log(state);
    const fileName = 'exported.json';
    const dto = { nodes: state.nodes, links: state.links };
    const fileContent = JSON.stringify(dto, null, 2);
    download(fileName, fileContent);
});
const validJson = (json) => {
    try {
        JSON.parse(json);
    }
    catch (e) {
        return false;
    }
    return true;
};
const inputImportFileElement = document.getElementById('inputImportFile');
if (inputImportFileElement) {
    inputImportFileElement.onchange = (event) => {
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        const temp = event.target;
        if (temp && temp.files) {
            //console.log(event as InputEvent);
            //console.log(event.target as HTMLInputElement);
            reader.readAsText(temp.files[0]);
        }
        /**
         *
         * @param event
         */
        function onReaderLoad(event) {
            console.log(event);
            if (event.target && event.target.result) {
                //console.log(event.target.result);
                const jsonString = event.target.result;
                if (validJson(jsonString)) {
                    const obj = JSON.parse(jsonString);
                    console.log(obj);
                    load(obj, state);
                }
            }
        }
    };
}
//# sourceMappingURL=story-plan-organizer.js.map