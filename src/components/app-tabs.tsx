import React from 'react';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';

const TAB_CONFIG: Record<
  string,
  {
    label: string;
    icon: SymbolViewProps['name'];
    highlight?: boolean;
    accentColor?: string;
  }
> = {
  index: {
    label: 'Inicio',
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  personajes: {
    label: 'Personajes',
    icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
  },
  moments: {
    label: 'Momentos',
    icon: { ios: 'film.fill', android: 'movie', web: 'movie' },
  },
  about: {
    label: 'Acerca de',
    icon: { ios: 'info.circle.fill', android: 'info', web: 'info' },
  },
  play: {
    label: 'Juega',
    icon: {
      ios: 'gamecontroller.fill',
      android: 'sports_esports',
      web: 'sports_esports',
    },
    highlight: true,
    accentColor: '#FF3344',
  },
  hireme: {
    label: 'Contrátame',
    icon: { ios: 'briefcase.fill', android: 'work', web: 'work' },
    highlight: true,
    accentColor: '#E6BE77',
  },
};

function ModernFloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10);

  return (
    <View style={[styles.floatingContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
      <View style={styles.floatingBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            label: route.name,
            icon: { ios: 'circle.fill', android: 'circle', web: 'circle' },
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const activeTint = config.accentColor || '#FFFFFF';
          const inactiveTint = config.highlight ? '#C8B2BA' : '#888594';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              style={({ pressed }) => [
                styles.tabItem,
                isFocused && styles.tabItemActive,
                pressed && styles.tabItemPressed,
              ]}
            >
              <View style={styles.iconBox}>
                <SymbolView
                  name={config.icon}
                  size={isFocused ? 18 : 20}
                  tintColor={isFocused ? activeTint : inactiveTint}
                />
                {!isFocused && config.highlight && (
                  <View
                    style={[
                      styles.specialDot,
                      { backgroundColor: config.accentColor || '#FF3038' },
                    ]}
                  />
                )}
              </View>

              {isFocused && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.activeLabel,
                    config.accentColor ? { color: config.accentColor } : {},
                  ]}
                >
                  {config.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <ModernFloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="personajes" options={{ title: 'Personajes' }} />
      <Tabs.Screen name="moments" options={{ title: 'Momentos' }} />
      <Tabs.Screen name="about" options={{ title: 'Acerca de' }} />
      <Tabs.Screen name="play" options={{ title: 'Juega' }} />
      <Tabs.Screen name="hireme" options={{ title: 'Contrátame' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    alignItems: 'center',
    zIndex: 999,
  },
  floatingBar: {
    width: '100%',
    maxWidth: 440,
    height: 62,
    backgroundColor: 'rgba(15, 12, 17, 0.94)',
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.35)',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 14,
  },
  tabItem: {
    height: 48,
    paddingHorizontal: 9,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: '#E50914',
    paddingHorizontal: 13,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
  },
  tabItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  iconBox: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
