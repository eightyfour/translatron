var messagesExportOverlay = (function() {

	var domNode;
	var codeContent;
	var closeButton;

	function onTransitionEnd(event) {
		if (!domNode.classList.contains('show')) {
			domNode.style.display = 'none';
		}
	}

	/**
	 * whichTransitionEvent
	 * Code by David Walsh
	 * @url http://davidwalsh.name/css-animation-callback
	 * @returns {*}
	 */
	function whichTransitionEvent(){
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		}

		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	}

	return {
		add : function(node) {
			domNode = node;
			domNode.addEventListener(whichTransitionEvent(), onTransitionEnd);

			codeContent = domNode.getElementsByTagName('pre')[0];

			closeButton = domNode.getElementsByClassName('close')[0];
			closeButton.addEventListener('click', this.hide);
		},
		update: function(data) {
			codeContent.innerHTML = JSON.stringify(data, null, 4);
			return this;
		},
		show: function() {
			domNode.style.display = 'block';
			setTimeout(function() {
				domNode.classList.add('animated');
				domNode.classList.add('show');
			}, 16);
			return this;
		},
		hide: function(animated) {
			if (!animated) {
				domNode.classList.remove('animated');
			}
			domNode.classList.remove('show');
			return this;
		}
	}

}());

module.exports = messagesExportOverlay;
