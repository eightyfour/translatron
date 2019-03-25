var Overlay = require('./overlay'),
	displayManager = function() {

		var mainController = canny.flowControl,
			overlayController = canny.flowControl.createNewInstance('overlays'),
			children = {
				overlay: {
					ids: [],
					controller: overlayController,
					add: function(node, id) {

						var overlay = new Overlay(node, id);
						overlay.onClick(function() {
							setDisplayStateById(id, false);
						});

						this.controller.add(overlay.node, {
							'view': overlay.id
						});
						this.ids.push(overlay.id);
					}
				},
				view: {
					ids: [],
					controller: mainController,
					add: function(node, id) {
						this.controller.add(node, {
							'view': id
						});
						this.ids.push(id);
					}
				}
			};

		function setDisplayStateById(id, show) {
			Object.keys(children).map(function(type) {
				var pool = children[type],
					ids = pool.ids,
					currentId;

				for (var i = 0; i < ids.length; i++) {
					currentId = ids[i];
					if (id === currentId) {
						if (show) {
							pool.controller.show(currentId);
						}
						else if (pool.controller.mod[id]) {
							pool.controller.mod[id].forEach(function(obj) {
								obj.hide();
							});
						}
						break;
					}
				}
			});
		}

		return {
			add: function(node, descriptor) {
				var keys, key;
				if (typeof descriptor === 'object') {
					keys = Object.keys(descriptor);
					for (var i = 0; i < keys.length; i++) {
						key = keys[i];
						if (children.hasOwnProperty(key)) {
							children[key].add(node, descriptor[key]);
						}
					}
				}
				else {
					console.warn('Parameter to add child to displayManager is not valid: ' + descriptor);
				}
			},
			show: function(id) {
				setDisplayStateById(id, true);
			},
			hide: function(id) {
				setDisplayStateById(id, false);
			}

		};
	};

module.exports = displayManager;