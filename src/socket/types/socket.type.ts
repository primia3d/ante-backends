export interface User {
  userId: string;
  userName: string;
  socketId: string;
}

export interface Room {
  name: string;
  host: User;
  users: User[];
}

export interface payload<T> {
  message: string;
  data: T;
}

export interface RequestPayload {
  message: string;
  data: object;
}

export interface ServerToClientEvents<T> {
  [eventName: string]: (eventPayload: payload<T>) => void;
}

export interface ClientToServerEvents<T> {
  [eventName: string]: (eventPayload: payload<T>) => void;
}
