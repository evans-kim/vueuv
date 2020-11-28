import {ContentModel} from "@/types/VueuvTypes";

interface ContentTemplate {
    label: string;
    value: ContentModel;
}

export default class LocalStore {

    getAll(): Array<ContentTemplate> {
        return JSON.parse( window.localStorage.getItem('vueuv-templates') as string ) || [];
    }

    clear(){
        window.localStorage.setItem('vueuv-templates', '');
    }
    remove(key){
        this.store( this.getAll().filter(item=>item.label !== key) );
    }
    store(templates) {
        window.localStorage.setItem('vueuv-templates', JSON.stringify(templates));
    }

    get(key: string) {
        const parse = JSON.parse( window.localStorage.getItem('vueuv-templates') as string );
        return parse.filter(item => item.label === key);
    }

    set(key: string, value: ContentModel) {

        const templates = this.getAll().filter(item => item.label !== key);
        templates.push({label: key, value: value});

        this.store(templates);
    }
}