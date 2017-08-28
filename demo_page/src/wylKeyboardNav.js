// Constants representing node movement of keyboard focus.
const FocusMovement = {
  PREV_ITEM: 1,
  NEXT_ITEM: 2,
  PREV_CONTAINER: 3,
  NEXT_CONTAINER: 4,
  ENTER: 5
};


// Mapping of intended direction to movement of the focused node
// on a vertically laid out container.
const VerticalKeyToMovementMap = {
  UP_KEY: FocusMovement.PREV_ITEM,
  DOWN_KEY: FocusMovement.NEXT_ITEM,
  LEFT_KEY: FocusMovement.PREV_CONTAINER,
  RIGHT_KEY: FocusMovement.NEXT_CONTAINER,
  ENTER_KEY: FocusMovement.ENTER
};


// Mapping of intended direction to movement of the focused node
// on a horizontally laid out container. 
const HorizontalKeyToMovementMap = {
  UP_KEY: FocusMovement.PREV_CONTAINER,
  DOWN_KEY: FocusMovement.NEXT_CONTAINER,
  LEFT_KEY: FocusMovement.PREV_ITEM,
  RIGHT_KEY: FocusMovement.NEXT_ITEM,
  ENTER_KEY: FocusMovement.ENTER
};



/**
 * Keyboard navigation library. Initialize first before using.
 *
 * @author Yaoli Wang
 */
class _wylKeyboardNav {


  /** @constructor */
  constructor() {
    this.currentFocusEl = null;
    this.focusedContainer = null;
    this.keyMappings = {
      UP_KEY: 'ArrowUp',
      DOWN_KEY: 'ArrowDown',
      LEFT_KEY: 'ArrowLeft',
      RIGHT_KEY: 'ArrowRight',
      ENTER_KEY: 'Enter'
    };
    this.configs = {
      enterEventName : 'wyl-enter',
      containerClassName : 'wyl-kb-container',
      kbItemClassName: 'wyl-kb-item',
      focusedItemClassName: 'wyl-kb-focus',
      scrollOffsetCorrection: 0
    };
  }


  /**
   * Initalize keyboard library after page load.
   * 
   * @param {object} configsOverride Set the custom event names and CSS classes
   *   this library is looking for. Look at the configs property for example
   *   of how to use.
   * @param {object} keyMappingsOverride Set the custom keyboards to indicate
   *   upward, downward, left, right movement etc. Refer to keyMappings property
   *   for example of how to use.
   */
  init(configsOverride, keyMappingsOverride) {
    if (configsOverride) {
      this.configs = Object.assign(this.configs, configsOverride);
    }
    if (keyMappingsOverride) {
      this.keyMappings = Object.assign(this.keyMappings, keyMappingsOverride);
    }
    this.currentFocusEl = document.body.getElementsByClassName(
      this.configs.focusedItemClassName)[0];

    this.attachHandlers();
  }


  /**
   * Attach event listeners to page to listen to keyboard movement and mouse clicks.
   */
  attachHandlers() {
    // Mapping of keys to intended movement. This to translate keypress to desired movement of focus.
    const inverseKeyMapping = {};
    for (let key in this.keyMappings) {
      let value = this.keyMappings[key];
      inverseKeyMapping[value] = key;
    }

    // Listening to key press to see if we need to move focus.
    document.body.addEventListener('keydown', (e) => {
      if (!(e.key in inverseKeyMapping)) {
        return;
      }
      e.preventDefault();
      if (!this.focusedContainer) {
        this.focusedContainer = this.getKbContainer();
      }
      const containerOrientation = this.focusedContainer.getAttribute('data-orientation');
      const directionsMap = containerOrientation === 'vertical' ? VerticalKeyToMovementMap : HorizontalKeyToMovementMap;        
      const keyDirection = inverseKeyMapping[e.key];
      const direction = directionsMap[keyDirection];
      this.moveFocus(direction);
      const ignoreScrollPosition = this.focusedContainer.getAttribute(
        'data-ignore-scroll-position');
      if (!ignoreScrollPosition) {
        document.body.scrollTop = this.currentFocusEl.offsetTop + this.configs.scrollOffsetCorrection;
      }
    });
    // Creating local variable shorthand.
    const kbItemClassNameSelector = '.' + this.configs.kbItemClassName;
    const focusedItemClassName = this.configs.focusedItemClassName;

    // Event delegation to listen clicks on the a focusable item.
    document.body.addEventListener('click', (e) => {
      if (e.target.closest(kbItemClassNameSelector)) {
        this.currentFocusEl.classList.remove(focusedItemClassName);
        this.currentFocusEl = e.target.closest(kbItemClassNameSelector);
        this.currentFocusEl.classList.add(focusedItemClassName);
        this.focusedContainer = this.getKbContainer();
      }
    });    
  }


  /**
   * Moves the focus based on keyboard movement.
   *
   * @param {FocusMovement.<enum>} Direction to move focus.
   */
  moveFocus(direction) {
    // Remove the current focus.
    this.currentFocusEl.classList.remove(this.configs.focusedItemClassName);
    switch (direction) {
      case FocusMovement.NEXT_ITEM:
        const nextTailAction = this.focusedContainer.getAttribute('data-next-tail-action');
        this.moveFocusPrevNextItem(nextTailAction, FocusMovement.NEXT_ITEM, FocusMovement.NEXT_CONTAINER);
        break;
      case FocusMovement.PREV_ITEM:
        const prevHeadAction = this.focusedContainer.getAttribute('data-prev-head-action');
        this.moveFocusPrevNextItem(prevHeadAction, FocusMovement.PREV_ITEM, FocusMovement.PREV_CONTAINER);
        break;
      case FocusMovement.PREV_CONTAINER:
        const prevContainerAction = this.focusedContainer.getAttribute('data-prev-container-action');
        if (prevContainerAction !== 'stop') { 
          this.moveFocusPrevNextContainer(FocusMovement.PREV_CONTAINER);
        }
        break;
      case FocusMovement.NEXT_CONTAINER:
        const nextContainerAction = this.focusedContainer.getAttribute('data-next-container-action');
        if (nextContainerAction !== 'stop') { 
          this.moveFocusPrevNextContainer(FocusMovement.NEXT_CONTAINER);
        }
        break;
      case FocusMovement.ENTER:
        this.currentFocusEl.dispatchEvent(new Event(this.configs.enterEventName));
        break;
    }
    // Add focus on new this.currentFocusEl.
    this.currentFocusEl.classList.add(this.configs.focusedItemClassName);
  }


  /**
   * Reassign the currentFocusEl according to different scenarios.
   *
   * @param {String} containerDirection Enum to indicate previous or next container.
   */
  moveFocusPrevNextContainer(containerDirection) {
    const container = this.getSiblingKbContainer(containerDirection);
    if (container) {
      this.focusedContainer = container;
      this.currentFocusEl = this.getFirstLastItem(FocusMovement.NEXT_ITEM);
    }
  }

  /**
   * Reassign the currentFocusEl according to different scenarios.
   *
   * @param {String} actionAtListEdge the action we are going to do when at the head or tail of a clickable itm.
   * @param {String} containerDirection Enum to indicate previous or next container.
   */
  moveFocusPrevNextItem(actionAtListEdge, itemDirection, containerDirection) {
    const nextEl = this.getPrevNextItem(itemDirection);
    if (nextEl){
      this.currentFocusEl = nextEl;
      // Jump to the first child of the parent node.
    } else if (actionAtListEdge  == 'goto-following-container') {
      this.focusedContainer = this.getSiblingKbContainer(containerDirection);
      this.currentFocusEl = this.getFirstLastItem(FocusMovement.NEXT_ITEM);
    } else if (actionAtListEdge == 'circulate'){
      this.currentFocusEl = this.getFirstLastItem(itemDirection);
    }    
  }

  /**
   * Get the current focus's container element.
   *
   * @return {HTMLElement}
   */
  getKbContainer() {
    let parentEl = this.currentFocusEl.parentNode;
    while (parentEl) {
      if (parentEl.classList.contains(this.configs.containerClassName)) {
        return parentEl;
      } else {
        parentEl = parentEl.parentNode;
      }
    }
  }


  /**
   * Returns the previous or next clickable item.
   *
   * @param {FocusMovement.<enum>} direction to move focus to either the previous or next item.
   * @return {HTMLElement}
   */
  getPrevNextItem(direction) {
    const currentCbItems = this.focusedContainer.getElementsByClassName(this.configs.kbItemClassName);
    const currentCbItemIndex = Array.prototype.indexOf.call(currentCbItems, this.currentFocusEl);
    const index = direction === FocusMovement.NEXT_ITEM ? 
        currentCbItemIndex + 1 : currentCbItemIndex - 1;
    return currentCbItems[index];
  }


  /**
   * Finds the closest sibling container element.
   *
   * @param {FocusMovement.<enum>} direction Direction to move focus, either to the previous
   *   or next container element.
   * @return {HTMLElement}
   */
  getSiblingKbContainer(direction) {
    const parentNodeList = document.body.getElementsByClassName(this.configs.containerClassName);
    const currentParentIndex = Array.prototype.indexOf.call(parentNodeList, this.focusedContainer);
    const index = direction === FocusMovement.NEXT_CONTAINER ? 
      currentParentIndex + 1 : currentParentIndex - 1;
    return parentNodeList[index];
  }  


  /**
   * Returns the first or last clickable item.
   *
   * @param {FocusMovement.<enum>} direction to move focus to either the previous or next item.
   * @return {HTMLElement}
   */
  getFirstLastItem(direction) {
    const currentCbItems = this.focusedContainer.getElementsByClassName(this.configs.kbItemClassName);
    const currentCbItemIndex = Array.prototype.indexOf.call(currentCbItems, this.currentFocusEl);
    const index = direction === FocusMovement.NEXT_ITEM ? 
        0 : currentCbItems.length - 1;
    return currentCbItems[index];
  }
}


export let wylKeyboardNav = new _wylKeyboardNav();