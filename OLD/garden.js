/**
 * @blog
 * http://terryyoung.blogspot.com/2011/08/raphaeljs-drag-and-drop-on-steroids.html
 */


///////////////////////////////////////////////////////////////////////////////
// Scroll to the bottom to see the simple demo code.
//
// These below are a bunch of my extensions to Raphael
// that enables the final, simply usage



/**
 * Too many times I've seen or written stuff like this that drives me mad:
 *
 * this.ox = this.type == 'rect' ? this.attr('x') : this.attr('cx');
 * this.oy = this.type == 'rect' ? this.attr('y') : this.attr('cy');
 *
 * {...10,000 words of rant skipped here...}
 *
 * The last one simplifies it to:
 * this.o();    // and better, it supports chaining
 *
 * @copyright   Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
Raphael.el.is = function (type) { return this.type == (''+type).toLowerCase(); };
Raphael.el.x = function () { return this.is('circle') ? this.attr('cx') : this.attr('x'); };
Raphael.el.y = function () { return this.is('circle') ? this.attr('cy') : this.attr('y'); };
Raphael.el.o = function () { this.ox = this.x(); this.oy = this.y(); return this; };


/**
 * Another one of my core extensions.
 * Raphael has getBBox(), I guess the "B" stands for Basic,
 * because I'd say the "A" in getABox() here stands for Advanced.
 *
 * It's just to free myself from calculating the same stuff over and over and over again.
 * {...10,000 words of rant skipped here...}
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
Raphael.el.getABox = function ()
{
    var b = this.getBBox(); // thanks, I'll take it from here...

    var o =
    {
        // we'd still return what the original getBBox() provides us with
        x:              b.x,
        y:              b.y,
        width:          b.width,
        height:         b.height,

        // now we can actually pre-calculate the following into properties that are more readible for humans
        // x coordinates have three points: left edge, centered, and right edge
        xLeft:          b.x,
        xCenter:        b.x + b.width / 2,
        xRight:         b.x + b.width,


        // y coordinates have three points: top edge, middle, and bottom edge
        yTop:           b.y,
        yMiddle:        b.y + b.height / 2,
        yBottom:        b.y + b.height
    };


    // now we can produce a 3x3 combination of the above to derive 9 x,y coordinates

    // center
    o.center      = {x: o.xCenter,    y: o.yMiddle };

    // edges
    o.topLeft     = {x: o.xLeft,      y: o.yTop };
    o.topRight    = {x: o.xRight,     y: o.yTop };
    o.bottomLeft  = {x: o.xLeft,      y: o.yBottom };
    o.bottomRight = {x: o.xRight,     y: o.yBottom };

    // corners
    o.top         = {x: o.xCenter,    y: o.yTop };
    o.bottom      = {x: o.xCenter,    y: o.yBottom };
    o.left        = {x: o.xLeft,      y: o.yMiddle };
    o.right       = {x: o.xRight,     y: o.yMiddle };

    // shortcuts to get the offset of paper's canvas
    o.offset      = $(this.paper.canvas).parent().offset();

    return o;
};


/**
 * Routine drag-and-drop. Just el.draggable()
 *
 * So instead of defining move, start, end and calling this.drag(move, start, end)
 * over and over and over again {10,000 words of rant skipped here}...
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
Raphael.el.draggable = function (options)
{
    $.extend(true, this, {
        margin: 0               // I might expand this in the future
    },options || {});

    var start = function () {
            this.o().toFront(); // store original pos, and zIndex to top
        },
        move = function (dx, dy, mx, my, ev) {
            var b = this.getABox(); // Raphael's getBBox() on steroids
            var px = mx - b.offset.left,
                py = my - b.offset.top,
                x = this.ox + dx,
                y = this.oy + dy,
                r = this.is('circle') ? b.width / 2 : 0;

            // nice touch that helps you keep draggable elements within the canvas area
            var x = Math.min(
                        Math.max(0 + this.margin + (this.is('circle') ? r : 0), x),
                        this.paper.width - (this.is('circle') ? r : b.width) - this.margin),
                y = Math.min(
                        Math.max(0 + this.margin + (this.is('circle') ? r : 0), y),
                        this.paper.height - (this.is('circle') ? r : b.height) - this.margin);

            // work-smart, applies to circles and non-circles
            var pos = { x: x, y: y, cx: x, cy: y };
            this.attr(pos);
        },
        end = function () {
            // not cool
        };

        this.drag(move, start, end);

    return this; // chaining
};


/**
 * Makes Raphael.el.draggable applicable to Raphael Sets, and chainable
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 */
Raphael.st.draggable = function (options) {
    for (var i in this.items) this.items[i].draggable(options);
    return this; // chaining
};






/**
 *
 * RaphaelJS drag-and-drop on steroids: DEMO
 *
 * @copyright   Terry Young <terryyounghk [at] gmail.com>
 * @license     WTFPL Version 2 ( http://en.wikipedia.org/wiki/WTFPL )
 *
 */

///////////////////////////////////////////////////////////////////////////////
// The demo

$(document).ready(function() {

    // 1. Create paper, sets, and shapes

    var paper = Raphael('SVG_DND_HOLDER_1', 960, 480);
    var set = paper.set();

    $('.s20').click(function(){
        set.push(paper.circle(10, 10, 10).attr({fill: 'lightyellow'})).draggable({margin: -90});
    });
    $('.s40').click(function(){
        set.push(paper.circle(10, 10, 20).attr({fill: 'lightgreen'})).draggable({margin: -90});
    });
    $('.s60').click(function(){
        set.push(paper.circle(10, 10, 30).attr({fill: '#CC99FF'})).draggable({margin: -90});
    });
    $('.s80').click(function(){
        set.push(paper.circle(10, 10, 40).attr({fill: '#FFCC66'})).draggable({margin: -90});
    });
    $('.s100').click(function(){
        set.push(paper.circle(10, 10, 50).attr({fill: 'lightgrey'})).draggable({margin: -90});
    });
    $('.s120').click(function(){
        set.push(paper.circle(10, 10, 60).attr({fill: '#FF7D5C'})).draggable({margin: -90});
    });
    $('.s180').click(function(){
        set.push(paper.circle(10, 10, 90).attr({fill: 'lightblue'})).draggable({margin: -90});
    });
    $('.s240').click(function(){
        set.push(paper.circle(10, 10, 120).attr({fill: 'lightblue'})).draggable({margin: -90});
    });
    $('.s360').click(function(){
        set.push(paper.circle(10, 10, 180).attr({fill: 'lightblue'})).draggable({margin: -90});
    });
    // 2. Viola <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  //  set.push(circle, circle2, circle3)         // populate the Set
    //   .draggable({margin: -40});   // Yes, that's it. Parameter is optional




    // 3. Optional. You can stack more drag() event handlers of your own

    var $debug = $('div#DEBUG'),
        move = function(dx, dy, mx, my, ev) {
            // Get mouse X/Y (relative to SVG/VML canvas)
            var offset = $(this.paper.canvas).parent().offset(),
                px = mx - offset.left,
                py = my - offset.top;

            $debug.html([
                'Drag Move: (Canvas offset relative to HTML doc): ' +
                    [offset.left, offset.top].join(', '),
                'Distance XY: ' + [dx, dy].join(', '),
                'Document XY: ' + [mx, my].join(', '),
                'Canvas XY: ' + [px, py].join(', ')
                ].join('<br>'));

        },
        start = function() { $debug.html('Drag Start'); },
        end = function() { $debug.html('Drag End'); };

    set.drag(move, start, end);
});



