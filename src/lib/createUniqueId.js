import cloneDeep from "lodash/cloneDeep";

export default function createUid() {
    return Math.random().toString(36).substr(2, 6);
}

export function idRecreate(content) {
    content.id = createUid();
    if (content.contents)
        content.contents.map(con => {
            idRecreate(con);
        });
}

export function cloneContent(content) {
    const deep = cloneDeep(content);
    idRecreate(deep);
    return deep;
}