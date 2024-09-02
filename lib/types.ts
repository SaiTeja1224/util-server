import type { TUser } from "../models/user-modal";

export type TPublicUser = Pick<TUser, "username" | "_id">;
export type Token = { user: TPublicUser };
export type RefreshToken = { user: TPublicUser; sessionId: string };
