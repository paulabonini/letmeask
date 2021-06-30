import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import googleIconImg from "../assets/images/google.png";
import logoImg from "../assets/images/logo.png";
import arrowDownImg from "../assets/images/arrow-down.png";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import "../styles/auth.scss";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exists.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }
  return (
    <div id="page-auth">
      <aside>
        <div>
          <strong>Crie salas de playlist ao-vivo</strong>
          <p>Atenda aos pedidos da audiência em tempo real</p>
        </div>
        <img src={arrowDownImg} alt="" className="mobile" />
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
          <ThemeSwitcher />
        </div>
      </main>
    </div>
  );
}
