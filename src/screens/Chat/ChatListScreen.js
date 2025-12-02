import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  StatusBar, Platform, Alert, RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ★ IP 주소 수정
const SERVER_URL = 'http://172.30.1.84:3000';
const MY_USER_ID = 1;

export default function ChatListScreen({ navigation }) {
  const [newMatches, setNewMatches] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${SERVER_URL}/api/matches/list?userId=${MY_USER_ID}`);
      const data = await res.json();
      setNewMatches(data.newMatches);
      setConversations(data.conversations);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(); // 화면 켜질 때 로드
    const unsubscribe = navigation.addListener('focus', fetchData); // 탭 이동해서 올 때마다 로드
    return unsubscribe;
  }, [navigation]);

  // 채팅방 나가기 (삭제)
  const leaveChat = async (matchId) => {
    Alert.alert("나가기", "이 채팅방에서 나가시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "나가기", style: "destructive",
        onPress: async () => {
          await fetch(`${SERVER_URL}/api/matches/leave`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ matchId })
          });
          fetchData(); // 목록 갱신
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>매칭 목록</Text>
        <Text style={styles.subTitle}>{newMatches.length + conversations.length}명의 친구</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
      >
        
        {/* 1. 새로운 매칭 (대화가 없는 친구들) */}
        {newMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>새로운 매칭 <Text style={{color:'#ec4899'}}>New</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20}}>
              {newMatches.map((match) => (
                <TouchableOpacity 
                  key={match.match_id} 
                  style={styles.newMatchItem}
                  onPress={() => navigation.navigate('Chat', { matchData: match })}
                >
                  <Image source={{ uri: match.image }} style={styles.newMatchImg} />
                  <Text style={styles.newMatchName}>{match.name}</Text>
                  {/* 아직 대화가 없으므로 뱃지 표시 */}
                  <View style={styles.dot} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 2. 대화 목록 (대화가 있는 친구들) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>대화</Text>
          {conversations.length === 0 && newMatches.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{color:'#999'}}>아직 매칭된 친구가 없습니다.</Text>
            </View>
          ) : (
            conversations.map((chat) => (
              <View key={chat.match_id} style={styles.chatRow}>
                {/* 채팅방 입장 버튼 */}
                <TouchableOpacity 
                  style={styles.chatInfo} 
                  onPress={() => navigation.navigate('Chat', { matchData: chat })}
                >
                  <Image source={{ uri: chat.image }} style={styles.chatImg} />
                  <View style={styles.textContainer}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.lastMsg} numberOfLines={1}>{chat.last_message || "대화를 시작해보세요!"}</Text>
                  </View>
                </TouchableOpacity>

                {/* 나가기 버튼 (스와이프 대신 버튼으로 구현) */}
                <TouchableOpacity onPress={() => leaveChat(chat.match_id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* 탭바 (기존 코드 유지) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MainHome')}><Ionicons name="home-outline" size={24} color="#9ca3af" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Matches')}><Ionicons name="people-outline" size={24} color="#9ca3af" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ChatList')}><Ionicons name="chatbubbles" size={24} color="#000" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subTitle: { fontSize: 14, color: '#666', marginTop: 4 },
  
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginLeft: 20, marginBottom: 16 },
  
  // New Matches (가로 스크롤)
  newMatchItem: { marginRight: 20, alignItems: 'center', width: 70 },
  newMatchImg: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#ec4899' },
  newMatchName: { marginTop: 8, fontSize: 12, fontWeight: '600' },
  dot: { position: 'absolute', right: 5, top: 5, width: 12, height: 12, borderRadius: 6, backgroundColor: '#ec4899', borderWidth: 2, borderColor: '#fff' },

  // Conversation List (세로 리스트)
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  chatInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chatImg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0f0f0' },
  textContainer: { flex: 1, marginLeft: 16 },
  chatName: { fontSize: 16, fontWeight: '600' },
  lastMsg: { color: '#666', marginTop: 4, fontSize: 14 },
  
  deleteBtn: { padding: 10 },
  empty: { alignItems: 'center', padding: 20 },

  bottomBar: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#eee', paddingBottom: 30, paddingTop: 10, position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', justifyContent: 'space-around' },
  tabItem: { alignItems: 'center' },
});