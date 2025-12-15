import { DiffableCollectionView } from "./base-ui/diffable-collection.js";
import { StateFlow, Flow } from "./primitives/flow.js";
import { InboxItem } from "./conversation.js";
import { TopLevelNavigationItemType, TopLevelNavigationItemBase, ConversationNavigationItem } from "./nav-item.js";

export class InboxView extends DiffableCollectionView<InboxItem> {
  constructor(items: Flow<Array<InboxItem>>, navStack: StateFlow<Array<TopLevelNavigationItemBase>>) {
    super(items, (inboxItem: InboxItem): HTMLElement => {
      this.style.display = "block";
      const row = document.createElement("div");
      row.style.borderBottom = "1px solid #ccc";
      const sender = document.createElement("div");
      sender.innerText = `From: ${inboxItem.sender}`;
      const snippet = document.createElement("div");
      snippet.innerText = inboxItem.snippet;
      row.appendChild(sender);
      row.appendChild(snippet);
      row.onclick = () => {
        const conversationItem: ConversationNavigationItem = {
          collectionItemId: `conversation-${inboxItem.collectionItemId}`,
          type: TopLevelNavigationItemType.Conversation,
          conversationId: inboxItem.collectionItemId,
        };
        navStack.value = navStack.value.concat([conversationItem]);
      };
      return row;
    });
  }
}
customElements.define("inbox-view", InboxView);
