import { BaseCollectionView, CollectionBaseItem } from "./base_collection";
import {Consumer, Flow} from "./flow";

const gMouse = {
  down: false,
  downPos: {
    'x': 0,
    'y': 0,
  }
};
window.addEventListener('mousedown', (e) => {
  gMouse.down = true;
  gMouse.downPos.x = e.clientX;
  gMouse.downPos.y = e.clientY;
})
window.addEventListener('mouseup', (e) => {
  gMouse.down = false;
})

interface DiffResults<T extends CollectionBaseItem> {
  added: Set<string>;
  removed: Set<string>;
  items: Array<T>;
}

function differ<T extends CollectionBaseItem>() {
  let cache = new Set<string>();
  return (itemsArr: Array<T>) => {
    const itemsSet = new Set(itemsArr.map(item => item.collectionItemId));
    const addedItems = itemsArr.filter(item => !cache.has(item.collectionItemId));
    const removedItems = Array.from(cache).filter(item => !itemsSet.has(item));
    cache = itemsSet;
    return {
      'added': new Set(addedItems.map(item => item.collectionItemId)),
      'removed': new Set(removedItems.map(item => item)),
      'items': itemsArr,
    };
  };
}

export class TableView<T extends CollectionBaseItem> extends BaseCollectionView<T> {
  content: HTMLElement;
  _diffedConsumer: Consumer<DiffResults<T>>;
  _children: Map<string, HTMLElement>;
  constructor(items: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    super(items, item2view);
    this._children = new Map<string, HTMLElement>();

    this.content = <HTMLDivElement>document.createElement('div');
    this.appendChild(this.content);

    this.content.style.display = 'block';

    this._diffedConsumer = items.map(differ<T>()).consume((deltas: DiffResults<T>) => {
      // TODO: implement this.
    }, 'TableView.consumer');
  }
  connectedCallback() {
    this._consumer.turn_on();
  }
  disconnectedCallback() {
    this._consumer.turn_off();
  }
}
customElements.define('table-view', TableView);
