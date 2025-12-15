import { CollectionBaseItem } from "./base-ui/base-collection.js";
import { Context, Flow } from "./primitives/flow.js";

export interface Conversation {
  conversationId: string;
  sender: string;
  messages: Array<string>;
}

export interface InboxItem extends CollectionBaseItem {
  conversationId: string;
  sender: string;
  snippet: string;
}

export class ConversationModel {
  static getConversation(context: Context, conversationId: string): Flow<Conversation> {
    return context.create_state_flow({
      conversationId: conversationId,
      sender: `Sender of conversation ${conversationId}`,
      messages: [
        `Message 1 of conversation`,
        `Message 2 of conversation`,
      ],
    }, `ConversationRepo-${conversationId}`);
  }
  static getInboxItems(context: Context, inboxType: string): Flow<Array<InboxItem>> {
    // For demo purposes, return a static list.
    const items: Array<InboxItem> = [];
    for (let i = 1; i <= 5; i++) {
      items.push({
        collectionItemId: `${inboxType}-conv-${i}`,
        conversationId: `${inboxType}-conv-${i}`,
        sender: `Sender ${i}`,
        snippet: `This is a snippet of conversation ${inboxType}-conv-${i}`,
      });
    }
    return context.create_state_flow(items, `Inbox-${inboxType}`);
  }
}
