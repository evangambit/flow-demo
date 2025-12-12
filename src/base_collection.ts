import { Flow, Consumer } from "./flow.js";

export interface CollectionBaseItem {
  collectionItemId: string;
}

export class BaseCollectionView<T extends CollectionBaseItem> extends HTMLElement {
  _stack: Flow<Array<T>>;
  _consumer: Consumer<Array<T>>;
  constructor(stack: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    super();
    this._stack = stack;
    this._consumer = this._stack.consume((stack) => {
      this._update(stack, item2view);
    }, "NavigationViewConsumer");
  }
  protected _update(stack: Array<T>, item2view: (item: T) => HTMLElement) {
    throw new Error("Implement in subclass");
  }
  connectedCallback() {
    this._consumer.turn_on();
  }
  disconnectedCallback() {
    this._consumer.turn_off();
  }
}