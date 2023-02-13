export function b64toBlob(base64) {
    var mimeString = base64
        .split(",")[0]
        .split(":")[1]
        .split(";")[0]; // mime类型
    var byteString = atob(base64.split(",")[1]); // base64 解码
    var arrayBuffer = new ArrayBuffer(byteString.length); // 创建缓冲数组
    var intArray = new Uint8Array(arrayBuffer); // 创建视图

    for (var i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], { type: mimeString });
}
export function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}
export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}