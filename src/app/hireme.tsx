import React from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  background: '#07080D',
  card: '#11131C',
  cardLight: '#191B26',
  red: '#F21D3D',
  redDark: '#6D1025',
  white: '#F7F5F6',
  muted: '#A4A3B0',
  border: '#29232F',
  gold: '#E6BE77',
};

const email = 'isaaccabrerasilverio12@gmail.com';
const github = 'https://github.com/Isak1956x';
const linkedin = 'https://www.linkedin.com/in/isaac-cabrera-silverio';
const whatsapp = 'https://wa.me/18093082048?text=Hola%20Isaac%2C%20vi%20tu%20portafolio';

const skills = [
  'JavaScript',
  'TypeScript',
  'NestJS',
  'Node.js',
  'React Native',
  'Expo',
  'Supabase',
  'SQL',
  'Git',
  'HTML / CSS',
];

async function openLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'No se pudo abrir el enlace',
      'Intenta nuevamente o utiliza otro medio de contacto.',
    );
  }
}

function ContactButton({
  label,
  subtitle,
  onPress,
  primary = false,
}: {
  label: string;
  subtitle: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.contactButton,
        primary && styles.primaryButton,
        pressed && styles.buttonPressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.contactTextContainer}>
        <Text
          style={[
            styles.contactLabel,
            primary && styles.primaryButtonText,
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.contactSubtitle,
            primary && styles.primaryButtonSubtitle,
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <Text
        style={[
          styles.arrow,
          primary && styles.primaryButtonText,
        ]}
      >
        ↗
      </Text>
    </Pressable>
  );
}

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionNumber}>{number}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function ContratameScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.topBar}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>BH</Text>
          </View>

          <View style={styles.topBarText}>
            <Text style={styles.brandName}>BEYOND HAWKINS</Text>
            <Text style={styles.brandSubtitle}>PERSONAL PORTFOLIO</Text>
          </View>

          <View style={styles.availableBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.availableText}>DISPONIBLE</Text>
          </View>
        </View>

        {/* Presentación */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            {'<'} SOFTWARE DEVELOPER {'/>'}
          </Text>

          <View style={styles.photoFrame}>
            <View style={styles.photoGlow} />
            <Image
              source={require('@/assets/images/isaacft.jpg')}
              style={styles.profileImage}
              resizeMode="cover"
              accessibilityLabel="Foto de Isaac Cabrera"
            />

            <View style={styles.photoLabel}>
              <Text style={styles.photoLabelText}>ISAAC C.</Text>
            </View>
          </View>

          <Text style={styles.heroName}>Isaac Cabrera</Text>
          <Text style={styles.heroRole}>
            Desarrollador de software en formación
          </Text>

          <Text style={styles.heroDescription}>
            Transformo ideas en experiencias digitales. Me interesa crear
            aplicaciones útiles, explorar nuevas tecnologías y desarrollar
            soluciones que resuelvan problemas reales.
          </Text>

          <Pressable
            onPress={() => openLink(`mailto:${email}`)}
            style={({ pressed }) => [
              styles.heroButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.heroButtonText}>TRABAJEMOS JUNTOS</Text>
            <Text style={styles.heroButtonArrow}>↗</Text>
          </Pressable>

          <Text style={styles.heroFootnote}>
            DESARROLLO · CREATIVIDAD · APRENDIZAJE CONSTANTE
          </Text>
        </View>

        {/* Acerca de mí */}
        <View style={styles.section}>
          <SectionTitle number="01" title="Sobre mí" />

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              Curioso por naturaleza. Creador por elección.
            </Text>

            <Text style={styles.bodyText}>
              Soy estudiante de desarrollo de software en ITLA. Disfruto
              aprender cómo funciona la tecnología y convertir lo que aprendo
              en proyectos reales.
            </Text>

            <Text style={styles.bodyText}>
              Me interesa especialmente el desarrollo backend y móvil, las
              APIs, las bases de datos y la construcción de productos digitales.
              Busco oportunidades para seguir creciendo y aportar valor a un
              equipo.
            </Text>

            <View style={styles.infoFooter}>
              <Text style={styles.infoFooterText}>📍 República Dominicana</Text>
              <Text style={styles.infoFooterText}>💻 Software & Tech</Text>
            </View>
          </View>
        </View>

        {/* Habilidades */}
        <View style={styles.section}>
          <SectionTitle number="02" title="Mi arsenal tecnológico" />

          <Text style={styles.sectionDescription}>
            Herramientas y tecnologías con las que he trabajado o estoy
            desarrollando experiencia.
          </Text>

          <View style={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillIndex}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Proyectos */}
        <View style={styles.section}>
          <SectionTitle number="03" title="Proyectos destacados" />

          <Text style={styles.sectionDescription}>
            Ideas convertidas en experiencias digitales.
          </Text>

          <View style={styles.projectCard}>
            <View style={styles.projectTop}>
              <View style={styles.projectIcon}>
                <Text style={styles.projectIconText}>BH</Text>
              </View>
              <Text style={styles.projectCategory}>MOBILE APP</Text>
            </View>

            <Text style={styles.projectTitle}>Beyond Hawkins</Text>
            <Text style={styles.projectDescription}>
              Aplicación temática inspirada en Stranger Things, con secciones
              interactivas, personajes, momentos de la serie y un minijuego
              de supervivencia.
            </Text>

            <View style={styles.projectTags}>
              <Text style={styles.projectTag}>React Native</Text>
              <Text style={styles.projectTag}>Expo</Text>
              <Text style={styles.projectTag}>TypeScript</Text>
            </View>
          </View>

          <View style={styles.projectCard}>
            <View style={styles.projectTop}>
              <View style={styles.projectIcon}>
                <Text style={styles.projectIconText}>BA</Text>
              </View>
              <Text style={styles.projectCategory}>WEB APP</Text>
            </View>

            <Text style={styles.projectTitle}>Barber Appointment</Text>
            <Text style={styles.projectDescription}>
              Proyecto de reservas para barberías, orientado a organizar citas
              y facilitar la gestión de los negocios desde una experiencia
              adaptable a dispositivos móviles.
            </Text>

            <View style={styles.projectTags}>
              <Text style={styles.projectTag}>Supabase</Text>
              <Text style={styles.projectTag}>Reservas</Text>
              <Text style={styles.projectTag}>SaaS</Text>
            </View>
          </View>

          <View style={styles.projectCard}>
            <View style={styles.projectTop}>
              <View style={styles.projectIcon}>
                <Text style={styles.projectIconText}>API</Text>
              </View>
              <Text style={styles.projectCategory}>BACKEND</Text>
            </View>

            <Text style={styles.projectTitle}>APIs y aplicaciones CRUD</Text>
            <Text style={styles.projectDescription}>
              Prácticas de desarrollo de servicios y aplicaciones con
              operaciones de creación, consulta, actualización y eliminación,
              validación de datos y organización por capas.
            </Text>

            <View style={styles.projectTags}>
              <Text style={styles.projectTag}>NestJS</Text>
              <Text style={styles.projectTag}>Node.js</Text>
              <Text style={styles.projectTag}>SQL</Text>
            </View>
          </View>
        </View>

        {/* Contacto */}
        <View style={styles.section}>
          <SectionTitle number="04" title="Hablemos" />

          <Text style={styles.contactHeading}>
            ¿Tienes una idea en mente?
          </Text>

          <Text style={styles.sectionDescription}>
            Estoy abierto a conversar sobre proyectos, oportunidades de
            prácticas y colaboraciones tecnológicas.
          </Text>

          <View style={styles.contactList}>
            <ContactButton
              label="Correo electrónico"
              subtitle={email}
              primary
              onPress={() => openLink(`mailto:${email}`)}
            />

            <ContactButton
              label="WhatsApp"
              subtitle="+1 (809) 308-2048"
              onPress={() => openLink(whatsapp)}
            />

            <ContactButton
              label="GitHub"
              subtitle="Explora mi código y proyectos"
              onPress={() => openLink(github)}
            />

            <ContactButton
              label="LinkedIn"
              subtitle="Conectemos profesionalmente"
              onPress={() => openLink(linkedin)}
            />
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />

          <Text style={styles.footerBrand}>ISAAC CABRERA</Text>
          <Text style={styles.footerQuote}>
            Construyendo hoy lo que quiero ver mañana.
          </Text>

          <Text style={styles.footerCopyright}>
            BEYOND HAWKINS · 2026
          </Text>

          <Text style={styles.footerNote}>
            Hecho con curiosidad y mucho código.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.redDark,
    borderWidth: 1,
    borderColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: -1,
  },
  topBarText: {
    marginLeft: 10,
    flex: 1,
  },
  brandName: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  brandSubtitle: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 1.8,
    marginTop: 4,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#294638',
    backgroundColor: '#11231C',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#58D68D',
    marginRight: 5,
  },
  availableText: {
    color: '#91DDB1',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  hero: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 32,
  },
  eyebrow: {
    color: COLORS.red,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 24,
  },
  photoFrame: {
    width: 174,
    height: 190,
    borderRadius: 25,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.red,
    backgroundColor: COLORS.card,
    transform: [{ rotate: '-2deg' }],
    marginBottom: 25,
  },
  photoGlow: {
    position: 'absolute',
    top: -5,
    right: -5,
    bottom: -5,
    left: -5,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.redDark,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  photoLabel: {
    position: 'absolute',
    right: -9,
    bottom: 12,
    backgroundColor: COLORS.red,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 5,
    transform: [{ rotate: '2deg' }],
  },
  photoLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroName: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  heroRole: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  heroDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 17,
    marginBottom: 22,
    maxWidth: 340,
  },
  heroButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.red,
    borderRadius: 12,
    paddingVertical: 17,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  heroButtonArrow: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },
  heroFootnote: {
    color: '#777480',
    fontSize: 8,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 16,
  },

  section: {
    marginTop: 16,
    marginBottom: 25,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  sectionNumber: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: '900',
    marginRight: 11,
    letterSpacing: 1,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: -6,
    marginBottom: 17,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 19,
  },
  infoTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
    marginBottom: 13,
  },
  bodyText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 12,
  },
  infoFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  infoFooterText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    marginRight: 15,
    marginBottom: 5,
  },

  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -8,
    marginBottom: -8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingVertical: 11,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  skillIndex: {
    color: COLORS.red,
    fontSize: 9,
    fontWeight: '900',
    marginRight: 7,
  },
  skillText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },

  projectCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
  },
  projectTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  projectIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: '#28111B',
    borderWidth: 1,
    borderColor: COLORS.redDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectIconText: {
    color: COLORS.red,
    fontWeight: '900',
    fontSize: 13,
  },
  projectCategory: {
    color: COLORS.red,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  projectTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  projectDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 20,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  projectTag: {
    color: '#D7C7CE',
    backgroundColor: COLORS.cardLight,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    fontSize: 10,
    fontWeight: '700',
    marginRight: 7,
    marginBottom: 5,
  },

  contactHeading: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginBottom: 13,
  },
  contactList: {
    marginTop: 5,
  },
  contactButton: {
    minHeight: 73,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  contactTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  contactLabel: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  contactSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  primaryButtonSubtitle: {
    color: '#FFE0E5',
  },
  arrow: {
    color: COLORS.red,
    fontSize: 23,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  footer: {
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 10,
  },
  footerLine: {
    width: 45,
    height: 3,
    backgroundColor: COLORS.red,
    borderRadius: 2,
    marginBottom: 20,
  },
  footerBrand: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
  },
  footerQuote: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 9,
    textAlign: 'center',
  },
  footerCopyright: {
    color: '#6D6976',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 23,
  },
  footerNote: {
    color: '#6D6976',
    fontSize: 10,
    marginTop: 7,
  },
});
