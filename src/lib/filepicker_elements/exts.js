var helpers = require("../reusables/helpers");
var mapping = {};
helpers.each({
    "audio": ["mp3", "wav", "wma", "aiff", "mid", "midi", "mp2"],
    "video": ["wmv", "avi", "mpg", "mpeg", "mp4", "webm", "ogv", "flv", "mov"],
    "pdf": ["pdf"],
    "word_processing": ["doc", "dot", "docx", "dotx", "docm", "dotm", "odt ", "ott", "oth", "odm", "sxw", "stw", "sxg", "sdw", "sgl", "rtf", "hwp", "uot", "wpd", "wps","gdoc"],
    "spreadsheet": ["123", "xls", "xlt", "xla", "xlsx", "xltx", "xlsm", "xltm", "xlam", "xlsb", "ods", "fods", "ots", "sxc", "stc", "sdc", "csv", "uos","gsheet"],
    "presentation": ["ppt", "pot", "pps", "ppa", "pptx", "potx", "ppsx", "ppam", "pptm", "potm", "ppsm", "odp", "fodp", "otp", "sxi", "sti", "sdd", "sdp","gslides"],
    "cad": ["dwg", "dwf", "dxf", "sldprt", "sldasm", "slddrw"],
    "text": ["txt", "log"],
    "image": ["odg", "otg", "odi", "sxd", "std", "sda", "svm", "jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "psd", "eps", "tga", "wmf", "ai", "cgm", "fodg", "jfif", "pbm", "pcd", "pct", "pcx", "pgm", "ppm", "ras", "sgf", "svg","gdraw"],
    "code": ["html", "htm", "sql", "xml", "java", "cpp", "c", "perl", "py", "rb", "php", "js", "css", "applescript", "as3", "as", "bash", "shell", "sh", "cfm", "cfml", "cs", "pas", "dcu", "diff", "patch", "ez", "erl", "groovy", "gvy", "gy", "gsh", "javafx", "jfx", "pl", "pm", "ps1", "ruby", "sass", "scss", "scala", "vb", "vbscript", "xhtml", "xslt"],
    "archive": ["zip", "rar", "tar", "gz", "7z", "bz2", "z", "xz", "ace", "sit", "sitx", "tgz", "apk"],
//    "email": ["msg", "olk14message", "pst", "emlx", "olk14event", "eml", "olk14msgattach", "olk14msgsource"],
}, function (list,mime) {
    helpers.each(list, function (ex) {
        mapping[ex] = mime;
    });
});

var fileext = /.*\.([a-z0-9]*)$/i;

function getExt(name) {
    if (fileext.test(name)) {
        return name.replace(fileext, "$1");
    } else {
        return "";
    }
}

module.exports = {
    getMime: function (name) {
        return mapping[getExt(name)] || "unknown";
    },
    getExt: getExt
}