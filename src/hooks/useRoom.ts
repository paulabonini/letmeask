import { useEffect } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type FirebaseSongRequests = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
      authorId: string
    }>
  }
>;

type SongRequestType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string) {
  const {user} = useAuth();
  const [requests, setRequests] = useState<SongRequestType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseSongRequests: FirebaseSongRequests = databaseRoom.requests ?? {};

      const parsedRequests = Object.entries(firebaseSongRequests).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(([key, like])=> like.authorId === user?.id)?.[0]
          };
        }
      );

      setTitle(databaseRoom.title);
      setRequests(parsedRequests);
    });

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return {requests, title}
}