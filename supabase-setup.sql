-- ═══════════════════════════════════════════════════════
-- SQL para configurar Supabase - The Impostor App
-- Ejecutar en: Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════

-- Perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grupos guardados
CREATE TABLE IF NOT EXISTS saved_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  players TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salas de juego (para tiempo real)
CREATE TABLE IF NOT EXISTS game_rooms (
  id TEXT PRIMARY KEY,
  host_id UUID REFERENCES auth.users(id),
  category_index INTEGER DEFAULT 0,
  discussion_time INTEGER DEFAULT 120,
  secret_word TEXT DEFAULT '',
  impostor_id UUID,
  phase TEXT DEFAULT 'lobby',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jugadores en una sala
CREATE TABLE IF NOT EXISTS game_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT REFERENCES game_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  is_impostor BOOLEAN DEFAULT FALSE,
  word TEXT DEFAULT '',
  votes INTEGER DEFAULT 0,
  has_voted BOOLEAN DEFAULT FALSE,
  vote_target UUID,
  is_ready BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;

-- Profiles: permitir a usuarios autenticados insertar su propio perfil
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- Trigger: crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Saved groups
CREATE POLICY "Users can manage own groups" ON saved_groups FOR ALL USING (auth.uid() = user_id);

-- Game rooms (todos pueden ver, solo host puede modificar)
CREATE POLICY "Anyone can view game rooms" ON game_rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rooms" ON game_rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host can update room" ON game_rooms FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Host can delete room" ON game_rooms FOR DELETE USING (auth.uid() = host_id);

-- Game players (todos pueden ver, cada usuario maneja su propio registro)
CREATE POLICY "Anyone can view game players" ON game_players FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join" ON game_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own player" ON game_players FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Host can update any player in room" ON game_players FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM game_rooms WHERE game_rooms.id = game_players.room_id AND game_rooms.host_id = auth.uid()
  )
);
CREATE POLICY "Users can leave room" ON game_players FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Host can remove players from room" ON game_players FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM game_rooms WHERE game_rooms.id = game_players.room_id AND game_rooms.host_id = auth.uid()
  )
);

-- ═══════════════════════════════════════════════════════
-- Función RPC para incremento atómico de votos
-- Evita race conditions cuando múltiples jugadores votan
-- al mismo objetivo simultáneamente
-- ═══════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.increment_votes(player_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE game_players
  SET votes = votes + 1
  WHERE id = player_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════
-- Habilitar Realtime para las tablas de juego
-- ═══════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE game_players;
