import { showAlert } from "@/components/CustomAlert";
import { getRandomWord } from "@/data/categories";
import { supabase } from "@/lib/supabase";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

// ── Types ──
export type OnlinePlayer = {
  id: string; // UUID de game_players
  user_id: string;
  display_name: string;
  is_impostor: boolean;
  word: string;
  votes: number;
  has_voted: boolean;
  vote_target: string | null;
  is_ready: boolean;
};

export type GameRoom = {
  id: string; // Código de sala
  host_id: string;
  category_index: number;
  discussion_time: number;
  secret_word: string;
  impostor_id: string | null;
  phase: "lobby" | "roleReveal" | "discussion" | "voting" | "results";
};

type OnlineGameContextType = {
  room: GameRoom | null;
  players: OnlinePlayer[];
  myPlayer: OnlinePlayer | null;
  loading: boolean;
  createRoom: (userId: string, displayName: string) => Promise<string | null>;
  joinRoom: (
    code: string,
    userId: string,
    displayName: string,
  ) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  disconnectFromRoom: () => void;
  updateRoomSettings: (
    categoryIndex: number,
    discussionTime: number,
  ) => Promise<void>;
  startOnlineGame: () => Promise<void>;
  castOnlineVote: (targetUserId: string) => Promise<void>;
  setOnlinePhase: (phase: GameRoom["phase"]) => Promise<void>;
};

const OnlineGameContext = createContext<OnlineGameContextType | undefined>(
  undefined,
);

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function OnlineGameProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<OnlinePlayer[]>([]);
  const [myPlayer, setMyPlayer] = useState<OnlinePlayer | null>(null);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Subscribe to room changes
  const subscribeToRoom = useCallback((roomId: string, userId: string) => {
    // Remove previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setRoom(payload.new as GameRoom);
          } else if (payload.eventType === "DELETE") {
            // Room was deleted
            setRoom(null);
            setPlayers([]);
            setMyPlayer(null);
            showAlert("Sala cerrada", "El host ha cerrado la sala.");
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_players",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Refresh all players
          await fetchPlayers(roomId, userId);
        },
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  const fetchPlayers = async (roomId: string, userId: string) => {
    const { data, error } = await supabase
      .from("game_players")
      .select("*")
      .eq("room_id", roomId)
      .order("joined_at", { ascending: true });

    if (data && !error) {
      setPlayers(data as OnlinePlayer[]);
      const me = data.find((p: any) => p.user_id === userId);
      if (me) setMyPlayer(me as OnlinePlayer);
    }
  };

  const createRoom = async (
    userId: string,
    displayName: string,
  ): Promise<string | null> => {
    setLoading(true);
    try {
      const code = generateRoomCode();

      // Create the room
      const { error: roomError } = await supabase.from("game_rooms").insert({
        id: code,
        host_id: userId,
        category_index: 0,
        discussion_time: 120,
        secret_word: "",
        phase: "lobby",
      });

      if (roomError) {
        showAlert("Error", "No se pudo crear la sala: " + roomError.message);
        setLoading(false);
        return null;
      }

      // Add host as first player
      const { error: playerError } = await supabase
        .from("game_players")
        .insert({
          room_id: code,
          user_id: userId,
          display_name: displayName,
        });

      if (playerError) {
        showAlert("Error", "No se pudo unir a la sala: " + playerError.message);
        setLoading(false);
        return null;
      }

      // Fetch room data
      const { data: roomData } = await supabase
        .from("game_rooms")
        .select("*")
        .eq("id", code)
        .single();

      if (roomData) setRoom(roomData as GameRoom);

      await fetchPlayers(code, userId);
      subscribeToRoom(code, userId);

      setLoading(false);
      return code;
    } catch (e) {
      showAlert("Error", "Error inesperado al crear la sala");
      setLoading(false);
      return null;
    }
  };

  const joinRoom = async (
    code: string,
    userId: string,
    displayName: string,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Check room exists
      const { data: roomData, error: roomError } = await supabase
        .from("game_rooms")
        .select("*")
        .eq("id", code.toUpperCase())
        .single();

      if (roomError || !roomData) {
        showAlert("Error", "La sala no existe. Verifica el código.");
        setLoading(false);
        return false;
      }

      if (roomData.phase !== "lobby") {
        showAlert("Error", "La partida ya comenzó en esta sala.");
        setLoading(false);
        return false;
      }

      // Check if already in room
      const { data: existingPlayer } = await supabase
        .from("game_players")
        .select("id")
        .eq("room_id", code.toUpperCase())
        .eq("user_id", userId)
        .single();

      if (!existingPlayer) {
        // Check player count
        const { count } = await supabase
          .from("game_players")
          .select("*", { count: "exact", head: true })
          .eq("room_id", code.toUpperCase());

        if ((count ?? 0) >= 10) {
          showAlert("Sala llena", "La sala ya tiene 10 jugadores.");
          setLoading(false);
          return false;
        }

        // Join room
        const { error: joinError } = await supabase
          .from("game_players")
          .insert({
            room_id: code.toUpperCase(),
            user_id: userId,
            display_name: displayName,
          });

        if (joinError) {
          showAlert("Error", "No se pudo unir: " + joinError.message);
          setLoading(false);
          return false;
        }
      }

      setRoom(roomData as GameRoom);
      await fetchPlayers(code.toUpperCase(), userId);
      subscribeToRoom(code.toUpperCase(), userId);

      setLoading(false);
      return true;
    } catch (e) {
      showAlert("Error", "Error inesperado");
      setLoading(false);
      return false;
    }
  };

  const leaveRoom = async () => {
    if (!room || !myPlayer) return;

    try {
      if (room.host_id === myPlayer.user_id) {
        // Host leaves: delete room first (CASCADE deletes all players)
        await supabase.from("game_rooms").delete().eq("id", room.id);
      } else {
        // Non-host: just remove own player record
        await supabase
          .from("game_players")
          .delete()
          .eq("room_id", room.id)
          .eq("user_id", myPlayer.user_id);
      }

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      setRoom(null);
      setPlayers([]);
      setMyPlayer(null);
    } catch (e) {
      console.warn("Error leaving room:", e);
    }
  };

  const disconnectFromRoom = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setRoom(null);
    setPlayers([]);
    setMyPlayer(null);
  };

  const updateRoomSettings = async (
    categoryIndex: number,
    discussionTime: number,
  ) => {
    if (!room) return;

    await supabase
      .from("game_rooms")
      .update({
        category_index: categoryIndex,
        discussion_time: discussionTime,
      })
      .eq("id", room.id);
  };

  const startOnlineGame = async () => {
    if (!room || players.length < 3) return;

    const word = getRandomWord(room.category_index);
    const impostorIndex = Math.floor(Math.random() * players.length);
    const impostorUserId = players[impostorIndex].user_id;

    // Update room
    await supabase
      .from("game_rooms")
      .update({
        secret_word: word,
        impostor_id: impostorUserId,
        phase: "roleReveal",
      })
      .eq("id", room.id);

    // Update each player
    for (const player of players) {
      const isImpostor = player.user_id === impostorUserId;
      await supabase
        .from("game_players")
        .update({
          is_impostor: isImpostor,
          word: isImpostor ? "???" : word,
          votes: 0,
          has_voted: false,
          vote_target: null,
        })
        .eq("id", player.id);
    }
  };

  const castOnlineVote = async (targetUserId: string) => {
    if (!room || !myPlayer) return;

    // Mark voter as voted
    await supabase
      .from("game_players")
      .update({
        has_voted: true,
        vote_target: targetUserId,
      })
      .eq("id", myPlayer.id);

    // Atomic increment: use rpc to avoid race condition when
    // multiple players vote for the same target simultaneously
    const target = players.find((p) => p.user_id === targetUserId);
    if (target) {
      const { error } = await supabase.rpc("increment_votes", {
        player_id: target.id,
      });
      // Fallback if RPC doesn't exist yet
      if (error) {
        await supabase
          .from("game_players")
          .update({ votes: (target.votes ?? 0) + 1 })
          .eq("id", target.id);
      }
    }
  };

  const setOnlinePhase = async (phase: GameRoom["phase"]) => {
    if (!room) return;
    await supabase.from("game_rooms").update({ phase }).eq("id", room.id);
  };

  return (
    <OnlineGameContext.Provider
      value={{
        room,
        players,
        myPlayer,
        loading,
        createRoom,
        joinRoom,
        leaveRoom,
        disconnectFromRoom,
        updateRoomSettings,
        startOnlineGame,
        castOnlineVote,
        setOnlinePhase,
      }}
    >
      {children}
    </OnlineGameContext.Provider>
  );
}

export function useOnlineGame() {
  const context = useContext(OnlineGameContext);
  if (!context) {
    throw new Error("useOnlineGame must be used within an OnlineGameProvider");
  }
  return context;
}
