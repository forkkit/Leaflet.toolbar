// A convenience class for built-in popup toolbars.

L.Toolbar = L.Toolbar || {};

L.Toolbar.Popup = L.Toolbar.extend({

	statics: {
		baseClass: L.Toolbar.baseClass + ' leaflet-popup-toolbar'
	},

	initialize: function(latlng, actions, options) {
		L.Toolbar.prototype.initialize.call(this, actions, options);

		var	toolbarOptions = L.extend(this.options, {
				icon: new L.DivIcon({
					html: this.getHTML(),
					className: this.options.className
				})
			});

		this._container = new L.Marker(latlng, toolbarOptions);
	},

	onAdd: function(map) {
		this._map = map;
		this._container.addTo(map);

		this._setStyles();

		L.DomEvent.off(this._container._icon, 'click', this._container._onMouseClick, this._container);
		this.attachHandlers(this._container._icon);

		map.on('click', function() {
			map.removeLayer(this);
		});
	},

	onRemove: function(map) {
		map.removeLayer(this._container);

		delete this._map;
	},

	setLatLng: function(latlng) {
		this._container.setLatLng(latlng);

		return this;
	},

	_onClick: function(event) {
		L.Toolbar.prototype._onClick.call(this, event);

		this._map.removeLayer(this);
	},

	_setStyles: function() {
		var toolbar = this._container._icon.querySelectorAll('.leaflet-toolbar')[0],
			buttons = this._container._icon.querySelectorAll('.leaflet-toolbar-action'),
			toolbarHeight = L.DomUtil.getStyle(toolbar, 'height'),
			toolbarWidth = 0,
			anchor;

		for (var i = 0, l = buttons.length; i < l; i++) {
			toolbarWidth += parseInt(L.DomUtil.getStyle(buttons[i], 'width'), 10);
		}

		toolbar.style.width = toolbarWidth + 'px';
		anchor = new L.Point(toolbarWidth/2, toolbarHeight);
		this._container._icon.style.marginLeft = (-anchor.x) + 'px';
		this._container._icon.style.marginTop = (-anchor.y) + 'px';
	}
	
});