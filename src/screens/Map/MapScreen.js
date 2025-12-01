import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar,
  ImageBackground,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  const [users, setUsers] = useState([]);         
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const styles = ['스트릿', '미니멀', '아메카지', '빈티지', '스포티', '젠더리스'];
    const names = ['패션왕', '홍대피플', '성수동힙스터', '판교개발자', '강남언니', '압구정날라리'];

    // 로딩 시늉 (1초 후 데이터 표시)
    setTimeout(() => {
      const mockUsers = Array.from({ length: 6 }).map((_, i) => ({
        id: `user_${i}`,
        nickname: names[i % names.length],
        style: styles[i % styles.length],
        // 화면 내 랜덤 위치 (상단 15% ~ 70%, 좌측 10% ~ 80%)
        top: Math.floor(Math.random() * 55) + 15 + '%',
        left: Math.floor(Math.random() * 70) + 10 + '%',
      }));
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // 탭 활성화 상태 확인 함수
  const activeRouteName = 'Map';
  const getTabColor = (routeName) => (routeName === activeRouteName ? '#000000' : '#9ca3af');
  const getTabWeight = (routeName) => (routeName === activeRouteName ? '700' : '500');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 지도 배경 이미지 (라이브러리 없이 이미지로 대체) */}
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/originals/9f/4b/36/9f4b361546b3df516f499596499846b4.jpg' }} 
        style={styles.mapBackground}
        resizeMode="cover"
      >
        {/* 헤더 오버레이 */}
        <View style={styles.headerContainer}>
          <View style={styles.headerPill}>
            {loading ? (
              <Text style={styles.loadingText}>위치 탐색 중...</Text>
            ) : (
              <>
                <View style={styles.iconCircle}>
                  <Ionicons name="people" size={18} color="#fff" />
                </View>
                <Text style={styles.headerText}>
                  내 주변 <Text style={styles.highlightText}>{users.length}명</Text>의 피플 발견
                </Text>
              </>
            )}
          </View>
        </View>

        {/* 유저 마커들 */}
        {!loading && users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.markerContainer, { top: user.top, left: user.left }]}
            activeOpacity={0.8}
            onPress={() => alert(`${user.nickname}님의 스타일: #${user.style}`)}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerInner}>
                <Text style={styles.markerEmoji}>👕</Text>
              </View>
              <View style={styles.markerArrow} />
            </View>
            <View style={styles.nameTag}>
              <Text style={styles.nameTagText}>{user.nickname}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* 내 위치 버튼 */}
        <TouchableOpacity 
          style={styles.myLocationButton} 
          activeOpacity={0.8}
          onPress={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 800);
          }}
        >
          <Ionicons name="locate" size={24} color="#333" />
        </TouchableOpacity>
      </ImageBackground>

      {/* 하단 탭 바 */}
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
  container: { flex: 1, backgroundColor: '#fff' },
  mapBackground: { flex: 1, width: width, height: '100%' },
  
  // Header
  headerContainer: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  headerPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 8, gap: 10 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  headerText: { fontSize: 15, fontWeight: '600', color: '#333' },
  highlightText: { color: '#ec4899', fontWeight: 'bold', fontSize: 16 },
  loadingText: { fontSize: 14, color: '#666', paddingHorizontal: 10 },

  // Markers
  markerContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  customMarker: { alignItems: 'center', justifyContent: 'center', width: 50, height: 50, zIndex: 2 },
  markerInner: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#000', alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  markerEmoji: { fontSize: 20 },
  markerArrow: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#000', marginTop: -2 },
  nameTag: { marginTop: 4, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: '#eee', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 1 },
  nameTagText: { fontSize: 11, fontWeight: '600', color: '#333' },

  // Location Button
  myLocationButton: { position: 'absolute', bottom: 30, right: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },

  // Bottom Bar
  bottomBar: { flexDirection: 'row', backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12, paddingBottom: 32, paddingHorizontal: 8, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  tabText: { fontSize: 11, marginTop: 4 },
});
