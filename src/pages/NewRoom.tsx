import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import { Button } from "../components/Button";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import "../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <div>
          <strong>Crie salas de playlist ao-vivo</strong>
          <p>Tire as dúvidas da sua audiência em tempo real</p>
        </div>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
          <ThemeSwitcher />
        </div>
      </main>
    </div>
  );
}
