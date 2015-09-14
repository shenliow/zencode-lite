//Function zencode Usage :
//
// zencode is a html tag generator using a simplify pattern string, the reference can be found by searching "ZenCoding" or "Emmet" from web.
//
//example :
//      zencode("div.block#c01>{click}+a[href=www.pchome.com.tw]{link}^span{to:$}*3")
//      =>
//      <div class="block" id="c01">click<a href="www.pchome.com.tw">link</a></div><span>to:1</span><span>to:2</span><span>to:3</span>
//pattern :
//  . : class setter                                ex: div.block    => <div class="block"></div>
//  # : id setter                                   ex: div#t_01     => <div id="t_01"></div>
//  > : child setter                                ex: div>span     => <div><span></span></div>
//  + : sibling setter                              ex: div+span     => <div></div><span></span>
//  ^ : parent setter                               ex: div>a^span   => <div><a></a></div><span></span>
//  [] : attribute setter                           ex: input[type=checkbox][checked]
//                                                                   => <input type="checkbox" checked>
//  {} : plain text node                            ex: div{text}    => <div>text</div>
//                                                  ex: div>{text}   => <div>text</div>
//  * : repeat for n times                          ex: ol>li*3      => <ol><li></li><li></li><li></li></ol>
//  () : group tags, use with *                     ex: table>(tr>td)*3
//                                                                   => <table><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>
//  $ : auto increase number, use with *            ex: div#t_$$*3   => <div id="t_01"></div><div id="t_02"></div><div id="t_03"></div>
//  @ : auto increase number option, use with $     ex: span{$@-5}*3 => <span>5</span><span>4</span><span>3</span>
//
//  2014 Author SEFI

function zencode(input) {
    var _s = [], _buffer ="", _parenthesis = "", _taglist = [], _grouplist = [], _lastgroup = [], _result = [] ;

    function beginTag(tag, cls, id, attr, content) {
        cls = cls == "" ? "" : " class=\"" + cls.join(" ") + "\"" ;
        id = id == "" ? "" : " id=\"" + id + "\"" ;
        attr = attr == "" ? "" : " " + attr.join(" ") ;
        content = content || "" ;
        return (tag != "" ? '<' + tag + cls + id + attr + '>' : "") + content ;
    }
    
    function closeTag(tag) {
        if(tag) {
            switch(tag.toLowerCase()) {
                case "input":
                case "br":
                case "img":
                case "hr" :
                    return "";
                default :
                    return '</' + tag + '>' ;
            }
        }
        return "" ;
    }
    
    function checkPatternType(str) {
        var char = str.substring(0,1) ;
        switch(char) {
            case "." : return "class" ;
            case "#" : return "id" ;
            case "[" : return "attribute" ;
            case "{" : return "content" ;
            default : return "tag" ;
        }
    }
    
    try {
        for(var s=0, slen = input.length; s<slen; s++) {
            var char = input.substr(s,1) ;
            switch(char) {
                case "{" :
                case "[" :
                    _parenthesis = char ;
                break ;
                case "+" :
                case ">" :
                case "^" :
                case "(" :
                case ")" :
                    if(!_parenthesis) {
                        if(_buffer) {
                            _s.push(_buffer) ;
                            _buffer = "" ;
                        }
                        _s.push(char) ;
                        continue ;
                    }
                break ;
                case "*" :
                    if(_buffer && _parenthesis != "{" && _parenthesis != "[") {
                        _s.push(_buffer) ;
                        _buffer = "" ;
                    }
                case "}" :
                case "]" :
                    if((char == "}" && _parenthesis == "{") || (char == "]" && _parenthesis == "[")) _parenthesis = "" ;
                break ;
            }
            _buffer += char ;
        }
        if(_buffer) {
            _s.push(_buffer) ;
            _buffer = "" ;
        }
        for(var i=0, len=_s.length; i<len; i++) {
            var set = _s[i], tag = "", content = "", id = "", cls = [], attr = [] ;
            switch(set) {
                case ">" :
                break ;
                case "^" :
                    var lasttag = _result[_result.length-1] ;
                    if(lasttag != "" && lasttag.substring(0,2) != "</") _result.push(closeTag(_taglist.pop())) ;
                    _result.push(closeTag(_taglist.pop())) ;
                break ;
                case "+" :
                    var lasttag = _result[_result.length-1] ;
                    if(lasttag != "" && lasttag.substring(0,2) != "</") _result.push(closeTag(_taglist.pop())) ;
                break ;
                case "(" :
                    _grouplist.push([_result.length, _taglist.length]) ;
                break ;
                case ")" :
                    var prevgroup = _grouplist[_grouplist.length-1] ;
                    for(var g = _taglist.length, glen = prevgroup[1]; g > glen; g--) _result.push(closeTag(_taglist.pop())) ;
                    _lastgroup = _result.slice(prevgroup[0]) ;
                break ;
                default:
                    if(set.substring(0,1) == "*") {
                        var times = parseInt(set.substring(1)) ;
                        var repeatTag = [];
                        if(_lastgroup.length) {
                            repeatTag = _lastgroup ;
                            _result.length = _grouplist.pop()[0] ;
                        } else {
                            repeatTag.push(_result.pop(), closeTag(_taglist.pop())) ;
                        }
                        for(var n=0; n<times; n++) {
                            for(var r = 0, rlen = repeatTag.length; r < rlen; r++) {
                                var newTag = repeatTag[r].replace(/(\$+)(?:@(-?)(\d*))?/g, function(match, digs, direction, start){
                                    var count = direction == "-" ? -n : n ;
                                    start = start ? start : (direction == "-" ? times-1 : 0) ;
                                    var v = (count + parseInt(start)).toString() ;
                                    for(var d=0, dlen=digs.length-v.length; d<dlen; d++) v = '0' + v ;
                                    return v ;
                                }) ;
                                _result.push(newTag) ;
                            }
                        }
                    } else {
                        _lastgroup.length = 0 ;
                        var pattern = set.match(/(\{.+\})|(\[.+?\])|([\.#]?[\w\$\@\-]+)/g) ;
                        for(var n=0, nlen=pattern.length; n<nlen; n++) {
                            switch(checkPatternType(pattern[n])) {
                                case "class" :
                                    cls.push(pattern[n].substring(1)) ;
                                break ;
                                case "id" :
                                    id = pattern[n].substring(1) ;
                                break ;
                                case "attribute" :
                                    var a = pattern[n].substring(0, pattern[n].length-1).substring(1) ;
                                    var qualidx = a.indexOf("=") ;
                                    if(qualidx != -1) {
                                        a = [a.substring(0,qualidx), a.substring(qualidx+1)] ;
                                        a[1] = a[1].replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") ;
                                        a = a[0] + "=\"" + a[1] +"\"" ;
                                    }
                                    attr.push(a) ;
                                break ;
                                case "content" :
                                    content = pattern[n].substring(0, pattern[n].length-1).substring(1) ;
                                break ;
                                case "tag" :
                                    tag = pattern[n] ;
                                break ;
                            }
                        }
                        _taglist.push(tag) ;
                        _result.push(beginTag(tag,cls,id,attr,content)) ;
                    }
            }
        }
        for(var i=_taglist.length; i>0; i--) _result.push(closeTag(_taglist.pop())) ;
        return _result.join("") ;
    } catch(e) {
        return false ;
    }
}
