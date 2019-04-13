(function($, window) {
    var tl = new TimelineMax();
    var resized = false;

    $(window).resize(function() {
        var dragOffset = $('.draggable').offset();
        tl.set('.resize', { top: dragOffset.top - 50, left: dragOffset.left - 210 });
    });

    $(window).on('load', function() {
        var dragOffset = $('.draggable').offset();
        var dragWidth = $('.draggable').width();

        drystone = $('.grid').drystone({
            gutter: 15
        });

        tl.staggerTo('.grid-item', 1, { opacity: 1 }, .05);
        tl.fromTo('.splash-text', 1, { y: 50 }, { opacity: 1, y: 0 }, "0");
        tl.fromTo('.title', 1, { y: -50 }, { opacity: 1, y: 0 }, "0");
        tl.set('.resize', { top: dragOffset.top - 50, left: dragOffset.left - 210 });
        tl.to('.resize', 1, { opacity: 1 });

        interact('.draggable').resizable({
                preserveAspectRatio: true,
                edges: { left: true, right: true, bottom: true, top: true }
            })
            .on('resizemove', function(event) {
                var width = $('.draggable').width();
                var target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);
                if (!resized) {
                    tl.to('.resize', .3, { opacity: 0 });
                    resized = true;
                }
                if (event.rect.width > dragWidth - 250 && event.rect.width < dragWidth + 250) {
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';
                    if (width < dragWidth - 150) {
                        rebuild(1);
                    } else if (width < dragWidth - 75) {
                        rebuild(2);
                    } else if (width < dragWidth + 75) {
                        rebuild(3);
                    } else if (width < dragWidth + 150) {
                        rebuild(4);
                    } else {
                        rebuild(5);
                    }
                }

            });

    });

})(jQuery, window);