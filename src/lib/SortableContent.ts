import Sortable, {MultiDrag, Swap, OnSpill, AutoScroll} from "sortablejs";
import {Editor, ContentRender} from "@/types/VueuvTypes";
import * as cloneDeep from "lodash/cloneDeep"
import createUid from "@/lib/createUniqueId.ts"


export default class SortableContent {
    public vue: ContentRender;
    public options: Sortable.Options;
    private _sortable: Sortable | undefined;

    get editor(): Editor {
        return this.vue.$editor
    }

    constructor(vue: ContentRender, options: Sortable.Options | undefined) {
        this.vue = vue;

        this.options = {
            group: 'content-render',
            ghostClass: 'vueuv-ghost',
            animation: 300
        }

        if (this.vue.value && this.vue.value.contents) {
            const source = {
                onStart: event => {
                    this.onStart(event)
                },
                onEnd: event => {
                    this.onEnd(event)
                },
                onAdd: event => {
                    this.onAdd(event)
                },
                onRemove: event => {
                    this.onRemove(event)
                },
                onUpdate: event => {
                    this.onUpdate(event)
                }
            };
            this.options = Object.assign(this.options, source)
        }

        if (options) {
            this.options = Object.assign(this.options, options);
        }
    }



    setEvent(name, func) {
        this.options[name] = event => {
            func(event)
        }
    }

    init(element: HTMLElement | null) {
        this._sortable = Sortable.create((element) ? element : this.vue.$el as HTMLElement, this.options);
    }

    parseEvent(evt: Sortable.SortableEvent, type) {
        return {
            type: type,
            item: evt.item.getAttribute('data-id'),
            from: evt.from.getAttribute('data-id'),
            to: evt.to.getAttribute('data-id'),
            oldIndex: evt.oldIndex || 0,
            newIndex: evt.newIndex || 0
        };
    }

    idRecreate(content) {
        content.id = createUid();
        if (content.contents)
            content.contents.map(con => {
                this.idRecreate(con);
            });
    }

    onStart(evt: Sortable.SortableEvent) {
        this.editor.states.isSorting = true;
    }

    onEnd(evt: Sortable.SortableEvent) {
        this.editor.states.isSorting = false;
    }

    onAdd(evt: Sortable.SortableEvent) {
        const point = this.parseEvent(evt, 'add');
        let contentValue = {};

        if (this.editor.hasDragBlock()) {
            contentValue = cloneDeep(this.editor.states.dragBlock);
        } else {
            contentValue = this.editor.getContentValueById(point.item);
        }

        this.editor.setRollBackPoint()
        this.vue.value.contents.splice(point.newIndex, 0, contentValue)

        this.vue.updateContents(this.vue.value)
    }

    onRemove(evt: Sortable.SortableEvent) {
        const point = this.parseEvent(evt, 'remove');
        this.editor.setRollBackPoint()
        this.vue.value.contents.splice(point.oldIndex, 1)

        this.vue.updateContents(this.vue.value)

    }

    onUpdate(evt: Sortable.SortableEvent) {
        const point = this.parseEvent(evt, 'update');
        this.editor.setRollBackPoint()
        this.vue.move(this.vue.value.contents, point.oldIndex, point.newIndex)

        this.vue.updateContents(this.vue.value)
    }

}