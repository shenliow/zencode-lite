# zencode-lite
zencode is a speedy html generation mid-language, it can extend a HTML from a simple description string. it is lite version, I call it zencode-lite.

#usage
Function zencode Usage :

 zencode is a html tag generator using a simplify pattern string, the reference can be found by searching "ZenCoding" or "Emmet" from web.

example :

    zencode("div.block#c01>{click}+a[href=www.pchome.com.tw]{link}^span{to:$}*3")
=>

    <div class="block" id="c01">click<a href="www.pchome.com.tw">link</a></div><span>to:1</span><span>to:2</span><span>to:3</span>

#pattern :
-  **.** : class setter                                ex: `div.block`    => `<div class="block"></div>`
-  **#** : id setter                                   ex: `div#t_01`     => `<div id="t_01"></div>`
-  **>** : child setter                                ex: `div>span`     => `<div><span></span></div>`
-  **+** : sibling setter                              ex: `div+span`     => `<div></div><span></span>`
-  **^** : parent setter                               ex: `div>a^span`   => `<div><a></a></div><span></span>`
-  **[]** : attribute setter                           ex: `input[type=checkbox][checked]`
                                                                   => `<input type="checkbox" checked>`
-  **{}** : plain text node                            ex: `div{text}`    => `<div>text</div>`
                                                  ex: `div>{text}`   => `<div>text</div>`
-  __*__ : repeat for n times                          ex: `ol>li*3`      => `<ol><li></li><li></li><li></li></ol>`
-  **()** : group tags, use with *                     ex: `table>(tr>td)*3`
                                                                   => `<table><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>`
-  **$** : auto increase number, use with *            ex: `div#t_$$*3`   => `<div id="t_01"></div><div id="t_02"></div><div id="t_03"></div>`
-  **@** : auto increase number option, use with $     ex: `span{$@-5}*3` => `<span>5</span><span>4</span><span>3</span>`

  2014 Author SEFI
