import { BaseCollectionView, CollectionBaseItem } from "./base_collection.js";
import { Consumer, Flow } from "../primitives/flow.js";

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

export interface DiffResults<T extends CollectionBaseItem> {
  added: Set<string>;
  removed: Set<string>;
  oldItems: Array<string>;
  items: Array<T>;
}

function differ<T extends CollectionBaseItem>(): (itemsArr: Array<T>) => DiffResults<T> {
  let lastArr: Array<string> = [];
  return (itemsArr: Array<T>) => {
    const itemsSet = new Set<string>(itemsArr.map(item => item.collectionItemId));
    const addedItems = itemsArr.filter(item => !itemsSet.has(item.collectionItemId));
    const removedItems = Array.from(lastArr).filter(id => !itemsSet.has(id));
    lastArr = itemsArr.map(item => item.collectionItemId);
    return {
      'added': new Set(addedItems.map(item => item.collectionItemId)),
      'removed': new Set(removedItems.map(item => item)),
      'oldItems': lastArr,
      'items': itemsArr,
    };
  };
}

export class DiffableCollection<T extends CollectionBaseItem> extends HTMLElement {
  content: HTMLElement;
  _diffedConsumer: Consumer<DiffResults<T>>;
  _children: Map<string, HTMLElement>;
  constructor(items: Flow<Array<T>>, consumeFn: (results: DiffResults<T>) => void) {
    super();
    this._children = new Map<string, HTMLElement>();

    this.content = <HTMLDivElement>document.createElement('div');
    this.appendChild(this.content);

    this.content.style.display = 'block';
    this._diffedConsumer = items.map(differ<T>()).consume(consumeFn);
  }
  connectedCallback() {
    this._diffedConsumer.turn_on();
  }
  disconnectedCallback() {
    this._diffedConsumer.turn_off();
  }
}
customElements.define('diffable-collection', DiffableCollection);

export class TableView<T extends CollectionBaseItem> extends DiffableCollection<T> {
  constructor(items: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    super(items, (diff) => {
      // TODO: optimize updates based on diff
      this.content.innerHTML = "";
      diff.items.forEach((item) => {
        this.content.appendChild(item2view(item));
      });
    });
  }
}
customElements.define("table-view", TableView);
