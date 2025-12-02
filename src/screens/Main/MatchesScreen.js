import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, 
  StatusBar, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ★ IP 주소 수정 (본인 PC IP)
const SERVER_URL = 'http://172.30.1.84:3000'; 
const MY_USER_ID = 1;

export default function MatchesScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/matches/cards?userId=${MY_USER_ID}`);
      const data = await response.json();
      setProfiles(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const targetUser = profiles[currentIndex];
    try {
      const response = await fetch(`${SERVER_URL}/api/matches/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myId: MY_USER_ID, targetId: targetUser.id })
      });
      const result = await response.json();

      if (result.isMatch) {
        Alert.alert("매칭 성공! 🎉", `${targetUser.name}님과 대화를 시작해보세요.`, [
          { text: "계속하기", onPress: () => nextCard() },
          { text: "채팅방 가기", onPress: () => navigation.navigate('ChatList') }
        ]);
      } else {
        nextCard();
      }
    } catch (error) { nextCard(); }
  };

  const nextCard = () => {
    if (currentIndex < profiles.length - 1) setCurrentIndex(currentIndex + 1);
    else Alert.alert("알림", "더 이상 추천할 프로필이 없습니다.");
  };

  const currentProfile = profiles[currentIndex];

  if (loading) return <View style={styles.center}><ActivityIndicator color="#ec4899" /></View>;
  if (!currentProfile) return <View style={styles.center}><Text>프로필 없음</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: currentProfile.image }} style={styles.bg} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient}>
          
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('MainHome')}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            {/* ★ 나를 좋아한 사람 강조 표시 ★ */}
            {currentProfile.type === 'liked_me' && (
              <View style={styles.likedBadge}>
                <Ionicons name="heart" size={16} color="#fff" />
                <Text style={styles.likedText}>나를 찜했어요!</Text>
              </View>
            )}
          </View>

          {/* 정보 영역 */}
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
              {currentProfile.type === 'liked_me' && <Ionicons name="heart-circle" size={24} color="#ec4899" style={{marginLeft:8}} />}
            </View>
            <Text style={styles.job}>{currentProfile.job}</Text>
            
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.passBtn} onPress={nextCard}><Ionicons name="close" size={30} color="#ff4b4b" /></TouchableOpacity>
              <TouchableOpacity style={styles.likeBtn} onPress={handleLike}>
                <LinearGradient colors={['#ec4899', '#9333ea']} style={styles.gradBtn}><Ionicons name="heart" size={40} color="#fff" /></LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bg: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'space-between' },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // 뱃지 스타일 강화
  likedBadge: { 
    backgroundColor: '#ec4899', flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 2, borderColor: '#fff', shadowColor: "#ec4899", shadowRadius: 10, shadowOpacity: 0.8
  },
  likedText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  info: { padding: 24, paddingBottom: 50 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 32, fontWeight: '700', color: '#fff' },
  job: { fontSize: 18, color: '#ddd', marginBottom: 20 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  passBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  likeBtn: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', elevation: 10 },
  gradBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
});