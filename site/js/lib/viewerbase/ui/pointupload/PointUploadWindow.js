//>>built
define("esriviewer/ui/pointupload/PointUploadWindow",["dojo/_base/declare","dojo/_base/lang","dojo/topic","dojo/window","dojo/dom-class","../window/WindowWidget"],function(_1,_2,_3,_4,_5,_6){return _1([_6],{defaultPositioning:{x:510,y:45},windowWidth:"20%",windowHeaderText:"CSV Point Upload",windowIconAltText:"CSV Point Upload",windowIconClass:"commonIcons16 upload",positioningParamName:"pointUpload",constructor:function(){this.firstShowListener=this.on("firstWindowShow",_2.hitch(this,this.handleFirstWindowShow));},handleFirstWindowShow:function(){this.firstShowListener.remove();require(["esriviewer/ui/pointupload/PointUploadWidget"],_2.hitch(this,function(_7){this.pointUploadWidget=new _7();this.setContent(this.pointUploadWidget.domNode);}));},initListeners:function(){this.inherited(arguments);this.subscribes.push(_3.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.POINT_UPLOAD.SHOW,_2.hitch(this,this.show)));this.subscribes.push(_3.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.POINT_UPLOAD.HIDE,_2.hitch(this,this.hide)));this.subscribes.push(_3.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.POINT_UPLOAD.TOGGLE,_2.hitch(this,this.toggle)));}});});