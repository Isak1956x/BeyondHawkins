
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MÁS ALLÁ DE HAWKINS</Text>
        <Text style={styles.title}>ACERCA DE</Text>
        <Text style={styles.subtitle}>
          Descubre la historia detrás de Stranger Things.
        </Text>
      </View>

      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original',
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          UNA HISTORIA EXTRAORDINARIA
        </Text>

        <Text style={styles.description}>
          Stranger Things es una serie de ciencia ficción,
          misterio y terror ambientada en Hawkins, Indiana.
          La desaparición de un niño revela experimentos
          secretos, fuerzas sobrenaturales y la existencia
          de una dimensión aterradora conocida como el
          Mundo del Revés.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          DATOS DE LA SERIE
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>AÑO DE ESTRENO</Text>
          <Text style={styles.value}>2016</Text>

          <Text style={styles.label}>CREADORES</Text>
          <Text style={styles.value}>
            Matt y Ross Duffer
          </Text>

          <Text style={styles.label}>GÉNERO</Text>
          <Text style={styles.value}>
            Ciencia ficción, drama y terror
          </Text>

          <Text style={styles.label}>AMBIENTACIÓN</Text>
          <Text style={styles.value}>
            Hawkins, Indiana
          </Text>

          <Text style={styles.label}>TEMPORADAS</Text>
          <Text style={styles.value}>5 temporadas</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          ¿POR QUÉ ES ESPECIAL?
        </Text>

        <Text style={styles.description}>
          La amistad, el valor y la unión son el corazón
          de esta historia. Un grupo de jóvenes se enfrenta
          a peligros inexplicables mientras descubre que
          juntos pueden luchar contra lo desconocido.
        </Text>

        <View style={styles.quote}>
          <Text style={styles.quoteText}>
            FRIENDS DON'T LIE.
          </Text>
          <Text style={styles.quoteCaption}>
            Una frase que representa el vínculo entre
            los protagonistas.
          </Text>
        </View>

        <Text style={styles.footer}>
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
    paddingBottom: 24,
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
  banner: {
    width: '100%',
    height: 190,
    backgroundColor: '#180909',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 110,
  },
  sectionTitle: {
    color: '#E50914',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  description: {
    color: '#BBBBBB',
    fontSize: 14,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#302020',
    marginVertical: 25,
  },
  infoCard: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#302020',
    borderRadius: 10,
    padding: 18,
  },
  label: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 12,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
  },
  quote: {
    marginTop: 25,
    padding: 22,
    backgroundColor: '#1B0A0C',
    borderLeftWidth: 3,
    borderLeftColor: '#E50914',
    borderRadius: 5,
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  quoteCaption: {
    color: '#AAAAAA',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
  },
  footer: {
    color: '#555555',
    fontSize: 9,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 35,
  },
});
