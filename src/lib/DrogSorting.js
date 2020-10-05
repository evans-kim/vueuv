/**
 *
 * @param {Element} root
 * @constructor
 */
export default function DragSorting(root){

    this.container = '.container';
    if(!root){
        root = document;
    }
    this.selected = null;
    this.toolbarHeight = 24;
    this.toolbar = document.createElement('div');
    this.toolbar.style.position ='fixed'
    this.toolbar.style.height = this.toolbarHeight +'px'
    this.toolbar.style.width = '100px'
    this.toolbar.style.border = 'none'
    this.toolbar.style.background = 'rgba(66, 153, 225, 1)'
    this.toolbar.style.color = 'white'
    this.toolbar.style.zIndex = 100
    this.toolbar.innerHTML = '<span style="font-size: 12px; border-right: 1px solid white; padding: 2px;">이동</span><span style="font-size: 12px; border-right: 1px solid white; padding: 2px;">정렬</span>'

    this.dragoverEvent = null;
    this.dragging = null;
    this.root = root
    this.registerClickEvent = (element) =>{
        element.addEventListener('click', (ev)=>{
            this.root.querySelectorAll('.selected-for').forEach(el=>{
                el.classList.remove('selected-for')
            })
            this.selected = ev.target;
            ev.target.classList.add('selected-for')
            const box = ev.target.getBoundingClientRect();
            console.log(box);
            this.toolbar.style.left = ( box.left + box.width - 100 + 3 ) + 'px';
            let height = box.top - this.toolbarHeight;
            if(height < 0){
                height = box.top;
            }
            this.toolbar.style.top = height + 'px';
            document.body.appendChild(this.toolbar)
        });
    }
    this.init = ()=>{

        this.containers = this.root.getElementsByTagName('div')

        this.containers.forEach(container => {
            this.registerClickEvent(container);
        })
    }

    this.removeDiggingClass = ()=>{
        this.root.querySelectorAll('.dragging').forEach((node)=> {
            node.classList.remove('dragging');
        })
    }
    this.dragHandler = (ev)=>{
        console.log('drag-start');
        ev.dataTransfer.setData("text", ev.target.id);
        this.dragging = ev.target;
    }
    this.dropHandler = (ev)=>{
        ev.preventDefault();
        console.log('drop');
        const container = ev.target;
        container.classList.remove('drop-target');

        const afterElement = this.getDragAfterElement(container.childNodes, this.dragoverEvent.clientX,this.dragoverEvent.clientY);
        if (afterElement == null) {
            container.appendChild(this.dragging)
        } else {
            container.insertBefore(this.dragging, afterElement)
        }

        this.dragging = null;
        this.removeDiggingClass();
    }
    this.setInspectable = (element)=>{
        if(element.classList === undefined){
            console.log(element);
            return;
        }
        if(![... element.classList].includes('inspectable')){
            element.classList.add('inspectable')
        }

    }
    this.setContainable = (container)=>{

        container.classList.add('containable');
        container.addEventListener('drop', ev=>{
            ev.preventDefault();
            this.dropHandler(ev);
        })

        container.addEventListener('dragenter', e => {
            e.preventDefault()
            console.log('enter');
            e.target.classList.add('drop-target');

        })
        container.addEventListener('dragleave', e=>{
            e.preventDefault();
            console.log('leave');
            e.target.classList.remove('drop-target');
        })
        container.addEventListener('dragover', ev=>{
            ev.preventDefault();
            this.dragoverEvent = ev;
            this.showDropGuide(container, ev);

        });
    }
    /**
     *
     * @param {HTMLElement} node
     */
    this.setDraggableDom = (node)=>{
        if( this.isTextElement(node)){
            console.log(node);
            return ;
        }
        if(!node.id){
            node.id = Math.random().toString(36).substr(2, 9)
        }
        node.draggable = true;
        node.classList.add('draggable');
        node.addEventListener('dragstart', (ev) => {
            console.log('start');
            node.classList.add('dragging')
            this.dragHandler(ev)
        })

        node.addEventListener('dragend', (ev) => {
            console.log('end', ev.target);
            node.classList.remove('dragging')
        })
    }

    /**
     * @param {HTMLElement} element
     * @param ev
     */
    this.showDropGuide = (element, ev) =>{
        if(this.isTextElement(element)){
            return;
        }
        const box = element.getBoundingClientRect();
        if( box.left < ev.clientX < box.left + box.width &&  box.top < ev.clientY < box.top + box.height ){
            console.log('mouse inside', element.id);
        }
    }
    this.isTextElement = (element)=>{
        return element.nodeName && element.nodeName === '#text' ;
    }
    this.getDragAfterElement = (draggableElements, x, y) => {

        return [...draggableElements].reduce((closest, child) => {
            if(this.isTextElement(child)){
                console.log(child);
                return;
            }
            const box = child.getBoundingClientRect()

            const offsetY = y - box.top - box.height / 2
            const offsetX = x - box.left - box.width / 2

            if ((offsetX < 0 || offsetY < 0 )&& (offsetX > closest.offsetX || offsetY > closest.offsetY)) {
                return { offsetX: offsetX, offsetY:offsetY, element: child }
            } else {
                return closest
            }
        }, { offsetX: Number.NEGATIVE_INFINITY, offsetY: Number.NEGATIVE_INFINITY }).element
    }
}






