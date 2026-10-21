import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';

interface MusicContextType {
  isMuted: boolean;
  isVideoPlaying: boolean;
  toggleMute: () => void;
  setVideoActive: (active: boolean) => void;
}

const MusicContext = createContext<MusicContextType>({
  isMuted: false,
  isVideoPlaying: false,
  toggleMute: () => {},
  setVideoActive: () => {},
});

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const activeVideosCountRef = useRef(0);

  // Carga la pista temática retro/synth de Beyond Hawkins
  const player = useAudioPlayer(require('@/assets/audio/theme.mp3'));

  useEffect(() => {
    async function setupAudio() {
      try {
        if (Platform.OS !== 'web') {
          await setAudioModeAsync({
            playsInSilentMode: true,
          });
        }
        player.loop = true;
        player.volume = 0.35; // Volumen atmosférico cinematográfico
        if (!isMuted && !isVideoPlaying) {
          player.play();
        }
      } catch (err) {
        console.warn('Audio setup warning:', err);
      }
    }

    setupAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestionar pausa y reanudación automática según estado de video y silencio
  useEffect(() => {
    try {
      if (isMuted || isVideoPlaying) {
        player.pause();
      } else {
        player.volume = 0.35;
        player.play();
      }
    } catch (e) {
      console.warn('Audio playback toggle error:', e);
    }
  }, [isMuted, isVideoPlaying, player]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const setVideoActive = useCallback((active: boolean) => {
    if (active) {
      activeVideosCountRef.current += 1;
      setIsVideoPlaying(true);
    } else {
      activeVideosCountRef.current = Math.max(0, activeVideosCountRef.current - 1);
      if (activeVideosCountRef.current === 0) {
        setIsVideoPlaying(false);
      }
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
        isMuted,
        isVideoPlaying,
        toggleMute,
        setVideoActive,
      }}
    >
      {children}
      <FloatingMusicButton isMuted={isMuted} isVideoPlaying={isVideoPlaying} onToggle={toggleMute} />
    </MusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  return useContext(MusicContext);
}

function FloatingMusicButton({
  isMuted,
  isVideoPlaying,
  onToggle,
}: {
  isMuted: boolean;
  isVideoPlaying: boolean;
  onToggle: () => void;
}) {
  const isPlaying = !isMuted && !isVideoPlaying;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.floatingButton,
        isPlaying ? styles.floatingButtonActive : styles.floatingButtonInactive,
        pressed && styles.pressed,
      ]}
      onPress={onToggle}
      accessibilityLabel={isPlaying ? 'Silenciar música de fondo' : 'Activar música de fondo'}
      accessibilityRole="button"
    >
      <Text style={styles.musicIcon}>
        {isMuted ? '🔇' : isVideoPlaying ? '⏸' : '🎵'}
      </Text>
      <Text style={[styles.musicLabel, isPlaying ? styles.labelActive : styles.labelInactive]}>
        {isMuted ? 'MUTE' : isVideoPlaying ? 'VIDEO' : 'SYNTH'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 24,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 9999,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },
  floatingButtonActive: {
    backgroundColor: 'rgba(25, 10, 14, 0.88)',
    borderColor: '#E50914',
  },
  floatingButtonInactive: {
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    borderColor: '#393540',
  },
  musicIcon: {
    fontSize: 12,
  },
  musicLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  labelActive: {
    color: '#FF3038',
  },
  labelInactive: {
    color: '#8A8696',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
