module.exports = function () {

    function getWindowDimensions() {
        var ret = {
                w: (document.documentElement.clientWidth || window.innerWidth),
                h: (document.documentElement.clientHeight || window.innerHeight)
            },
            dummyNode = document.createElement("div");

        // add remove to force redraw
        // some browsers may ignore workarounds like width=width
        document.body.appendChild(dummyNode);
        document.body.removeChild(dummyNode);

        return {
            w: ret.w,
            h: ret.h
        };
    }

    function Overlay(node) {
        var dim = getWindowDimensions(),
            that = this,
            shown = false;
        node.classList.add('layoutManager-overlay');
        node.addEventListener('click', function (e) {
            if (node === e.target) {
                that.hide();
            }
        });

        this.calc = function (dimension) {
            dim = dimension;
            node.style.width = dim.w + 'px';
            node.style.height = dim.h + 'px';
            if (!shown) {
                node.style.transform = 'translate(' + dim.w + 'px, 0px)';
            }
        }

        this.show = function () {
            shown = true;
            node.style.transform = 'translate(0,0)';
            node.classList.remove('c-hide');
            node.classList.add('c-show');
        }

        this.hide = function () {
            shown = false;
            node.style.transform = 'translate(' + dim.w + 'px, 0px)';
            node.classList.remove('c-show');
            node.classList.add('c-hide');
        }

        this.calc(dim);
        this.hide();
    }
    function hideAllOverlays(id) {
        Object.keys(overlays).forEach(function (key) {
            if (key !== id) {
                overlays[key].hide();
            }
        });
    }


    // saves overlays by id
    var overlays = {},
        resizeListenerQueue = [];

    return {
        /**
         * show a specific overlay
         * @param id
         */
        showOverlay : function (id) {
            hideAllOverlays(id);
            overlays[id].show();
        },
        /**
         * hide a specific overlay
         * @param id
         */
        hideOverlay : function (id) {
            overlays[id].hide();
        },
        /**
         * register a callback which is called if a overlay will hide
         * @param id
         */
        onHideOverlay : function (id) {
            // TODO
        },
        /**
         * register a callback which is called if the window is resizing
         * @param fc
         */
        onWindowResize : function (fc) {
            resizeListenerQueue.push(fc);
        },
        /**
         * Overlay:
         * attr {overlay: id}
         * @param node
         * @param attr
         */
        add : function (node, attr) {
            if (typeof attr === 'object') {
                if (attr.hasOwnProperty('overlay')) {
                    overlays[attr.overlay] = new Overlay(node);
                    resizeListenerQueue.push(overlays[attr.overlay].calc);
                }
            }
        },
        ready : function () {
            window.addEventListener('resize', function BrowserResizeListener() {
                var dim = getWindowDimensions();
                resizeListenerQueue.forEach(function (fc) {fc(dim); });
            });
        }
    }
}