import type {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ToDoBlockObjectResponse,
} from '@notionhq/client';

export type WithChildren<T> = T & {
  children?: BlockWithChildren[];
};

export interface NumberedListBlock {
  type: 'numbered_list';
  id: string;
  has_children: true;
  children: WithChildren<NumberedListItemBlockObjectResponse>[];
};

export interface BulletedListBlock {
  type: 'bulleted_list';
  id: string;
  has_children: true;
  children: WithChildren<BulletedListItemBlockObjectResponse>[];
};

export interface ToDoListBlock {
  type: 'to_do_list';
  id: string;
  has_children: true;
  children: WithChildren<ToDoBlockObjectResponse>[];
};

export type Block = BlockObjectResponse | NumberedListBlock | BulletedListBlock | ToDoListBlock;

export type BlockWithChildren = Block & {
  children?: BlockWithChildren[];
};
