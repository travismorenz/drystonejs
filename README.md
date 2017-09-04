# Drystone.js
A simple responsive grid plugin for jQuery

## The Basics
```javascript
//Call the drystone method on your grid element
$('.grid').drystone();

//Options
$('.grid').drystone({
    //Defaults
    item: '.grid-item', //This is the selector for your grid items
    xs: [576, 1], 
    sm: [768, 2], //see below for explanation
    md: [992, 2],
    lg: [1200, 3],
    xl: 3,
    onComplete: function() {} //function that runs after the plugin finishes
});
```
Unlike many other grid plugins, drystone is built entirely with a responsive layout in mind. You don't set the widths of the grid items, but you can set the number of columns you want at various screen sizes.

By default, drystone uses the **Bootstrap 4** mobile first breakpoints. So `xs: [576, 1]`  means that when the window size is <576px, then drystone will arange your grid items in 1 column.

The `xl` option is for everything that is larger than the `lg` breakpoint. So by default, it's everything larger than 1200px.
