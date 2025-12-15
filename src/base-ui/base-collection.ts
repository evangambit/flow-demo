import { Flow } from "../primitives/flow.js";
import { View } from "./view.js";

export interface CollectionBaseItem {
  collectionItemId: string;
}

/**
 * A base collection view that displays a collection of items.
 * 
 * Intended for small collections where diffing is not necessary.
 */
export class BaseCollectionView<T extends CollectionBaseItem> extends View<Array<T>> {
  constructor(stackFlow: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    super(stackFlow.consume((stack) => {
      this._update(stack, item2view);
    }, "NavigationViewConsumer"));
  }
  protected _update(stack: Array<T>, item2view: (item: T) => HTMLElement) {
    throw new Error("Implement in subclass");
  }
}
