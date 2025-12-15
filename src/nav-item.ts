import { CollectionBaseItem } from "./base-ui/base-collection";

// Navigation types.
export enum TopLevelNavigationItemType {
  Inbox = "inbox",
  Conversation = "conversation",
}

export interface TopLevelNavigationItemBase extends CollectionBaseItem {
  type: TopLevelNavigationItemType;
}

export interface InboxNavigationItem extends TopLevelNavigationItemBase {
  inboxType: string;
}

export interface ConversationNavigationItem extends TopLevelNavigationItemBase {
  conversationId: string;
}
