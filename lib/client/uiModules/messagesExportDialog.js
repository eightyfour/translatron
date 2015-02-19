var messagesExportDialog = (function() {

	var domNode;
	var codeContent;
	var closeButton;

	function add(node) {
		domNode = node;
		domNode.addEventListener(whichTransitionEvent(), onTransitionEnd);

		codeContent = domNode.getElementsByTagName('pre')[0];

		closeButton = domNode.getElementsByClassName('close')[0];
		closeButton.addEventListener('click', hide);
	}

	function show() {
		domNode.style.display = 'block';
		setTimeout(function() {
			domNode.classList.add('show');
		}, 16);
		return this;
	}

	function hide() {
		domNode.classList.remove('show');
		return this;
	}

	function update(data) {
		codeContent.innerHTML = JSON.stringify(data, null, 4);
		return this;
	}

	function onTransitionEnd(event) {
		console.log('event: ', event);
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
		add : add,
		update: update,
		show: show,
		hide: hide
	}

}());

module.exports = messagesExportDialog;
