
import { useBackgroundMusic } from '@/context/music-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

let hasIntroPlayedGlobally = false;

export default function HomeScreen() {
  const router = useRouter();
  const { setVideoActive } = useBackgroundMusic();

  const player = useVideoPlayer(
    require('@/assets/videos/intro.mp4'),
    (player) => {
      player.loop = false;
      if (!hasIntroPlayedGlobally) {
        player.play();
      }
    }
  );

  useFocusEffect(
    useCallback(() => {
      if (!hasIntroPlayedGlobally) {
        // Primera vez que se abre la app: reproduce el video de intro
        setVideoActive(true);
        try {
          player.play();
        } catch {
          // Ignorar si el reproductor aún no está listo
        }
      } else {
        // Si ya pasó la animación: se queda quieto y suena la música de fondo
        setVideoActive(false);
      }

      return () => {
        hasIntroPlayedGlobally = true;
        try {
          player.pause();
        } catch {
          // Ignorar si ya fue liberado
        }
        setVideoActive(false);
      };
    }, [player, setVideoActive])
  );

  useEffect(() => {
    const subscription = player.addListener(
      'playToEnd',
      () => {
        hasIntroPlayedGlobally = true;
        // Al terminar el video de intro, suena la música de fondo
        setVideoActive(false);
      }
    );

    return () => subscription.remove();
  }, [player, setVideoActive]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
      />

      <View style={styles.overlay}>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/personajes')}
        >
          <Text style={styles.buttonText}>
            EXPLORAR HAWKINS
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 200,
  },
  button: {
    backgroundColor: '#E50914',
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
