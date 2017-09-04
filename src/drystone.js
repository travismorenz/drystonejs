(function($, document, window) {
/*
add heightFunc
add animation option
*/


    //Create the defaults
    var pluginName = "drystone",
        defaults = {
            //The selector for the items in the grid.
            item: '.grid-item',
            //The vertical and horizontal space between each item in the grid
            gutter: 10,
            //The amount of columns users want at each breakpoint | Uses bootstrap v4 breakpoints
            xs: [576, 1],
            sm: [768, 2],
            md: [992, 2],
            lg: [1200, 3],
            xl: 3,
            onComplete: function() {}
        };

    //Plugin constructor
    function Plugin(element, options) {
        this.element = element;
        //Overwrite the defaults with the defined options
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {
        //Fires on plugin initiate
        init: function() {
            this.buildCache();
            this.registerHandlers();
            this.getValues();
            this.build();
            this.options.onComplete();
        },
        buildCache: function() {
            this.$grid = $(this.element);
            this.$gridItems = this.$grid.children(this.options.item);
        },
        getValues: function() {
            this.gridWidth = this.$grid.width();
            this.numOfColumns = this.getNumOfColumns();
            this.columnWidth = this.getColumnWidth();
        },
        getNumOfColumns: function() {
            //Create an empty array that represents our grid system
            this.columns = [];
            //The number of columns
            var num = 0;
            //Store the width of the screen so that we can compare it to our Queries
            var width = $(window).width();
            //Set the number of columns based on the screen width and the user defined/default value
            if (width < this.options.xs[0]) {
                num = this.options.xs[1];
            } else if (width < this.options.sm[0]) {
                num = this.options.sm;
            } else if (width < this.options.md[0]) {
                num = this.options.md[1];
            } else if (width < this.options.lg[0]) {
                num = this.options.lg[1];
            } else {
                num = this.options.xl;
            }
            //IMPORTANT//
            //This fills the columns array with columns
            //Each column is represented with an array whose first value is the left to right position
            //So [0,0] is the first column from the left, [2,0] is the third
            //The second value in the array keeps track of the height of the column and is used for item placement
            for (let i = 0; i < num; i++) {
                this.columns.push([i, 0]);
            }

            return num;
        },
        getColumnWidth: function() {
            //Column width is just (grid width) - (total space taken up by the gutters) / (number of columns)
            return parseInt((this.gridWidth - this.options.gutter * (this.numOfColumns - 1)) / this.numOfColumns);
        },
        registerHandlers: function() {
            var self = this;
            //Recalculate values and rebuild the grid on window resize
            $(window).resize(function() {
                self.getValues();
                self.build();
            });
        },
        build: function() {
            //Assign this to another variable to solve scoping problems
            var self = this;
            //The collumn the item is going to be placed in
            var currentColumn;

            //Iterate through each of the items
            self.$gridItems.each(function() {
                var item = $(this);

                //Set the required position attributes and the item width
                //Item width = column width because gutters are taken into account when determining column width
                item.css('position', 'absolute');
                self.$grid.css('position', 'relative');
                item.css('width', self.columnWidth);

                //Iterate through self.columns
                //Sets currentColumn to the column that has taken up the least amount of vertical space
                for (let i = 0; i < self.columns.length; i++) {
                    if (currentColumn == undefined || currentColumn[1] > self.columns[i][1]) {
                        currentColumn = self.columns[i];
                    }
                }
                //If the column is the leftmost column, do not add gutter to its left position
                if (currentColumn[0] == 0) {
                    item.css('left', currentColumn[0] * self.columnWidth);
                } else {
                    //If column is not leftmost, add gutter to its left position
                    //self.options.gutter * currentColumn[0] ensures that all the previous gutters are taken into account when setting left position
                    item.css('left', currentColumn[0] * self.columnWidth + self.options.gutter * currentColumn[0]);
                }
                //Set the top position based on the height of column
                item.css('top', currentColumn[1]);
                //Adds the gutter afterwards to the height. This makes it so that the topmost elements don't have a gutter above them.
                currentColumn[1] += item.height() + self.options.gutter;
            });

            //Set currentColumn to the column that takes up the most vertical space 
            for (let i = 0; i < self.columns.length; i++) {
                if (currentColumn[1] < self.columns[i][1]) {
                    currentColumn = self.columns[i];
                }
            }
            //Set grid to the height of the determined tallest column 
            self.$grid.css('height', currentColumn[1] - this.options.gutter);
            //Make the items visible
            self.$gridItems.css('visibility', 'visible');
        }


    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, document, window);