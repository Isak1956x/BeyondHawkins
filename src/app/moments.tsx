import { useBackgroundMusic } from '@/context/music-context';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const moments = [
  {
    id: '1',
    title: 'El poder de Eleven',
    subtitle: 'Cuando Once voltea la camioneta',
    description:
      'Once demuestra el increíble alcance de sus poderes al levantar y voltear una camioneta para salvar a Mike, Dustin y Lucas.',
    image:
      'https://images.openai.com/static-rsc-4/pXEHDYvyblyaHpKsg6Sdhqb-nMadDf6Esonh9huOxMssFu2IZLHOsGEKyrK0PP-TgtOfAFPtE-rluU_G3w_5QQi4QkvlgWCbheDgarsYy_NHx4SKvN88hRsnhb2Fvu2PIxE3TI8438NATnWtgq0JlvixcbQQyBWzNaUruF2ftOo?purpose=inline',
    youtubeId: '5NSajPdA5VE',
  },
  {
    id: '2',
    title: 'Corre hacia la libertad',
    subtitle: 'La carrera contra Vecna',
    description:
      'Max lucha por escapar del control de Vecna mientras suena Running Up That Hill, una canción que se convierte en su conexión con la realidad y su esperanza de sobrevivir.',
    image:
      'https://images.openai.com/static-rsc-4/fLm1dHEMI-SjjI7GJnQ_vmQ_sJDvHl5KfhpTi4uKx-k3r5Ct0N9vErAo76yGJ0Sl-3mpPhNXAYuIW4LvvMRki0NUD7u4QlHZC29NKTTtAiPiB_hPgjmnC144vizm16BvUpSfSiqyuJBn8YHl_O-xq0oDzhBDg63qXaN8x0urXLc?purpose=inline',
    youtubeId: 'bV0RAcuG2Ao',
  },
  {
    id: '3',
    title: 'El despertar de Will',
    subtitle: 'Cuando Will obtiene sus poderes',
    description:
      'Will descubre una conexión especial con las fuerzas sobrenaturales y con el Mundo del Revés. Su despertar marca un momento importante en su historia.',
    image:
      'https://images.openai.com/static-rsc-4/WSHNVvV83bMlWFRWuenVT9zr4KW-W5XJgXY4wz7ztkq4fv5rNFoYzvJsjy-kRrs0rHy8rbU9ZtwIlxk8OeJ_k1NR17FBVDX4YqL-uz-G_h3XYt4tAHvfyTR9OZzi3OnqWNrYCmjSKsTHmXTWHw7b84ilp0Eh2ewmTfL5Rd87n7Q?purpose=inline',
    youtubeId: '1KbrXzWwnXo',
  },
];

function MomentVideo({ youtubeId }: { youtubeId: string }) {
  const { setVideoActive } = useBackgroundMusic();
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Al entrar al video, pausa la música ambiental
    setVideoActive(true);
    return () => {
      // Al salir de la vista del momento, reanuda la música ambiental
      setVideoActive(false);
    };
  }, [setVideoActive]);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?playsinline=1&rel=0&modestbranding=1&controls=1&autoplay=0`;

  return (
    <View style={styles.videoWrapper}>
      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No se pudo cargar el video</Text>
          <Text style={styles.errorSubtitle}>Verifica tu conexión a internet</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              setReloadKey((k) => k + 1);
            }}
          >
            <Text style={styles.retryText}>REINTENTAR</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          key={reloadKey}
          source={{
            uri: embedUrl,
            headers: {
              Referer: 'https://com.isak1956x.BeyondHawkins',
            },
          }}
          style={styles.video}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo={true}
          originWhitelist={['*']}
          scrollEnabled={false}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#E50914" />
              <Text style={styles.loadingText}>Conectando con YouTube...</Text>
            </View>
          )}
          onError={() => {
            setHasError(true);
          }}
          onShouldStartLoadWithRequest={(request) => {
            const url = request.url.toLowerCase();
            // Bloquear intentos de abrir la app de YouTube o ver externamente
            if (
              url.includes('watch?v=') ||
              url.includes('/channel/') ||
              url.includes('/@') ||
              url.includes('m.youtube.com/watch')
            ) {
              return false;
            }
            return true;
          }}
        />
      )}

      <View style={styles.controlsBar}>
        <View style={styles.liveIndicator}>
          <View style={[styles.statusDot, styles.statusPlaying]} />
          <Text style={styles.statusLabel}>YOUTUBE PLAYER</Text>
        </View>
        <Text style={styles.tapTip}>STREAMING HD</Text>
      </View>
    </View>
  );
}

export default function MomentsScreen() {
  const [selected, setSelected] =
    useState<(typeof moments)[number] | null>(null);

  // Al salir de la pantalla a otro nav, salir del momento actual a la pantalla general
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelected(null);
      };
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ARCHIVOS DE HAWKINS</Text>
        <Text style={styles.title}>MOMENTOS</Text>
        <Text style={styles.subtitle}>
          Escenas que marcaron la historia.
          Revive los momentos más inolvidables.
        </Text>
      </View>

      {selected ? (
        <View style={styles.detail}>
          <Pressable
            onPress={() => setSelected(null)}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← VOLVER A MOMENTOS
            </Text>
          </Pressable>

          <Text style={styles.detailTitle}>
            {selected.title}
          </Text>

          <Text style={styles.detailSubtitle}>
            {selected.subtitle}
          </Text>

          <Text style={styles.description}>
            {selected.description}
          </Text>

          <Text style={styles.videoLabel}>
            REPRODUCE EL MOMENTO
          </Text>

          <MomentVideo youtubeId={selected.youtubeId} />
        </View>
      ) : (
        <View style={styles.list}>
          {moments.map((moment, index) => (
            <Pressable
              key={moment.id}
              style={styles.card}
              onPress={() => setSelected(moment)}
            >
              <Image
                source={{ uri: moment.image }}
                style={styles.image}
              />

              <View style={styles.number}>
                <Text style={styles.numberText}>
                  0{index + 1}
                </Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>
                  {moment.title}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {moment.subtitle}
                </Text>
                <Text style={styles.viewMore}>
                  VER MOMENTO ↗
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          BEYOND HAWKINS · THE STORY CONTINUES
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },
  eyebrow: {
    color: '#E50914',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  list: {
    paddingHorizontal: 18,
  },
  card: {
    marginBottom: 25,
    backgroundColor: '#141414',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#292020',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#181818',
  },
  number: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#E50914',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  cardInfo: {
    padding: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: '#999999',
    fontSize: 13,
    marginTop: 7,
  },
  viewMore: {
    color: '#FF3038',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 15,
  },
  detail: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#241012',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  backText: {
    color: '#FF3038',
    fontWeight: '800',
    fontSize: 11,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
  },
  detailSubtitle: {
    color: '#FF3038',
    fontSize: 14,
    marginTop: 8,
  },
  description: {
    color: '#BBBBBB',
    fontSize: 14,
    lineHeight: 23,
    marginTop: 15,
  },
  videoLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 25,
    marginBottom: 12,
  },
  videoWrapper: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#2D1518',
  },
  video: {
    width: '100%',
    height: 230,
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  errorContainer: {
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#140c0d',
    gap: 8,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  errorSubtitle: {
    color: '#888888',
    fontSize: 11,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#222026',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusPlaying: {
    backgroundColor: '#E50914',
  },
  statusPaused: {
    backgroundColor: '#888888',
  },
  statusLabel: {
    color: '#CCCCCC',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tapTip: {
    color: '#777777',
    fontSize: 10,
  },
  footer: {
    paddingTop: 25,
    paddingHorizontal: 25,
    paddingBottom: 110,
    alignItems: 'center',
  },
  footerText: {
    color: '#555555',
    fontSize: 9,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
