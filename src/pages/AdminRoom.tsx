import { useHistory, useParams } from "react-router-dom";
import answerImg from "../assets/images/answer.svg";
import checkImg from "../assets/images/check.svg";
import deleteImg from "../assets/images/delete.svg";
import foneImg from "../assets/images/fone.png";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { SongRequest } from "../components/SongRequest";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { requests, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleCheckSongRequestAsAnswered(requestId: string) {
    await database.ref(`rooms/${roomId}/requests/${requestId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightSongRequest(
    requestId: string,
    highlightId: string | undefined
  ) {
    if (highlightId) {
      await database
        .ref(`rooms/${roomId}/requests/${requestId}/highlights/${highlightId}`)
        .remove();
      await database.ref(`rooms/${roomId}/requests/${requestId}`).update({
        isHighlighted: false,
      });
    } else {
      await database
        .ref(`rooms/${roomId}/requests/${requestId}/highlights`)
        .push({
          authorId: user?.id,
        });

      await database.ref(`rooms/${roomId}/requests/${requestId}`).update({
        isHighlighted: true,
      });
    }
  }

  async function handleDeleteSongRequest(requestId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/requests/${requestId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={foneImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {requests.length > 0 && <span>{requests.length} pergunta(s) </span>}
        </div>
        {requests.length > 0 ? (
          <div className="requests-list">
            {requests.map((request) => {
              return (
                <SongRequest
                  key={request.id}
                  content={request.content}
                  author={request.author}
                  isAnswered={request.isAnswered}
                  isHighlighted={request.isHighlighted}
                >
                  {!request.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckSongRequestAsAnswered(request.id)
                        }
                      >
                        <img
                          src={checkImg}
                          alt="Marcar pergunta como respondida"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleHighlightSongRequest(
                            request.id,
                            request.highlightId
                          )
                        }
                      >
                        <img src={answerImg} alt="Destacar pergunta" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteSongRequest(request.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </SongRequest>
              );
            })}
          </div>
        ) : (
          <p>Aguardando pedidos...</p>
        )}
      </main>
    </div>
  );
}
