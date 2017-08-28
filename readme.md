# Yaoli's ES6 Keyboard Navigation

This keyboard navigation library is written in pure es6. It does not rely on any outside dependencies.


## Markup requirements


### Classes to give keyboard focusable items and its container
Navigation is represented by a list of focusable elements. The movement can be set as horizontal or vertical.

Each focusable element requires the class `wyl-kb-item`. The container for the list of the kb items need to have a class of `wyl-kb-container`.

### Data attributes for the focusable containers

#### Required
`data-orientation`: Represents the direction along which the focus will move. For example, when we press the left arrow key, does focus move to the previous item in the list? Or do the previous container?
Possible values: `horizontal` or `vertical`


#### Optional

`data-ignore-scroll-position`: By default the page scroll is updated according to the focused position. Sometimes for fixed elements on the page for example, you may not want to move the focus, so you can set this attribute.
Possible values: `true`

##### Settings for what to do when focus movement goes beyond the head or tail of the container list.
`data-next-tail-action`: What to do when focus moves to after the last element in the container.
Possible values:
  `goto-following-container`: Moves focus to the first element of the next focusable sibling container.
  `circulate`: Circulates the focus within the same parent container; if focus is at the end, goto the beginning.

`data-prev-head-action`: What to do when focus moves to before the first element in the container.
Possible values:
  `goto-following-container`: Moves focus to the first element of the previous focusable sibling container.
  `circulate`: Circulates the focus within the same parent container; if focus is at the beginning, goto the end.

##### Settings for where to set focus when moving perpendicular to the containter
By default, when moving perpenticular to the containers orientation, e.g. when the data-orientation is `horizontal`, and the up arrow is pressed, focus is moved to the first focusable element of the previous focusable container in the DOM. The attributes below can change the default behavior

`data-prev-container-action`: What to do when focus tries to move to previous container.
Possible values: 
  `stop`: Stop instead of moving focus to previous container.

`data-next-container-action`: What to do when focus tries to move to next container.
Possible values: 
  `stop`: Stop instead of moving focus to next container.

## Initialization

After page init and library has loaded, run:

```javascript
  wylKeyboardNav.init();
```

Give the element you want to have the initial focus the class `wyl-kb-focus`.

## Listening to the enter event on a focusable element.
When user press the enter key, a custom `wyl-enter` event is dispatched from the focused element.
You can listen to this event using event listeners.

Example in vanilla JS:
```
  document.getElementsByClassName('wyl-kb-item')[0].addEventListener('wyl-enter', (e) => {
    console.log('Just triggered an event at: ', e.target);
  });
```

Example in jQuery:
```
  $('wyl-kb-item').click('wyl-enter', function(e) {
    console.log('Just triggered an event at: ', e.target);
  });
```

## Configuration and key mapping Overrides
If the default classnames causes collision with your existing code base, you can override them in the configuration.

By default, the configuration dictionary is:

```
    {
      enterEventName : 'wyl-enter',
      containerClassName : 'wyl-kb-container',
      kbItemClassName: 'wyl-kb-item',
      focusedItemClassName: 'wyl-kb-focus',
      scrollOffsetCorrection: 0
    }
```

Key mappings for the navigation can be changed too. By default it is:
```
    {
      UP_KEY: 'ArrowUp',
      DOWN_KEY: 'ArrowDown',
      LEFT_KEY: 'ArrowLeft',
      RIGHT_KEY: 'ArrowRight',
      ENTER_KEY: 'Enter'
    }
```
The values for the mappings refer to the values at: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values


### Example of how to override:
```
wylKeyboardNav.init(
    {
      enterEventName : 'example-enter',
      containerClassName : 'example-container',
      kbItemClassName: 'example-item',
      focusedItemClassName: 'example-focus',
      scrollOffsetCorrection: 55
    },
    {
      UP_KEY: 'ArrowUp',
      DOWN_KEY: 'ArrowDown',
      LEFT_KEY: 'ArrowLeft',
      RIGHT_KEY: 'ArrowRight',
      ENTER_KEY: 'Enter'
    });
```
