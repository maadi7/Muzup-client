import { NotificationEntityType, NotificationType } from "@/generated/graphql";
import { IconType } from "react-icons";

export interface Sidebar {
  name: string;
  link: string;
  Icon?: IconType;
}

export type UIUser = {
  _id: string;
  username: string;
  profilePic?: string | null;
};

export type AllNotification = {
  _id: string;
  type: NotificationType;
  text?: string | null;
  isRead: boolean;
  isArchived: boolean;
  entityType: NotificationEntityType;
  entityId?: string | null;
  createdAt: string;
  updatedAt: string;
  sender: UIUser;
  receiver: UIUser;
  metadata: any;
};
