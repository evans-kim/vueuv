import Sortable from "sortablejs";
import {ContentModel} from "@/types/VueuvTypes";
import createUid, {cloneContent} from "@/lib/createUniqueId.ts"
import Vue from "vue";
import VueuvEditor from "@/components/VueuvEditor.vue";

export interface SortableVue extends Vue{
    $editor: VueuvEditor;
    value: ContentModel;

    move(contents: Array<ContentModel> | undefined, oldIndex: number, newIndex: number): void;
}
export default class SortableContent {
    public vue: SortableVue;
    public options: Sortable.Options;
    private _sortable: Sortable | undefined;

    get editor(){
        return this.vue.$editor
    }

    constructor(vue: SortableVue, options?: Sortable.Options) {
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

    init(element?: HTMLElement) {
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
        this.editor.contentStates.isSorting = true;
    }

    onEnd(evt: Sortable.SortableEvent) {
        this.editor.contentStates.isSorting = false;
    }

    onAdd(evt: Sortable.SortableEvent) {
        const point = this.parseEvent(evt, 'add');
        let contentValue = {
            tag:'div'
        };

        if (this.editor.hasDragBlock()) {
            contentValue = cloneContent(this.editor.contentStates.dragBlock);
            evt.item.remove();
        } else {
            console.log(point.item);
            contentValue = cloneContent(this.editor.getContentValueById(point.item));
            evt.item.remove();
        }
        if(this.vue.value.contents){
            this.vue.value.contents.splice(point.newIndex, 0, contentValue as ContentModel)
        }


    }

    onRemove(evt: Sortable.SortableEvent) {
        const point = this.parseEvent(evt, 'remove');

        if(this.vue.value.contents)
            this.vue.value.contents.splice(point.oldIndex, 1)


    }

    onUpdate(evt: Sortable.SortableEvent) {
        const point = this.parseEvent(evt, 'update');

        this.vue.move(this.vue.value.contents, point.oldIndex, point.newIndex)

    }

}