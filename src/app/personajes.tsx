
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

const characters = [
  {
    name: 'Eleven',
    actor: 'Millie Bobby Brown',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaRGJxLouqOAVb0El-8h28x1CGnxumfh2b83RJh1JloMWCkDrTpK27Nio&s=10',
    description:
      'Una chica con habilidades psíquicas extraordinarias que intenta descubrir quién es y de dónde viene.',
    ability: 'Telequinesis',
  },
  {
    name: 'Mike Wheeler',
    actor: 'Finn Wolfhard',
    image:
      'https://i.redd.it/fjp4tvslcq1g1.jpeg',
    description:
      'Uno de los amigos más cercanos de Eleven y una pieza fundamental del grupo de Hawkins.',
    ability: 'Liderazgo',
  },
  {
    name: 'Dustin Henderson',
    actor: 'Gaten Matarazzo',
    image:
      'https://i.namu.wiki/i/SJvwxT0Or2dvklVcPyLKxPxx1Lw9Z2nay90lZPQFoUcZBcZ-GAlrr4G0_1-V4-G_HcjNd2s8ad3Po-CBjAN-7A.webp',
    description:
      'Inteligente, divertido y leal. Siempre aporta ideas para resolver los misterios.',
    ability: 'Ingenio',
  },
  {
    name: 'Lucas Sinclair',
    actor: 'Caleb McLaughlin',
    image:
      'https://i.namu.wiki/i/IjV9eXcWTvlbs8y1EUvyVVCXQpW_fDhrsns96ohsbg18FYKyYKTc0INt-mNiowbq3CQkXvAv9npLBfLlBYbwAQ.webp',
    description:
      'Valiente y práctico, siempre dispuesto a proteger a sus amigos.',
    ability: 'Estrategia',
  },
  {
    name: 'Max Mayfield',
    actor: 'Sadie Sink',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuDRCOGnZZa5MNB-W8H8ji72ItvzmNwZKri6991u0rLgwtRuPDpQb4gG0&s=10',
    description:
      'Independiente y decidida, encuentra su lugar dentro del grupo.',
    ability: 'Determinación',
  },
  {
    name: 'Will Byers',
    actor: 'Noah Schnapp',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPs2VQsg-yCns7320pndYY90cXusDFePiGCuKeYTTV_Mxit3Bm16m6cC81&s=10',
    description:
      'Su desaparición desencadena muchos de los acontecimientos misteriosos de Hawkins.',
    ability: 'Conexión con el Mundo del Revés',
  },
];

export default function PersonajesScreen() {
  const [selected, setSelected] = useState<
    (typeof characters)[number] | null
  >(null);

  // Al cambiar de tab en el nav o salir, regresar a la pantalla principal de personajes
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
        <Text style={styles.eyebrow}>EL UNIVERSO DE</Text>
        <Text style={styles.title}>PERSONAJES</Text>
        <Text style={styles.subtitle}>
          Conoce a quienes forman parte de la historia de Hawkins.
        </Text>
      </View>

      {selected ? (
        <View style={styles.detail}>
          {/* Botón superior directo y accesible para volver */}
          <Pressable
            style={styles.topBackButton}
            onPress={() => setSelected(null)}
            accessibilityRole="button"
          >
            <Text style={styles.topBackArrow}>←</Text>
            <Text style={styles.topBackText}>VOLVER A PERSONAJES</Text>
          </Pressable>

          <Image
            source={{ uri: selected.image }}
            style={styles.detailImage}
          />

          <Text style={styles.detailName}>{selected.name}</Text>
          <Text style={styles.actor}>{selected.actor}</Text>

          <Text style={styles.sectionTitle}>Su historia</Text>
          <Text style={styles.description}>
            {selected.description}
          </Text>

          <Text style={styles.sectionTitle}>Característica</Text>
          <Text style={styles.description}>
            {selected.ability}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => setSelected(null)}
          >
            <Text style={styles.backText}>
              ← VOLVER A PERSONAJES
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          {characters.map((character) => (
            <Pressable
              key={character.name}
              style={styles.card}
              onPress={() => setSelected(character)}
            >
              <Image
                source={{ uri: character.image }}
                style={styles.image}
              />

              <View style={styles.cardInfo}>
                <Text style={styles.name}>
                  {character.name}
                </Text>
                <Text style={styles.actorSmall}>
                  {character.actor}
                </Text>
                <Text style={styles.viewMore}>
                  VER PERFIL ↗
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          BEYOND HAWKINS · EXPLORE THE UNKNOWN
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
    paddingBottom: 24,
  },
  eyebrow: {
    color: '#E50914',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  card: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 22,
  },
  image: {
    width: '100%',
    height: 225,
    borderRadius: 10,
    backgroundColor: '#181818',
  },
  cardInfo: {
    paddingTop: 10,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  actorSmall: {
    color: '#999999',
    fontSize: 11,
    marginTop: 4,
  },
  viewMore: {
    color: '#FF3038',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 10,
  },
  detail: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  topBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#241012',
    borderWidth: 1,
    borderColor: '#4A1218',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  topBackArrow: {
    color: '#FF3038',
    fontSize: 16,
    fontWeight: '900',
  },
  topBackText: {
    color: '#FF3038',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  detailImage: {
    width: '100%',
    height: 390,
    borderRadius: 12,
    backgroundColor: '#181818',
  },
  detailName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 18,
  },
  actor: {
    color: '#FF3038',
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    color: '#BBBBBB',
    fontSize: 14,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: '#E50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
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
    letterSpacing: 2,
    
    textAlign: 'center',
  },
});
