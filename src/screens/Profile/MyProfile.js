import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

// MBTI types
const mbtiOptions = {
  energy: ['E', 'I'],
  information: ['N', 'S'],
  decisions: ['F', 'T'],
  lifestyle: ['P', 'J']
};

// Interest categories
const interestCategories = {
  '게임': ['닌텐도', 'PC방', '로블록스', '오버워치', 'E-sports'],
  '집순이/집돌이': ['독서', '드라마정주행', '베이킹', '보드게임', '식물가꾸기', '온라인게임', '요리', '홈트'],
  '아웃도어': ['등산', '캠핑', '자전거', '러닝', '서핑'],
  '문화생활': ['전시회', '영화', '공연', '페스티벌', '뮤지컬'],
  '음식': ['맛집투어', '카페', '베이킹', '요리', '와인'],
  '운동': ['헬스', '요가', '필라테스', '수영', '테니스']
};

const mbtiLabels = {
  energy: { E: 'E - 외향형', I: 'I - 내향형' },
  information: { N: 'N - 직관형', S: 'S - 감각형' },
  decisions: { F: 'F - 감정형', T: 'T - 사고형' },
  lifestyle: { P: 'P - 인식형', J: 'J - 판단형' }
};

export default function UserProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "수민",
    age: 27,
    location: "서울 용산구",
    job: "프로덕트 디자이너",
    education: "홍익대학교",
    bio: "좋은 디자인과 패션을 사랑하는 사람입니다. 주말에는 전시회나 카페 투어를 즐깁니다.",
    images: [
      "https://i.pinimg.com/1200x/bc/87/15/bc8715dc1d75d38ede5745a85ec889fd.jpg",
      "https://i.pinimg.com/736x/95/48/1d/95481d1474b1d10c850034ff686cb01f.jpg",
      "https://i.pinimg.com/1200x/a7/4a/6a/a74a6a03c97c2dc43c8153d7e1f2637f.jpg"
    ],
    mbti: {
      energy: 'E',
      information: 'N',
      decisions: 'F',
      lifestyle: 'P'
    },
    styles: ["미니멀", "모던", "캐주얼"],
    interests: ["전시회", "카페", "사진", "음악"],
    styleAnalysis: {
      primary: "미니멀",
      secondary: "모던 캐주얼",
      colors: ["블랙", "화이트", "그레이", "베이지"],
      brands: ["COS", "유니클로", "에이랜드"]
    }
  });

  // 이미지 피커 권한 요청
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 선택하려면 갤러리 접근 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  // 사진 추가
  const handleAddPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUserProfile({
        ...userProfile,
        images: [...userProfile.images, result.assets[0].uri]
      });
    }
  };

  // 사진 변경
  const handleChangePhoto = async (index) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...userProfile.images];
      newImages[index] = result.assets[0].uri;
      setUserProfile({
        ...userProfile,
        images: newImages
      });
    }
  };

  // 사진 삭제
  const handleDeletePhoto = (index) => {
    Alert.alert(
      '사진 삭제',
      '이 사진을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const newImages = userProfile.images.filter((_, i) => i !== index);
            setUserProfile({ ...userProfile, images: newImages });
          }
        }
      ]
    );
  };

  const handleMbtiChange = (category, value) => {
    if (!isEditing) return;
    setUserProfile({
      ...userProfile,
      mbti: {
        ...userProfile.mbti,
        [category]: value
      }
    });
  };

  const handleInterestToggle = (interest) => {
    if (!isEditing) return;
    const currentInterests = userProfile.interests;
    if (currentInterests.includes(interest)) {
      setUserProfile({
        ...userProfile,
        interests: currentInterests.filter(i => i !== interest)
      });
    } else {
      setUserProfile({
        ...userProfile,
        interests: [...currentInterests, interest]
      });
    }
  };

  const handleStyleRemove = (styleToRemove) => {
    if (!isEditing) return;
    setUserProfile({
      ...userProfile,
      styles: userProfile.styles.filter(s => s !== styleToRemove)
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('저장 완료', '프로필이 성공적으로 저장되었습니다.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>내 프로필</Text>
        </View>
        <TouchableOpacity
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          style={styles.editButton}
        >
          <LinearGradient
            colors={isEditing ? ['#8b5cf6', '#ec4899'] : ['#f3f4f6', '#f3f4f6']}
            style={styles.editButtonGradient}
          >
            <Text style={[styles.editButtonText, isEditing && styles.editButtonTextActive]}>
              {isEditing ? '✓ 저장' : '✏️ 편집'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Photo Grid */}
        <View style={styles.photoSection}>
          <View style={styles.photoGrid}>
            {userProfile.images.map((img, idx) => (
              <View key={idx} style={styles.photoItem}>
                <Image
                  source={{ uri: img }}
                  style={styles.photo}
                  resizeMode="cover"
                />
                {isEditing && (
                  <View style={styles.photoOverlay}>
                    <TouchableOpacity 
                      style={styles.photoActionButton}
                      onPress={() => handleChangePhoto(idx)}
                    >
                      <Text style={styles.photoActionIcon}>📷</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.photoActionButton}
                      onPress={() => handleDeletePhoto(idx)}
                    >
                      <Text style={styles.photoActionIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
            {isEditing && userProfile.images.length < 6 && (
              <TouchableOpacity 
                style={styles.addPhotoButton}
                onPress={handleAddPhoto}
              >
                <View style={styles.addPhotoContent}>
                  <Text style={styles.addPhotoIcon}>+</Text>
                  <Text style={styles.addPhotoText}>사진 추가</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Basic Info Card */}
        <View style={styles.card}>
          <View style={styles.nameSection}>
            {isEditing ? (
              <View style={styles.editNameRow}>
                <TextInput
                  value={userProfile.name}
                  onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
                  style={styles.nameInput}
                  placeholder="이름"
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  value={userProfile.age.toString()}
                  onChangeText={(text) => setUserProfile({ ...userProfile, age: parseInt(text) || 0 })}
                  style={styles.ageInput}
                  placeholder="나이"
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            ) : (
              <Text style={styles.nameText}>
                {userProfile.name}, {userProfile.age}
              </Text>
            )}
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>📍</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={userProfile.location}
                  onChangeText={(text) => setUserProfile({ ...userProfile, location: text })}
                  style={styles.infoInput}
                  placeholder="위치"
                  placeholderTextColor="#9ca3af"
                />
              ) : (
                <Text style={styles.infoText}>{userProfile.location}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>💼</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={userProfile.job}
                  onChangeText={(text) => setUserProfile({ ...userProfile, job: text })}
                  style={styles.infoInput}
                  placeholder="직업"
                  placeholderTextColor="#9ca3af"
                />
              ) : (
                <Text style={styles.infoText}>{userProfile.job}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>🎓</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={userProfile.education}
                  onChangeText={(text) => setUserProfile({ ...userProfile, education: text })}
                  style={styles.infoInput}
                  placeholder="학력"
                  placeholderTextColor="#9ca3af"
                />
              ) : (
                <Text style={styles.infoText}>{userProfile.education}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Bio Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>소개</Text>
          </View>
          {isEditing ? (
            <TextInput
              value={userProfile.bio}
              onChangeText={(text) => setUserProfile({ ...userProfile, bio: text })}
              style={styles.bioInput}
              multiline
              numberOfLines={4}
              placeholder="자신을 소개해주세요"
              placeholderTextColor="#9ca3af"
            />
          ) : (
            <Text style={styles.bioText}>{userProfile.bio}</Text>
          )}
        </View>

        {/* MBTI Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>MBTI</Text>
            <View style={styles.mbtiResultBadge}>
              <Text style={styles.mbtiResultText}>
                {userProfile.mbti.energy}{userProfile.mbti.information}
                {userProfile.mbti.decisions}{userProfile.mbti.lifestyle}
              </Text>
            </View>
          </View>

          {/* Energy */}
          <View style={styles.mbtiCategory}>
            <Text style={styles.mbtiLabel}>에너지 방향</Text>
            <View style={styles.mbtiOptions}>
              {mbtiOptions.energy.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleMbtiChange('energy', type)}
                  style={styles.mbtiOptionButton}
                  disabled={!isEditing}
                >
                  <LinearGradient
                    colors={
                      userProfile.mbti.energy === type
                        ? ['#8b5cf6', '#ec4899']
                        : ['#ffffff', '#ffffff']
                    }
                    style={[
                      styles.mbtiOptionGradient,
                      userProfile.mbti.energy === type && styles.mbtiOptionActive
                    ]}
                  >
                    <Text style={[
                      styles.mbtiOptionText,
                      userProfile.mbti.energy === type && styles.mbtiOptionTextActive
                    ]}>
                      {mbtiLabels.energy[type]}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Information */}
          <View style={styles.mbtiCategory}>
            <Text style={styles.mbtiLabel}>인식 기능</Text>
            <View style={styles.mbtiOptions}>
              {mbtiOptions.information.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleMbtiChange('information', type)}
                  style={styles.mbtiOptionButton}
                  disabled={!isEditing}
                >
                  <LinearGradient
                    colors={
                      userProfile.mbti.information === type
                        ? ['#8b5cf6', '#ec4899']
                        : ['#ffffff', '#ffffff']
                    }
                    style={[
                      styles.mbtiOptionGradient,
                      userProfile.mbti.information === type && styles.mbtiOptionActive
                    ]}
                  >
                    <Text style={[
                      styles.mbtiOptionText,
                      userProfile.mbti.information === type && styles.mbtiOptionTextActive
                    ]}>
                      {mbtiLabels.information[type]}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Decisions */}
          <View style={styles.mbtiCategory}>
            <Text style={styles.mbtiLabel}>판단 기능</Text>
            <View style={styles.mbtiOptions}>
              {mbtiOptions.decisions.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleMbtiChange('decisions', type)}
                  style={styles.mbtiOptionButton}
                  disabled={!isEditing}
                >
                  <LinearGradient
                    colors={
                      userProfile.mbti.decisions === type
                        ? ['#8b5cf6', '#ec4899']
                        : ['#ffffff', '#ffffff']
                    }
                    style={[
                      styles.mbtiOptionGradient,
                      userProfile.mbti.decisions === type && styles.mbtiOptionActive
                    ]}
                  >
                    <Text style={[
                      styles.mbtiOptionText,
                      userProfile.mbti.decisions === type && styles.mbtiOptionTextActive
                    ]}>
                      {mbtiLabels.decisions[type]}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lifestyle */}
          <View style={styles.mbtiCategory}>
            <Text style={styles.mbtiLabel}>생활 양식</Text>
            <View style={styles.mbtiOptions}>
              {mbtiOptions.lifestyle.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleMbtiChange('lifestyle', type)}
                  style={styles.mbtiOptionButton}
                  disabled={!isEditing}
                >
                  <LinearGradient
                    colors={
                      userProfile.mbti.lifestyle === type
                        ? ['#8b5cf6', '#ec4899']
                        : ['#ffffff', '#ffffff']
                    }
                    style={[
                      styles.mbtiOptionGradient,
                      userProfile.mbti.lifestyle === type && styles.mbtiOptionActive
                    ]}
                  >
                    <Text style={[
                      styles.mbtiOptionText,
                      userProfile.mbti.lifestyle === type && styles.mbtiOptionTextActive
                    ]}>
                      {mbtiLabels.lifestyle[type]}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* AI Style Analysis Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sparkleIcon}>✨</Text>
            <Text style={styles.cardTitle}>AI 스타일 분석</Text>
          </View>

          <View style={styles.styleGrid}>
            <View style={styles.styleGridItem}>
              <Text style={styles.styleLabel}>주 스타일</Text>
              <LinearGradient
                colors={['#8b5cf6', '#ec4899']}
                style={styles.styleBadge}
              >
                <Text style={styles.styleBadgeText}>
                  {userProfile.styleAnalysis.primary}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.styleGridItem}>
              <Text style={styles.styleLabel}>보조 스타일</Text>
              <View style={styles.styleBadgeOutline}>
                <Text style={styles.styleBadgeOutlineText}>
                  {userProfile.styleAnalysis.secondary}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.styleItem}>
            <Text style={styles.styleLabel}>선호 컬러</Text>
            <View style={styles.tagContainer}>
              {userProfile.styleAnalysis.colors.map((color, idx) => (
                <View key={idx} style={styles.colorTag}>
                  <Text style={styles.colorTagText}>{color}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.styleItem}>
            <Text style={styles.styleLabel}>선호 브랜드</Text>
            <View style={styles.tagContainer}>
              {userProfile.styleAnalysis.brands.map((brand, idx) => (
                <View key={idx} style={styles.brandTag}>
                  <Text style={styles.brandTagText}>{brand}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Style Tags Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>스타일 태그</Text>
            {isEditing && (
              <TouchableOpacity style={styles.addTagButton}>
                <Text style={styles.addTagText}>+ 추가</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tagContainer}>
            {userProfile.styles.map((style, idx) => (
              <View key={idx} style={styles.styleTag}>
                <Text style={styles.styleTagText}>{style}</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleStyleRemove(style)}>
                    <Text style={styles.removeIcon}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Interests Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>관심사</Text>
          </View>
          <Text style={styles.subtitle}>관심있는 항목을 선택해주세요</Text>

          {Object.entries(interestCategories).map(([category, items]) => (
            <View key={category} style={styles.interestCategory}>
              <Text style={styles.interestCategoryTitle}>{category}</Text>
              <View style={styles.tagContainer}>
                {items.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => handleInterestToggle(interest)}
                    style={styles.interestButton}
                    disabled={!isEditing}
                  >
                    <LinearGradient
                      colors={
                        userProfile.interests.includes(interest)
                          ? ['#8b5cf6', '#ec4899']
                          : ['#ffffff', '#ffffff']
                      }
                      style={[
                        styles.interestButtonGradient,
                        !userProfile.interests.includes(interest) && styles.interestButtonInactive
                      ]}
                    >
                      <Text
                        style={[
                          styles.interestButtonText,
                          userProfile.interests.includes(interest) && styles.interestButtonTextActive
                        ]}
                      >
                        {interest}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Selected Interests Summary */}
          {userProfile.interests.length > 0 && (
            <View style={styles.selectedInterestsCard}>
              <Text style={styles.selectedInterestsTitle}>
                선택한 관심사 ({userProfile.interests.length})
              </Text>
              <View style={styles.tagContainer}>
                {userProfile.interests.map((interest, idx) => (
                  <View key={idx} style={styles.selectedInterestTag}>
                    <Text style={styles.selectedInterestText}>{interest}</Text>
                    {isEditing && (
                      <TouchableOpacity onPress={() => handleInterestToggle(interest)}>
                        <Text style={styles.removeIconSmall}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={['#8b5cf6', '#ec4899']}
              style={styles.primaryButton}
            >
              <Text style={styles.sparkleIcon}>✨</Text>
              <Text style={styles.primaryButtonText}>스타일 재분석하기</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>⚙️ 설정</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  editButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  editButtonTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  photoSection: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 8,
    borderBottomColor: '#f3f4f6',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  photoItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  photoActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActionIcon: {
    fontSize: 18,
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  addPhotoContent: {
    alignItems: 'center',
    gap: 4,
  },
  addPhotoIcon: {
    fontSize: 32,
    color: '#9ca3af',
    fontWeight: '300',
  },
  addPhotoText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  nameSection: {
    marginBottom: 20,
  },
  nameText: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  editNameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInput: {
    flex: 2,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  ageInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    color: '#4b5563',
    fontSize: 15,
    fontWeight: '500',
  },
  infoInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
  bioInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    color: '#111827',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  bioText: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 24,
  },
  mbtiResultBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  mbtiResultText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  mbtiCategory: {
    marginBottom: 16,
  },
  mbtiLabel: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '600',
  },
  mbtiOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  mbtiOptionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mbtiOptionGradient: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  mbtiOptionActive: {
    borderColor: 'transparent',
  },
  mbtiOptionText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  mbtiOptionTextActive: {
    color: '#ffffff',
  },
  sparkleIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  styleGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  styleGridItem: {
    flex: 1,
  },
  styleItem: {
    marginBottom: 16,
  },
  styleLabel: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  styleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  styleBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  styleBadgeOutline: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  styleBadgeOutlineText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  colorTagText: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '500',
  },
  brandTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  brandTagText: {
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: '600',
  },
  addTagButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  addTagText: {
    color: '#8b5cf6',
    fontSize: 14,
    fontWeight: '600',
  },
  styleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  styleTagText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  removeIcon: {
    color: '#6b7280',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  removeIconSmall: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '500',
  },
  interestCategory: {
    marginBottom: 20,
  },
  interestCategoryTitle: {
    color: '#374151',
    fontSize: 15,
    marginBottom: 10,
    fontWeight: '700',
  },
  interestButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  interestButtonGradient: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  interestButtonInactive: {
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  interestButtonText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
  },
  interestButtonTextActive: {
    color: '#ffffff',
  },
  selectedInterestsCard: {
    marginTop: 20,
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  selectedInterestsTitle: {
    color: '#7c3aed',
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '700',
  },
  selectedInterestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
    gap: 4,
  },
  selectedInterestText: {
    color: '#6d28d9',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtons: {
    marginHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    color: '#4b5563',
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
