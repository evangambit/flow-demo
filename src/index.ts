import { View } from "./base-ui/view.js";
import { DiffableCollectionView } from "./base-ui/diffable-collection.js";
import { BaseCollectionView, CollectionBaseItem } from "./base-ui/base-collection.js";
import { TableView } from "./base-ui/table.js";
import { StateFlow, Context, Flow } from "./primitives/flow.js";
import { StackNavigationView } from "./nav.js";
import { TopBar, TopbarItem, TopBarItem_SimpleButton, TopBarItem_Title } from "./topbar.js";

const starIcon = '/star.svg';

const context = new Context();

// Navigation types.
enum TopLevelNavigationItemType {
  Inbox = "inbox",
  Conversation = "conversation",
}

interface TopLevelNavigationItemBase extends CollectionBaseItem {
  type: TopLevelNavigationItemType;
}

interface InboxNavigationItem extends TopLevelNavigationItemBase {
  inboxType: string;
}

interface ConversationNavigationItem extends TopLevelNavigationItemBase {
  conversationId: string;
}

// Data for each cell in the inbox.
interface InboxItem extends CollectionBaseItem {
  conversationId: string;
  subject: string;
  sender: string;
  snippet: string;
}

function make_element(tag: string, fn: (el: HTMLElement) => void): HTMLElement {
  const el = document.createElement(tag);
  fn(el);
  return el;
}

function navStackToTopbarItems(
  navStackFlow: StateFlow<Array<TopLevelNavigationItemBase>>,
  navStack: Array<TopLevelNavigationItemBase>
): Array<TopbarItem> {
  if (navStack.length === 0) {
    return [];
  }
  const items: Array<TopbarItem> = [];
  if (navStack.length > 1) {
    items.push({
      collectionItemId: "back-button",
      element: make_element("button", (btn) => {
        btn.innerText = "Back";
        btn.onclick = () => {
          navStackFlow.value = navStackFlow.value.slice(0, navStackFlow.value.length - 1);
        };
      }),
    });
  }
  const currentItem = navStack[navStack.length - 1];

  let title = "";
  switch (currentItem.type) {
    case TopLevelNavigationItemType.Inbox:
      title = `Inbox (${(currentItem as InboxNavigationItem).inboxType})`;
      break;
    case TopLevelNavigationItemType.Conversation:
      title = `Conversation (${(currentItem as ConversationNavigationItem).conversationId})`;
      break;
  }
  items.push({
    collectionItemId: "title",
    element: make_element("div", (div) => {
      div.innerText = title;
      div.style.fontWeight = "bold";
      div.style.fontSize = "18px";
    }),
  } as TopBarItem_Title);

  if (currentItem.type === TopLevelNavigationItemType.Conversation) {
    items.push({
      collectionItemId: "star-button",
      element: make_element("button", (btn) => {
        const starImg = document.createElement("img");
        starImg.src = starIcon;
        starImg.style.width = "16px";
        starImg.style.height = "16px";
        starImg.style.verticalAlign = "middle";
        btn.appendChild(starImg);
      }),
    } as TopBarItem_SimpleButton);
  }
  
  return items;
}

function getInboxItems(inboxType: string): StateFlow<Array<InboxItem>> {
  const items: Array<InboxItem> = [];
  for (let i = 1; i <= 20; i++) {
    items.push({
      collectionItemId: `inbox-item-${inboxType}-${i}`,
      conversationId: `conversation-${inboxType}-${i}`,
      subject: `Subject ${i} (${inboxType})`,
      sender: `Sender ${i} (${inboxType})`,
      snippet: `Snippet ${i} (${inboxType})`,
    });
  }
  return context.create_state_flow(items, `InboxItems-${inboxType}`);
}

interface Conversation {
  conversationId: string;
  sender: string;
  snippet: string;
  subject: string;
}

function conversationFlow(conversationId: string): StateFlow<Conversation> {
  return context.create_state_flow({
    conversationId: conversationId,
    sender: `Sender of conversation ${conversationId}`,
    snippet: `This is the snippet of conversation ${conversationId}`,
    subject: `Subject of conversation ${conversationId}`,
  }, `ConversationFlow-${conversationId}`);
}

class InboxView extends DiffableCollectionView<InboxItem> {
  constructor(items: StateFlow<Array<InboxItem>>, navStack: StateFlow<Array<TopLevelNavigationItemBase>>) {
    super(items, (inboxItem: InboxItem): HTMLElement => {
      this.style.display = "block";
      const row = document.createElement("div");
      row.style.borderBottom = "1px solid #ccc";
      row.style.padding = "10px";
      const subject = document.createElement("div");
      subject.innerText = inboxItem.subject;
      subject.style.fontWeight = "bold";
      const sender = document.createElement("div");
      sender.innerText = `From: ${inboxItem.sender}`;
      const snippet = document.createElement("div");
      snippet.innerText = inboxItem.snippet;
      row.appendChild(subject);
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

class ConversationView extends View<Conversation> {
  constructor(conversationFlow: StateFlow<Conversation>, navStack: StateFlow<Array<TopLevelNavigationItemBase>>) {
    super(conversationFlow.consume((conversation) => {
      this.innerText = `Conversation View - ${conversation.subject}\nFrom: ${conversation.sender}\n\n${conversation.snippet}`;
      const button = document.createElement("button");
      const starImg = document.createElement("img");
      starImg.src = starIcon;
      starImg.style.width = "16px";
      starImg.style.height = "16px";
      starImg.style.verticalAlign = "middle";
      button.appendChild(starImg);
      button.style.marginTop = "10px";
      button.onclick = () => {
        navStack.value = navStack.value.filter(navItem => navItem.collectionItemId !== conversation.conversationId);
      };
      this.appendChild(button);      
      this.style.padding = "10px";
    }, "ConversationViewConsumer"));
  }
}
customElements.define("conversation-view", ConversationView);

function main() {
  const navStackFlow = context.create_state_flow<Array<TopLevelNavigationItemBase>>([], "TopLevelNavStack");
  const topbar = new TopBar(navStackFlow.map((navStack) => navStackToTopbarItems(navStackFlow, navStack)));
  const rootNav = new StackNavigationView<TopLevelNavigationItemBase>(
    navStackFlow,
    topbar,
    (item: TopLevelNavigationItemBase) => {
      switch (item.type) {
        case TopLevelNavigationItemType.Inbox:
          return new InboxView(getInboxItems((item as InboxNavigationItem).inboxType), navStackFlow);
        case TopLevelNavigationItemType.Conversation:
          return new ConversationView(conversationFlow(item.collectionItemId), navStackFlow);
      }
    }
  );

  document.body.appendChild(rootNav);
  rootNav.style.position = "fixed";
  rootNav.style.top = "0";
  rootNav.style.left = "0";
  rootNav.style.right = "0";
  rootNav.style.bottom = "0";
  rootNav.style.border = "1px solid black";

  const navItem = {
    collectionItemId: "inbox-1",
    type: TopLevelNavigationItemType.Inbox,
    inboxType: "primary",
  } as InboxNavigationItem;
  navStackFlow.value = navStackFlow.value.concat([navItem]);
}

// Initialize the app when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
    main();
});
