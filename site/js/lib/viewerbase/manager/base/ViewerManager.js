//>>built
define("esriviewer/manager/base/ViewerManager",["dojo/_base/declare","dojox/storage","dojo/topic","dojo/_base/window","dojo/_base/lang","esri/IdentityManager","../../base/Configurable","../../base/LocationServiceSupport","../../base/DataLoaderSupport","../../ui/tools/ViewerDefaultTools","../../map/MapManager","../../ui/toolbar/ActionsToolbarWidget","../../ui/bookmark/BookmarkController","../../portal/PortalViewerManagerSupportMixin","../../ui/menu/ViewerMenuBar","../../map/geometry/GeometryServiceController","../../ui/accordion/ToolsAccordion","./ViewerManagerUI","esri/SpatialReference","esri/geometry/Extent","./WebMapTemplateConfigurationUtil","esri/urlUtils","esri/arcgis/utils"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17){return _1([_e,_7,_8,_9,_12],{portalContentUrl:"/sharing/rest/content/items",baseConfigurationLoaded:false,forceHideCoreTimeSlider:false,useProxyForConfig:false,useProxyForPositionConfig:false,allowAccordionMove:true,allowAccordionCollapse:true,forceHideAccordionTab:false,configUrl:"config/baseConfig.json",viewerPositioningConfigUrl:"config/viewerPositioning.json",constructor:function(_18){_5.mixin(this,_18||{});this._initializeStorageProvider();var _19=_16.urlToObject(document.location.href);this.appId=_19.query?_19.query.appid:null;this.processConfig();},processConfig:function(){if(this.appId!=null){var _1a=new _15();_1a.loadConfiguration(this.appId).then(_5.hitch(this,this._handleWebMapTemplateConfigurationLoaded));}else{if(this.useProxyForConfig){this.loadProxiedConfig();}else{this.loadConfig();}}},_handleWebMapTemplateConfigurationLoaded:function(_1b){this.handleConfigLoaded(_1b);},handleConfigLoaded:function(_1c){VIEWER_UTILS.debug("Configuration Loaded");this.viewerConfig=_1c;if(_1c.windowTitle){_4.doc.title=_1c.windowTitle;}else{_4.doc.title="JavaScript Map Viewer";}if(this.viewerConfig&&this.viewerConfig.portal!=null&&_5.isObject(this.viewerConfig.portal)&&this.viewerConfig.portal.url){var _1d=this.viewerConfig.portal.url;var _1e=_1d.toLowerCase();if(_1e.indexOf("http://")<0&&_1e.indexOf("https://")<0){_1d="http://"+_1d;}_17.arcgisUrl=VIEWER_UTILS.joinUrl(_1d,this.portalContentUrl);}if(this.useProxyForPositionConfig){this.loadProxiedJson(this.viewerPositioningConfigUrl,_5.hitch(this,this.handleWindowPositionsConfigLoaded),_5.hitch(this,this.handleWindowPositionsConfigLoadFailed));}else{this.loadJson(this.viewerPositioningConfigUrl,_5.hitch(this,this.handleWindowPositionsConfigLoaded),_5.hitch(this,this.handleWindowPositionsConfigLoadFailed));}},startupViewer:function(){this._initListeners();this._createViewerManager();},_initListeners:function(){this.inherited(arguments);_3.subscribe(VIEWER_GLOBALS.EVENTS.MAP.LOADED,_5.hitch(this,this.handleMapLoaded));_3.subscribe(VIEWER_GLOBALS.EVENTS.CONFIGURATION.GET,_5.hitch(this,this.handleGetConfiguration));_3.subscribe(VIEWER_GLOBALS.EVENTS.CONFIGURATION.GET_ENTRY,_5.hitch(this,this.handleGetConfigurationKey));},handleGetConfiguration:function(_1f){if(_1f&&_5.isFunction(_1f)){_1f(this.viewerConfig);}},handleGetConfigurationKey:function(key,_20){if(key!=null&&key!=""&&_20&&_5.isFunction(_20)){_20(this.viewerConfig[key]);}},handleMapLoaded:function(map){this.map=map;if(this._initializePortalSupport!=null&&_5.isFunction(this._initializePortalSupport)){this._initializePortalSupport();}PROJECTION_UTILS.setMapSpatialReference(map.spatialReference);this.loadControllers();this.loadUI();},loadUI:function(){this.inherited(arguments);},_initializePortalSupport:function(){this.inherited(arguments);},loadControllers:function(){if(this.viewerConfig.geometryServiceUrl!=null&&this.viewerConfig.geometryServiceUrl){this.geometryServiceController=new _10();}else{_3.subscribe(VIEWER_GLOBALS.EVENTS.GEOMETRY_SERVICE.EXISTS,_5.hitch(this,function(_21){if(_21!=null&&_5.isFunction(_21)){_21(false);}}));}if(this.viewerConfig.locators!=null&&_5.isArray(this.viewerConfig.locators)){for(var i=0;i<this.viewerConfig.locators.length;i++){this.addLocator(this.viewerConfig.locators[i].url,this.viewerConfig.locators[i].label);}}this._createBookmarkController();},handleWindowPositionsConfigLoaded:function(_22){VIEWER_GLOBALS.windowPositioning=_22;this.createMessagingAndLogging();if(!this.baseConfigurationLoaded){this.handleBaseConfigurationsLoaded();}},handleWindowPositionsConfigLoadFailed:function(){VIEWER_GLOBALS.windowPositioning={};this.createMessagingAndLogging();if(!this.baseConfigurationLoaded){this.handleBaseConfigurationsLoaded();}},createMessagingAndLogging:function(){this._createLoggingWidget();this._createMessagingWidget();},handleBaseConfigurationsLoaded:function(){this.baseConfigurationLoaded=true;this.startupViewer();},_createViewerManager:function(){this._createLayersWidget();this.mapManager=new _b({webMapItem:this.viewerConfig.webMapItem});},_createLayersWidget:function(){this.createLayersWidget();},createLayersWidget:function(){},_createBookmarkController:function(){this.bookmarkController=new _d();},_loadBookmarks:function(){if(_5.isObject(this.viewerConfig.bookmarks)&&this.viewerConfig.bookmarks.url!=null){var _23=_5.hitch(this,function(_24){this._setServerBookmarks(_24);});this.loadJson(this.viewerConfig.bookmarks.url,_23);}this.mainToolbar.loadCookieBookmarks();},_setServerBookmarks:function(_25){this.mainToolbar.addStaticBookmarks(_25);},_initializeStorageProvider:function(){var _26=dojox.storage.manager.getProvider();_26.initialize();},processNavigationToolbarAddons:function(){},createViewerDefaultTools:function(){this.viewerDefaultTools=new _a();this.createAddonTools();this.viewerDefaultTools.createConfigurationMenuItem();},_createViewerAccordion:function(){if(this.viewerConfig.toolsAccordion.create==null||this.viewerConfig.toolsAccordion.create!=false){_3.subscribe(VIEWER_GLOBALS.EVENTS.TOOLS.ACCORDION.LOAD_DEFAULT_TOOLS,_5.hitch(this,this.createDefaultAccordionTools));this.viewerAccordion=new _11({allowCollapse:this.allowAccordionCollapse,movable:this.allowAccordionMove});_3.publish(VIEWER_GLOBALS.EVENTS.PLACEMENT.GLOBAL.PLACE.VIEWER_ACCORDION,this.viewerAccordion);}},_createViewerMainToolbar:function(){this.mainToolbar=new _c();_3.publish(VIEWER_GLOBALS.EVENTS.PLACEMENT.GLOBAL.PLACE.MAIN_TOOLBAR,this.mainToolbar);if(_5.isObject(this.viewerConfig.map)){this.mainToolbar.setBasemaps(this.viewerConfig.map.basemaps);}},createMenuBar:function(){new _f();},createDefaultAccordionTools:function(){},handleToggleAccordion:function(){this.viewerAccordion.toggle();},createAddonTools:function(){}});});