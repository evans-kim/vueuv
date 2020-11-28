import {ContentRender} from "@/types/VueuvTypes";

class ContentRepository {
    private render: ContentRender;

    constructor(render:ContentRender) {
        this.render = render;
    }

}