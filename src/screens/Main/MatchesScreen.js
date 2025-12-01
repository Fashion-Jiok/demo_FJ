import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MatchesScreen({ navigation }) {
  // 현재 탭 활성화 상태 (Matches가 선택된 상태)
  const activeRouteName = 'Matches';
  const getTabColor = (routeName) => (routeName === activeRouteName ? '#000000' : '#9ca3af');
  const getTabWeight = (routeName) => (routeName === activeRouteName ? '700' : '500');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 메인 컨텐츠 영역 (이미지 배경) */}
      <View style={styles.contentContainer}>
        <ImageBackground
          source={{ uri: 'https://i.pinimg.com/1200x/e3/d8/65/e3d86524d3b6ecb2fb9ab703c0ed714c.jpg' }}
          style={styles.background}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            {/* 1. 상단 헤더 (뒤로가기 버튼) */}
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('MainHome')} 
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* 중앙 내용 (기존 Coming Soon 컨텐츠) */}
            <View style={styles.centerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="people" size={64} color="#fff" />
              </View>
              
              <Text style={styles.title}>매칭</Text>
              <Text style={styles.subtitle}>
                나와 매칭된 사람들을{'\n'}
                만나보세요
              </Text>

              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>🚀 Coming Soon</Text>
              </View>

              <Text style={styles.description}>
                스타일과 취향이 맞는{'\n'}
                특별한 사람들과의 만남
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* 2. 하단 탭 바 (MainHome과 동일한 네비게이션) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MainHome')}>
          <Ionicons name="home" size={24} color={getTabColor('MainHome')} />
          <Text style={[styles.tabText, { color: getTabColor('MainHome'), fontWeight: getTabWeight('MainHome') }]}>홈</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Explore')}>
          <Ionicons name="compass-outline" size={24} color={getTabColor('Explore')} />
          <Text style={[styles.tabText, { color: getTabColor('Explore'), fontWeight: getTabWeight('Explore') }]}>탐색</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Map')}>
          <Ionicons name="heart-outline" size={24} color={getTabColor('Map')} />
          <Text style={[styles.tabText, { color: getTabColor('Map'), fontWeight: getTabWeight('Map') }]}>종알림</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Matches')}>
          <Ionicons name="people-outline" size={24} color={getTabColor('Matches')} />
          <Text style={[styles.tabText, { color: getTabColor('Matches'), fontWeight: getTabWeight('Matches') }]}>매칭</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ChatList')}>
          <Ionicons name="chatbubbles-outline" size={24} color={getTabColor('ChatList')} />
          <Text style={[styles.tabText, { color: getTabColor('ChatList'), fontWeight: getTabWeight('ChatList') }]}>채팅</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MyProfile')}>
          <Ionicons name="person-outline" size={24} color={getTabColor('MyProfile')} />
          <Text style={[styles.tabText, { color: getTabColor('MyProfile'), fontWeight: getTabWeight('MyProfile') }]}>나</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 하단바와 어우러지게 흰색 배경
  },
  contentContainer: {
    flex: 1, // 화면의 나머지 부분을 차지
  },
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  // 헤더 (뒤로가기 버튼 영역)
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  // 중앙 컨텐츠 영역
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: -60, // 헤더 높이만큼 보정하여 시각적 중앙 정렬
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  comingSoon: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  // 하단 탭 바 (MainHome과 동일 스타일)
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 11,
    marginTop: 4,
  },
});