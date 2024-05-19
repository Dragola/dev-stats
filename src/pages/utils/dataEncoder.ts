export function encode(obj: Object) : string {
    let objStr = JSON.stringify(obj);
    let objBase64 = btoa(objStr);

    return objBase64
}

export function decode(objBase64: string) : Object {
    let objStr = atob(objBase64)
    let obj = JSON.parse(objStr)

    return obj
}