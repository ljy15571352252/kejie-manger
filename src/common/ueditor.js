import "../../static/uedit/ueditor.config.js"
import "../../static/uedit/ueditor.all.js"
import '../../static/uedit/lang/zh-cn/zh-cn.js'
import {profile} from "@/config";

let UEditor = {
    uEditor: null,
    isSetUpload: false,
    init: function(id) {
        UE.delEditor(id);
        this.uEditor = UE.getEditor(id, {
            toolbars: [
                ['fullscreen', 'source', '|', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'strikethrough',
                    'horizontal', 'removeformat', 'formatmatch', '|', 'forecolor',
                    'backcolor', 'insertorderedlist', 'insertunorderedlist',
                    'selectall', '|', 'rowspacingtop', 'rowspacingbottom',
                    'lineheight', '|', 'customstyle', 'paragraph',
                    'fontfamily', 'fontsize', '|', 'directionalityltr',
                    'directionalityrtl', 'indent', '|', 'justifyleft',
                    'justifycenter', 'justifyright', 'justifyjustify', '|',
                    'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    'simpleupload'
                ]
            ],
            enableAutoSave: false,
            enableContextMenu: false,
            elementPathEnabled: false,
            maximumWords: 300,
            imageFieldName: 'file',
            imageActionName: 'uploadimage',
            UEDITOR_HOME_URL: profile.cdnDomain+'/static/uedit/',
            serverUrl: profile.apiHost + "/data/ueditConf",
            initialFrameHeight: 200
        });
        if (!this.isSetUpload) {
            UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
            UE.Editor.prototype.getActionUrl = function(action) {
                if (action === 'uploadimage') {
                    return profile.apiHost + '/upload/img';
                }
                /*else if(action == 'uploadvideo'){
                 return $.baseUrl + '/upload/video';
                 }*/
                else {
                    return this._bkGetActionUrl.call(this, action);
                }
            }
            this.isSetUpload = true;
        }
    },
    getContent: function() {
        return this.uEditor.getContent();
    },
    setInitContent: function(html) {
        this.uEditor.addListener("ready", function() {
            UEditor.setContent(html);
        });
    },
    setContent: function(html) {
        setTimeout(function() {
            UEditor.uEditor.setContent(html);
        }, 500)
    }
}

export { UEditor }
