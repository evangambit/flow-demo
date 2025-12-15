import { CollectionBaseItem } from "./base-collection.js";
import { Flow } from "../primitives/flow.js";
import { View } from "./view.js";

export interface LevensteinOperation<T extends CollectionBaseItem> {
  type: 'insert' | 'delete' | 'substitute' | 'equal';
  aIndex?: number;
  bIndex?: number;
  insertedValue?: T;
}

function levenstein<T extends CollectionBaseItem>(a: Array<T>, b: Array<T>): Array<LevensteinOperation<T>> {
  const dp: Array<Array<number>> = [];
  for (let i = 0; i <= a.length; i++) {
    dp[i] = [];
    for (let j = 0; j <= b.length; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (a[i - 1].collectionItemId === b[j - 1].collectionItemId) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }
  const operations: Array<LevensteinOperation<T>> = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1].collectionItemId === b[j - 1].collectionItemId) {
      operations.push({ type: 'equal', aIndex: i - 1, bIndex: j - 1 });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
      operations.push({ type: 'insert', aIndex: i, bIndex: j - 1, insertedValue: b[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
      operations.push({ type: 'delete', aIndex: i - 1, bIndex: j, insertedValue: undefined });
      i--;
    } else if (i > 0 && j > 0) {
      operations.push({ type: 'substitute', aIndex: i - 1, bIndex: j - 1, insertedValue: b[j - 1] });
      i--;
      j--;
    }
  }
  operations.reverse();
  return operations;
}

export function apply_levenstein<T extends CollectionBaseItem>(
  operations: Array<LevensteinOperation<T>>,
  insert_fn: (index: number, value: T) => void,
  delete_fn: (index: number) => void,
  substitute_fn: (index: number, value: T) => void) {
  let aIndex = 0;
  let bIndex = 0;
  for (const op of operations) {
    if (op.type === 'equal') {
      aIndex++;
      bIndex++;
    } else if (op.type === 'insert') {
      insert_fn(aIndex, op.insertedValue!);
      bIndex++;
      aIndex++;
    } else if (op.type === 'delete') {
      delete_fn(aIndex);
    } else if (op.type === 'substitute') {
      substitute_fn(aIndex, op.insertedValue!);
      aIndex++;
      bIndex++;
    }
  }
}

export interface DiffResults<T extends CollectionBaseItem> {
  operations: Array<LevensteinOperation<T>>;
  items: Array<T>;
}

export function differ<T extends CollectionBaseItem>(): (itemsArr: Array<T>) => DiffResults<T> {
  let lastArr: Array<T> = [];
  return (itemsArr: Array<T>) => {
    const r = {
      operations: levenstein(lastArr, itemsArr),
      items: itemsArr,
    };
    lastArr = itemsArr;
    return r;
  };
}

/**
 * Automatically incrementally creates/deletes children.
 */
export class DiffableCollectionView<T extends CollectionBaseItem>extends View<DiffResults<T>> {
  content: HTMLElement;
  constructor(items: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    const insert_fn = (index: number, value: T) => {
      const view = item2view(value);
      this.content.insertBefore(view, this.content.children[index] || null);
    };
    const delete_fn = (index: number) => {
      const child = this.content.children[index];
      if (child) {
        this.content.removeChild(child);
      }
    };
    const substitute_fn = (index: number, value: T) => {
      const child = this.content.children[index];
      if (child) {
        this.content.replaceChild(item2view(value), child);
      }
    };
    super(items.map(differ<T>()).consume((diff: DiffResults<T>) => {
      const operations = diff.operations;
      const items = diff.items;
      apply_levenstein(operations, insert_fn, delete_fn, substitute_fn);
    }));
    this.content = <HTMLDivElement>document.createElement('div');
    this.appendChild(this.content);
    this.content.style.display = 'block';

  }
}
customElements.define("diffable-collection-view", DiffableCollectionView);
