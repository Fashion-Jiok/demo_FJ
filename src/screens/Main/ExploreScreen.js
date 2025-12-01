import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - 48) / 2; // (화면너비 - 전체패딩) / 2

// Mock Data (더미 데이터 확장)
const allProfiles = [
  {
    id: 1,
    name: "지우",
    age: 26,
    location: "강남구",
    image: "https://images.unsplash.com/photo-1696435552024-5fc45acf98c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd29tYW4lMjBzdHJlZXQlMjBzdHlsZXxlbnwxfHx8fDE3NjE2MTc2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 92,
    tags: ["미니멀", "모던"]
  },
  {
    id: 2,
    name: "민준",
    age: 28,
    location: "성수동",
    image: "https://images.unsplash.com/photo-1534260748473-e1c629d04bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbWFuJTIwbWluaW1hbCUyMG91dGZpdHxlbnwxfHx8fDE3NjE2MTc2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 88,
    tags: ["스트릿", "클래식"]
  },
  {
    id: 3,
    name: "서연",
    age: 25,
    location: "홍대",
    image: "https://images.unsplash.com/photo-1559878541-926091e4c31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcG9ydHJhaXQlMjBtb2RlbHxlbnwxfHx8fDE3NjE1MDc3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 95,
    tags: ["빈티지", "유니크"]
  },
  {
    id: 4,
    name: "하늘",
    age: 27,
    location: "이태원",
    image: "https://images.unsplash.com/photo-1593484338605-301459b6bea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBzdHJlZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTYxNzY0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 90,
    tags: ["하이패션", "에지"]
  },
  {
    id: 5,
    name: "유진",
    age: 24,
    location: "압구정",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60",
    styleScore: 85,
    tags: ["러블리", "캐주얼"]
  },
  {
    id: 6,
    name: "도윤",
    age: 29,
    location: "한남동",
    image: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=800&auto=format&fit=crop&q=60",
    styleScore: 89,
    tags: ["댄디", "비즈니스"]
  },
  {
    id: 7,
    name: "지아",
    age: 23,
    location: "연남동",
    image: "https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=800&auto=format&fit=crop&q=60",
    styleScore: 94,
    tags: ["힙합", "오버핏"]
  },
  {
    id: 8,
    name: "현우",
    age: 26,
    location: "신사동",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60",
    styleScore: 91,
    tags: ["아메카지", "워크웨어"]
  }
];

export default function ExploreScreen({ navigation }) {
  const [likedProfiles, setLikedProfiles] = useState([]); // 좋아요 누른 프로필 ID 저장
  const [page, setPage] = useState(0); // 현재 보여줄 페이지 (0 or 1)

  // 현재 페이지의 4명 데이터 가져오기
  const currentProfiles = allProfiles.slice(page * 4, (page + 1) * 4);

  // 좋아요 토글 함수
  const toggleLike = (id) => {
    if (likedProfiles.includes(id)) {
      setLikedProfiles(likedProfiles.filter(pid => pid !== id));
    } else {
      setLikedProfiles([...likedProfiles, id]);
    }
  };

  // 새로고침 (다음 4명 보기)
  const handleRefresh = () => {
    // 페이지가 0이면 1로, 1이면 0으로 토글 (데이터가 8개뿐이라)
    setPage(prev => (prev === 0 ? 1 : 0));
  };

  // 하단 탭 스타일 함수
  const activeRouteName = 'Explore';
  const getTabColor = (routeName) => (routeName === activeRouteName ? '#000000' : '#9ca3af');
  const getTabWeight = (routeName) => (routeName === activeRouteName ? '700' : '500');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 1. Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>스타일 탐색</Text>
          <Text style={styles.headerSubtitle}>취향이 맞는 패션 피플을 찾아보세요</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 2. Grid Container */}
        <View style={styles.gridContainer}>
          {currentProfiles.map((profile) => {
            const isLiked = likedProfiles.includes(profile.id);
            return (
              <View key={profile.id} style={styles.card}>
                {/* Image Area */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: profile.image }} style={styles.cardImage} />
                  
                  {/* Match Score Badge */}
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{profile.styleScore}%</Text>
                  </View>

                  {/* Like Button (Floating) */}
                  <TouchableOpacity 
                    style={styles.likeButton}
                    onPress={() => toggleLike(profile.id)}
                    activeOpacity={0.9}
                  >
                    <Ionicons 
                      name={isLiked ? "heart" : "heart-outline"} 
                      size={20} 
                      color={isLiked ? "#ec4899" : "#ffffff"} 
                    />
                  </TouchableOpacity>
                </View>

                {/* Info Area */}
                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText}>{profile.name}, {profile.age}</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={12} color="#9ca3af" />
                    <Text style={styles.locationText}>{profile.location}</Text>
                  </View>
                  
                  {/* Tags */}
                  <View style={styles.tagsRow}>
                    {profile.tags.map((tag, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* 3. Refresh Button */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#1a1a1a', '#4b5563']}
            style={styles.refreshGradient}
          >
            <Ionicons name="refresh" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.refreshText}>새로운 친구 찾기</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      {/* 4. Bottom Tab Bar */}
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
    backgroundColor: '#ffffff',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },

  // Grid Layout
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3/4, // 세로로 긴 비율
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  matchText: {
    color: '#a855f7', // Purple Accent
    fontSize: 11,
    fontWeight: '700',
  },
  likeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  
  // Card Info
  cardInfo: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Refresh Button
  refreshButton: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  refreshGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  refreshText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom Bar
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