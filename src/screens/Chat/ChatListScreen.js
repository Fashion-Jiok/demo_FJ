import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// 1. Mock Data (제공해주신 데이터)
const mockMatches = [
  {
    id: 1,
    name: "지우",
    age: 26,
    image: "https://images.unsplash.com/photo-1696435552024-5fc45acf98c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd29tYW4lMjBzdHJlZXQlMjBzdHlsZXxlbnwxfHx8fDE3NjE2MTc2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 92,
    lastMessage: "그 전시회 정말 좋았어요!",
    timeAgo: "2시간 전",
    isNew: false
  },
  {
    id: 2,
    name: "민준",
    age: 28,
    image: "https://images.unsplash.com/photo-1534260748473-e1c629d04bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbWFuJTIwbWluaW1hbCUyMG91dGZpdHxlbnwxfHx8fDE3NjE2MTc2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 88,
    isNew: true,
    timeAgo: "방금",
    lastMessage: undefined
  },
  {
    id: 3,
    name: "서연",
    age: 25,
    image: "https://images.unsplash.com/photo-1559878541-926091e4c31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcG9ydHJhaXQlMjBtb2RlbHxlbnwxfHx8fDE3NjE1MDc3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 95,
    lastMessage: "안녕하세요! 반가워요 😊",
    timeAgo: "어제",
    isNew: false
  },
  {
    id: 4,
    name: "하늘",
    age: 27,
    image: "https://images.unsplash.com/photo-1593484338605-301459b6bea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBzdHJlZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTYxNzY0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    styleScore: 90,
    isNew: true,
    timeAgo: "30분 전",
    lastMessage: undefined
  }
];

export default function ChatListScreen({ navigation }) {
  // 데이터 필터링
  const newMatches = mockMatches.filter(m => m.isNew);
  const conversations = mockMatches.filter(m => !m.isNew);

  // 하단 탭 스타일 설정
  const activeRouteName = 'ChatList';
  const getTabColor = (routeName) => (routeName === activeRouteName ? '#000000' : '#9ca3af');
  const getTabWeight = (routeName) => (routeName === activeRouteName ? '700' : '500');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 2. Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('MainHome')} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>매칭</Text>
        </View>
        <View style={styles.matchCountPill}>
          <Ionicons name="heart" size={14} color="#ec4899" />
          <Text style={styles.matchCountText}>{mockMatches.length}명</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        
        {/* 3. New Matches Section (Grid) */}
        {newMatches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles" size={18} color="#a855f7" />
              <Text style={styles.sectionTitle}>새로운 매칭</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>{newMatches.length}</Text>
              </View>
            </View>

            <View style={styles.gridContainer}>
              {newMatches.map((match) => (
                <TouchableOpacity 
                  key={match.id} 
                  style={styles.gridItem}
                  activeOpacity={0.8}
                  // 새로운 매칭 클릭 시 채팅방으로 이동
                  onPress={() => navigation.navigate('Chat')}
                >
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: match.image }} style={styles.gridImage} />
                    {/* Gradient Overlay */}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={StyleSheet.absoluteFill}
                    />
                    
                    {/* New Badge */}
                    <LinearGradient
                      colors={['#ec4899', '#9333ea']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.newLabel}
                    >
                      <Text style={styles.newLabelText}>NEW</Text>
                    </LinearGradient>

                    {/* Style Score */}
                    <View style={styles.scoreBadge}>
                      <Ionicons name="sparkles" size={10} color="#9333ea" />
                      <Text style={styles.scoreText}>{match.styleScore}%</Text>
                    </View>

                    {/* Info */}
                    <View style={styles.gridInfo}>
                      <Text style={styles.gridName}>{match.name}, {match.age}</Text>
                      <Text style={styles.gridTime}>{match.timeAgo}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 4. Conversations Section (List) */}
        {conversations.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { marginLeft: 0, marginBottom: 16 }]}>대화</Text>
            
            <View style={styles.listContainer}>
              {conversations.map((match) => (
                <TouchableOpacity 
                  key={match.id} 
                  style={styles.listItem}
                  onPress={() => navigation.navigate('Chat')}
                >
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: match.image }} style={styles.avatar} />
                    <LinearGradient
                      colors={['#ec4899', '#9333ea']}
                      style={styles.messageIconBadge}
                    >
                      <Ionicons name="chatbubble" size={10} color="#fff" />
                    </LinearGradient>
                  </View>

                  <View style={styles.listContent}>
                    <View style={styles.listHeader}>
                      <Text style={styles.listName}>{match.name}, {match.age}</Text>
                      <View style={styles.listScoreBadge}>
                        <Ionicons name="sparkles" size={10} color="#9333ea" />
                        <Text style={styles.listScoreText}>{match.styleScore}%</Text>
                      </View>
                    </View>
                    {match.lastMessage && (
                      <Text style={styles.lastMessage} numberOfLines={1}>
                        {match.lastMessage}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.listTime}>{match.timeAgo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {mockMatches.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="heart-dislike-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>아직 매칭이 없습니다</Text>
            <Text style={styles.emptySubtitle}>프로필을 탐색하고 마음에 드는 사람을 찾아보세요</Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Explore')}
            >
              <LinearGradient
                colors={['#ec4899', '#9333ea']}
                style={styles.exploreGradient}
              >
                <Text style={styles.exploreButtonText}>탐색하기</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 5. Bottom Tab Bar */}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  matchCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fdf2f8', // Pink-50
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  matchCountText: {
    fontSize: 12,
    color: '#ec4899',
    fontWeight: '600',
  },
  
  // Content
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  newBadge: {
    backgroundColor: '#9333ea',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // New Matches Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: (width - 52) / 2, // 2 columns with padding
    aspectRatio: 3/4,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  newLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newLabelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  scoreBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 10,
    color: '#9333ea',
    fontWeight: '700',
  },
  gridInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  gridName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  gridTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },

  // Conversation List
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
  },
  messageIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  listContent: {
    flex: 1,
    justifyContent: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  listScoreBadge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  listScoreText: {
    fontSize: 10,
    color: '#9333ea',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  listTime: {
    fontSize: 12,
    color: '#9ca3af',
    alignSelf: 'flex-start',
    marginTop: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
  },
  exploreButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  exploreGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 14,
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