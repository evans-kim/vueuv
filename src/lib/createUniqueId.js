export default function createUid(){
    return Math.random().toString(36).substr(2, 6);
}