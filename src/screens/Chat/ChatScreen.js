import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send } from 'lucide-react-native';

// ★ IP 수정 필수
const SERVER_URL = 'http://172.30.1.84:3000';
const MY_USER_ID = 1; 

export default function ChatScreen({ navigation, route }) {
  // ChatList에서 넘겨준 데이터 받기
  const { matchData } = route.params; 
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // 1. 처음 들어왔을 때 기존 대화 내역 불러오기
  useEffect(() => {
    fetchMessages();
    // (선택) 3초마다 새 메시지 확인 (폴링)
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/messages?matchId=${matchData.match_id}`);
      const data = await res.json();
      // DB 메시지 포맷을 화면에 맞게 변환
      const formatted = data.map(m => ({
        id: m.id,
        text: m.text,
        sender: m.sender_id === MY_USER_ID ? 'user' : 'other',
        timestamp: new Date(m.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(formatted);
    } catch (err) { console.error(err); }
  };

  // 2. 메시지 전송 함수
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText(''); // 입력창 비우기

    try {
      // 서버로 전송
      await fetch(`${SERVER_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: matchData.match_id,
          senderId: MY_USER_ID,
          text: textToSend
        })
      });
      
      // 전송 후 바로 목록 갱신
      fetchMessages();

    } catch (err) {
      console.error("전송 실패", err);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={{ 
      flexDirection: 'row', marginBottom: 16, 
      justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start' 
    }}>
      <View style={{ maxWidth: '75%', alignItems: item.sender === 'user' ? 'flex-end' : 'flex-start' }}>
        <View style={{ 
            backgroundColor: item.sender === 'user' ? '#9333ea' : '#fff',
            padding: 12, borderRadius: 16, borderWidth: item.sender === 'user' ? 0 : 1, borderColor: '#eee'
        }}>
            <Text style={{ color: item.sender === 'user' ? '#fff' : '#000' }}>{item.text}</Text>
        </View>
        <Text style={{ fontSize: 10, color: '#999', marginTop: 4 }}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* 헤더 */}
      <View style={{ paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Image source={{ uri: matchData.image }} style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 12 }} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>{matchData.name}</Text>
      </View>

      {/* 메시지 리스트 */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={{ flex: 1, backgroundColor: '#f9fafb' }}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* 입력창 */}
      <View style={{ padding: 16, borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지 입력..."
          style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10 }}
        />
        <TouchableOpacity onPress={handleSend}>
          <LinearGradient colors={['#ec4899', '#9333ea']} style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Send color="white" size={18} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}