import { Flow } from "./primitives/flow.js";
import { BaseCollectionView } from "./base-ui/base-collection.js";
import { DiffResults, LevensteinOperation, differ } from "./base-ui/diffable-collection.js";
import { View } from "./base-ui/view.js";

export interface CollectionBaseItem {
  collectionItemId: string;
}

export interface NavigationCarouselItem<T extends CollectionBaseItem> extends CollectionBaseItem {
  items: Array<T>;
}

export interface NavigationCarouselItem<T extends CollectionBaseItem> extends CollectionBaseItem {
  items: Array<T>;
}

/**
 * A navigation view that displays one view at a time, as well as a top bar.
 */
export class StackNavigationView<T extends CollectionBaseItem> extends View<DiffResults<T>> {
  _topbar: HTMLElement;
  _contentElement: HTMLElement;

  constructor(stack: Flow<Array<T>>, topbar: HTMLElement, item2view: (item: T) => HTMLElement) {
    super(stack.map(differ<T>()).consume((diff: DiffResults<T>) => {
      if (diff.items.length === 0) {
        this._contentElement.innerHTML = "";
        return;
      }

      const topItem = diff.items[diff.items.length - 1]!;

      const mutations = diff.operations.filter(op => op.type === 'insert' || op.type === 'delete');
      const isPush = mutations.length === 1 &&
        mutations[0]!.type === 'insert' &&
        (mutations[0] as LevensteinOperation<T>).aIndex === diff.items.length - 1;
      const isPop = mutations.length === 1 &&
        mutations[0]!.type === 'delete' &&
        (mutations[0] as LevensteinOperation<T>).aIndex === diff.items.length;
      
      const oldView = this._contentElement.children[0] as HTMLElement | undefined;
      const newView = item2view(topItem);
      newView.style.position = "relative";
      newView.style.top = "0";
      newView.style.left = "0";
      newView.style.width = "100%";
      this._contentElement.appendChild(newView);

      const dur = 0.2; // seconds

      if (isPush) {
        newView.style.left = "100%";
        newView.style.transition = `left ${dur}s ease-in-out`;
        if (oldView) {
          oldView.style.left = "0";
          oldView.style.position = "absolute";
          oldView.style.transition = `left ${dur}s ease-in-out`;
        }
        requestAnimationFrame(() => {
          newView.style.left = "0";
          if (oldView) {
            oldView.style.left = "-100%";
          }
          newView.addEventListener("transitionend", () => {
            if (oldView && oldView.parentElement === this._contentElement) {
              this._contentElement.removeChild(oldView);
            }
          }, { once: true });
        });
      } else if (isPop) {
        newView.style.left = "-100%";
        newView.style.transition = `left ${dur}s ease-in-out`;
        if (oldView) {
          oldView.style.left = "0";
          oldView.style.position = "absolute";
          oldView.style.transition = `left ${dur}s ease-in-out`;
        }
        requestAnimationFrame(() => {
          newView.style.left = "0";
          if (oldView) {
            oldView.style.left = "100%";
          }
          newView.addEventListener("transitionend", () => {
            if (oldView && oldView.parentElement === this._contentElement) {
              this._contentElement.removeChild(oldView);
            }
          }, { once: true });
        });
      } else {
        this._contentElement.innerHTML = "";
        this._contentElement.appendChild(item2view(diff.items[diff.items.length - 1]));
      }
    }));
    this._topbar = topbar;
    this.style.position = "fixed";
    this.style.top = `${this._topbar.offsetHeight}px`;
    this.style.left = "0";
    this.style.right = "0";
    this.style.bottom = "0";
    this.style.overflow = "auto";
    this.style.display = "flex";
    this.style.flexDirection = "column";
    this.appendChild(this._topbar);

    this._contentElement = document.createElement("div");
    this._contentElement.style.flex = "1";
    this._contentElement.style.position = "relative";
    this.appendChild(this._contentElement);
  }
}
customElements.define("stack-navigation-view", StackNavigationView);

export class HorizontalStackView<T extends CollectionBaseItem> extends BaseCollectionView<T> {
  constructor(items: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    super(items, item2view);
    this.style.display = "flex";
    this.style.flexDirection = "row";
  }
  protected _update(stack: Array<T>, item2view: (item: T) => HTMLElement) {
    // Trivial implementation for demo purposes.
    this.innerHTML = "";
    for (const item of stack) {
      const view = item2view(item);
      this.appendChild(view);
    }
  }
}
customElements.define("horizontal-stack", HorizontalStackView);