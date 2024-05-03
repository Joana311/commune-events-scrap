var _a, _b;
import { NodeType } from './definition.js';
import { redraw_lines } from './link.js';
import { add_node, create_node_element, get_icon, get_node, get_node_element } from './node.js';
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
    event.preventDefault();
};
document.addEventListener('contextmenu', (event) => event.preventDefault());
window.addEventListener('keydown', (event) => keydownResponse(event, state), false);
window.addEventListener('keyup', (event) => keyupResponse(event, state), false);
function keydownResponse(event, state) {
    if (event.key === 'Escape') {
        state.selectedNodeElement = null;
        refresh(state);
    }
    if (event.key === 'd') {
        state.deleting = true;
    }
}
function keyupResponse(event, state) {
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
    button_create === null || button_create === void 0 ? void 0 : button_create.addEventListener('click', (event) => {
        add_node({ x: event.x - 20, y: event.y - 20 }, nodeType, state);
    });
    (button_create === null || button_create === void 0 ? void 0 : button_create.firstElementChild).style.color = get_icon(nodeType).color;
}
// Export
const download = (fileName, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
(_a = document.getElementById('export')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    console.log(state);
    const fileName = 'story.json';
    const dto = { nodes: state.nodes, links: state.links };
    const fileContent = JSON.stringify(dto, null, 2);
    download(fileName, fileContent);
});
// Import
const validJson = (json) => {
    try {
        JSON.parse(json);
    }
    catch (e) {
        return false;
    }
    return true;
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
document.getElementById('inputLoadFile').onchange = (event) => {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    const tempElement = event.target;
    if (tempElement && tempElement.files) {
        reader.readAsText(tempElement.files[0]);
    }
    function onReaderLoad(event) {
        var _a;
        console.log(event);
        if (event.target && event.target.result) {
            const jsonString = event.target.result;
            if (validJson(jsonString)) {
                const jsonObject = JSON.parse(jsonString);
                load(jsonObject, state);
                const button = document.getElementById('button-load');
                button.disabled = true;
                button.innerText = '';
                (_a = document.getElementById('toggle-visibility')) === null || _a === void 0 ? void 0 : _a.click();
            }
        }
    }
};
// Hide / Show All
let toggleVisibility = true;
(_b = document.getElementById('toggle-visibility')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    const accordions = document.getElementsByClassName('accordion');
    for (let i = 0; i < accordions.length; i++) {
        const panel = accordions[i].nextElementSibling;
        if (panel) {
            if (toggleVisibility) {
                // Hide All
                if (panel.style.maxHeight !== '0px') {
                    accordions[i].click();
                }
            }
            else {
                // Show All
                const textarea = panel.getElementsByTagName('textarea')[0];
                const textareaRight = panel.getElementsByTagName('textarea')[1];
                if (panel.style.maxHeight === '0px' &&
                    (textarea.value !== '' || (textareaRight && textareaRight.value !== ''))) {
                    accordions[i].click();
                }
            }
        }
    }
    toggleVisibility = !toggleVisibility;
});
//# sourceMappingURL=story-plan-organizer.js.map