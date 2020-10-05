import Vue from 'vue';
import {reactive} from "@vue/composition-api";

interface ContentOption {
    name: string;
    icon: string;
    styleProps: {
        [key: string]: any;
        all?: CSSProperty;
        sm?: CSSProperty;
        md?: CSSProperty;
        lg?: CSSProperty;
        xl?: CSSProperty;
    };
    props: {
        [key: string]: {
            type: string;
            default: string | Function | undefined;
        };
    };
}

interface ContentContainer extends Vue {
    contents: Array<ContentFactory>;
}

interface CSSProperty {
    [key: string]: any;
}

export interface StyleProps {
    [key: string]: any;
    id: string;
    all?: CSSProperty;
    sm?: CSSProperty;
    md?: CSSProperty;
    lg?: CSSProperty;
    xl?: CSSProperty;
}

export default class ContentFactory {
    uid: string;
    option: ContentOption;
    instance: Vue | Element | Vue[] | Element[] | undefined;
    data: {
        [key: string]: any;
    };
    selectors: Array<string>;

    constructor(option: ContentOption) {
        this.uid = this.getUniqueName();
        this.option = option;
        this.data = reactive({});
        this.selectors = ['#'+this.uid];
        this.setDefaultData();
    }

    getUniqueName() {
        return Math.random().toString(36).substr(2, 9);
    }

    setDefaultData() {
        const props = Object.keys(this.option.props);
        props.map((prop) => {
            const property = this.option.props[prop];
            let d = '';
            if (property.default) {
                switch (typeof property.default) {
                    case "function":
                        d = property.default();
                        break;
                    default :
                        d = property.default;
                }
            }
            Vue.set(this.data, prop, d)
        })
    }

    appendContent(target: ContentContainer) {
        target.contents.push(this);

        target.$nextTick(() => {
            this.instance = target.$refs[this.uid];

        })
    }
}