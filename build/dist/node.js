import { NodeType, } from './definition.js';
import { add_link, redraw_lines } from './link.js';
import { refresh, validate } from './story-plan-organizer.js';
import { randomUUID } from './uuid.js';
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
        color: '#FFFFFF',
    };
    let node;
    switch (type) {
        case NodeType.Character:
            {
                node = Object.assign(Object.assign({}, base), { imageSrc: '', personality: '', quirk: '', like: '', dislike: '', strength: '', weakness: '', flaw: '', motivation: '', other: '' });
            }
            break;
        case NodeType.Location:
            {
                node = Object.assign(Object.assign({}, base), { imageSrc: '', description: '' });
            }
            break;
        case NodeType.Organization:
            {
                node = Object.assign(Object.assign({}, base), { objective: '', detail: '' });
            }
            break;
        case NodeType.Event:
            {
                node = Object.assign(Object.assign({}, base), { detail: '' });
            }
            break;
        case NodeType.Story:
            {
                node = Object.assign(Object.assign({}, base), { description: '' });
            }
            break;
        case NodeType.Lore:
            {
                node = Object.assign(Object.assign({}, base), { detail: '' });
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
export const get_icon = (type) => {
    var _a;
    let color;
    const backgroundColor = '#DEF4FF';
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
    const text = ((_a = document.getElementById('create-node-' + NodeType[type])) === null || _a === void 0 ? void 0 : _a.getElementsByClassName('material-icons')[0]).innerText;
    return { color, backgroundColor, text };
};
export const create_node_element = (node, state) => {
    const newElement = document.createElement('div');
    const newNodeElement = document.body.appendChild(newElement);
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
                if (node.imageSrc) {
                    newNodeElement.innerHTML += `
            <img height="100" src="${node.imageSrc}" />
          `;
                }
                newNodeElement.innerHTML += `
          <button class="accordion">Personality</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.personality}</textarea>
          </div>
          <button class="accordion">Quirk(s)</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.quirk}</textarea>
          </div>
          <button class="accordion">Likes and Dislikes</button>
          <div class="panel" style="max-height: 0px; display: flex;">
            <textarea class="textarea-half" style="padding-left: 1px;">${node.like}</textarea>
            <textarea class="textarea-half" style="padding-right: 1px;">${node.dislike}</textarea>
          </div>
          <button class="accordion">Strengths and Weaknesses</button>
          <div class="panel" style="max-height: 0px; display: flex;">
            <textarea class="textarea-half" style="padding-left: 1px;">${node.strength}</textarea>
            <textarea class="textarea-half" style="padding-right: 1px;">${node.weakness}</textarea>
          </div>
          <button class="accordion">Flaw(s)</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.flaw}</textarea>
          </div>
          <button class="accordion">Motivation(s)</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.motivation}</textarea>
          </div>
          <button class="accordion">Other</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.other}</textarea>
          </div>
        `;
                const textarea_personality = newNodeElement.getElementsByTagName('textarea')[0];
                textarea_personality.addEventListener('input', () => {
                    node.personality = textarea_personality.value;
                }, false);
                const textarea_quirk = newNodeElement.getElementsByTagName('textarea')[1];
                textarea_quirk.addEventListener('input', () => {
                    node.quirk = textarea_quirk.value;
                }, false);
                const textarea_like = newNodeElement.getElementsByTagName('textarea')[2];
                textarea_like.addEventListener('input', () => {
                    node.like = textarea_like.value;
                }, false);
                const textarea_dislike = newNodeElement.getElementsByTagName('textarea')[3];
                textarea_dislike.addEventListener('input', () => {
                    node.dislike = textarea_dislike.value;
                }, false);
                const textarea_strength = newNodeElement.getElementsByTagName('textarea')[4];
                textarea_strength.addEventListener('input', () => {
                    node.strength = textarea_strength.value;
                }, false);
                const textarea_weakness = newNodeElement.getElementsByTagName('textarea')[5];
                textarea_weakness.addEventListener('input', () => {
                    node.weakness = textarea_weakness.value;
                }, false);
                const textarea_flaw = newNodeElement.getElementsByTagName('textarea')[6];
                textarea_flaw.addEventListener('input', () => {
                    node.flaw = textarea_flaw.value;
                }, false);
                const textarea_motivation = newNodeElement.getElementsByTagName('textarea')[7];
                textarea_motivation.addEventListener('input', () => {
                    node.motivation = textarea_motivation.value;
                }, false);
                const textarea_other = newNodeElement.getElementsByTagName('textarea')[8];
                textarea_other.addEventListener('input', () => {
                    node.other = textarea_other.value;
                }, false);
            }
            break;
        case NodeType.Location:
            {
                if (node.imageSrc) {
                    newNodeElement.innerHTML += `
            <img height="100" src="${node.imageSrc}" />
          `;
                }
                newNodeElement.innerHTML += `
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.description}</textarea>
          </div>
        `;
                const textarea_description = newNodeElement.getElementsByTagName('textarea')[0];
                textarea_description.addEventListener('input', () => {
                    node.description = textarea_description.value;
                }, false);
            }
            break;
        case NodeType.Organization:
            {
                newNodeElement.innerHTML += `
          <button class="accordion">Objective</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.objective}</textarea>
          </div>
          <button class="accordion">Details</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.detail}</textarea>
          </div>
        `;
                const textarea_objective = newNodeElement.getElementsByTagName('textarea')[0];
                textarea_objective.addEventListener('input', () => {
                    node.objective = textarea_objective.value;
                }, false);
                const textarea_detail = newNodeElement.getElementsByTagName('textarea')[1];
                textarea_detail.addEventListener('input', () => {
                    node.detail = textarea_detail.value;
                }, false);
            }
            break;
        case NodeType.Event:
            {
                newNodeElement.innerHTML += `
          <button class="accordion">Details</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.detail}</textarea>
          </div>
        `;
                const textarea_detail = newNodeElement.getElementsByTagName('textarea')[0];
                textarea_detail.addEventListener('input', () => {
                    node.detail = textarea_detail.value;
                }, false);
            }
            break;
        case NodeType.Story:
            {
                newNodeElement.innerHTML += `
          <button class="accordion">Description</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.description}</textarea>
          </div>
        `;
                const textarea_description = newNodeElement.getElementsByTagName('textarea')[0];
                textarea_description.addEventListener('input', () => {
                    node.description = textarea_description.value;
                }, false);
            }
            break;
        case NodeType.Lore:
            {
                newNodeElement.innerHTML += `
          <button class="accordion">Details</button>
          <div class="panel" style="max-height: 0px;">
            <textarea>${node.detail}</textarea>
          </div>
        `;
                const textarea_detail = newNodeElement.getElementsByTagName('textarea')[0];
                textarea_detail.addEventListener('input', () => {
                    node.detail = textarea_detail.value;
                }, false);
            }
            break;
        default:
            break;
    }
    // addEventListeners need to be after all the += innerHTML
    const input_name = newNodeElement.getElementsByClassName('node-name')[0];
    input_name.addEventListener('input', () => {
        node.name = input_name.value;
    }, false);
    input_name.addEventListener('click', (event) => {
        if (event.button === 1) {
            // Middle mouse button
            console.log('\nI will now hide all accordions\n');
        }
    });
    const input_color = newNodeElement.getElementsByClassName('node-color')[0];
    input_color.addEventListener('input', () => {
        node.color = input_color.value;
        newNodeElement.style.borderColor = node.color;
        redraw_lines(state);
    }, false);
    setup_accordions(newNodeElement, state);
    drag_node_element(newElement, state);
    state.nodesCached.push(newElement);
};
const setup_accordions = (nodeElement, state) => {
    const accordions = nodeElement.getElementsByClassName('accordion');
    for (let i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener('click', () => {
            accordions[i].classList.toggle('active');
            const panel = accordions[i].nextElementSibling;
            if (panel) {
                if (panel.style.maxHeight === '0px') {
                    panel.style.maxHeight = '100%';
                }
                else {
                    panel.style.maxHeight = '0px';
                }
            }
            const textareas = panel.getElementsByTagName('textarea');
            for (let i = 0; i < textareas.length; i++) {
                const textarea = textareas[i];
                textarea.setAttribute('style', textarea.getAttribute('style') + 'height:' + textarea.scrollHeight + 'px; overflow-y:hidden;');
                textarea.addEventListener('input', () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                }, false);
            }
            redraw_lines(state);
        });
        const panel = accordions[i].nextElementSibling;
        const textarea = panel.getElementsByTagName('textarea')[0];
        if (textarea.value !== '') {
            accordions[i].click();
        }
    }
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