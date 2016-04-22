module.exports = function Overlay(node, id) {

	var id = id,
		node = node,
		clickHandler = function() {
			console.warn('Click listener not attached for overlay with id: ' + id);
		};

	node.classList.add('displayManager-overlay');
	node.addEventListener('click', function (e) {
		if (node === e.target) {
			clickHandler();
		}
	});

	return {
		id: id,
		node: node,
		onClick: function(cb) {
			clickHandler = cb;
		}
	}
};