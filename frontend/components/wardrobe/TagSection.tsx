/**
 * TagSection
 * AI 태그 4개 섹션(시즌/컬러/카테고리/스타일)을 렌더링
 * - tags: 현재 태그 상태
 * - analyzing: Vision AI 분석 중 여부 (스피너 표시)
 * - onChange: 태그 변경 시 콜백
 */
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GeneratedTags } from '../../types';
import TagChipEditor from './TagChipEditor';
import colors from '../../styles/colors';
import { styles, SECTION_COLORS, SECTION_LABELS } from './TagSection.styles';

interface Props {
  tags: GeneratedTags;
  analyzing: boolean;
  onChange: (tags: GeneratedTags) => void;
}

export default function TagSection({ tags, analyzing, onChange }: Props) {
  /** 4개 섹션 — 각 섹션의 태그 배열과 업데이트 함수를 묶음 */
  const sections = [
    {
      key: 'season' as const,
      tags: tags.seasonTags,
      update: (t: string[]) => onChange({ ...tags, seasonTags: t }),
    },
    {
      key: 'color' as const,
      tags: tags.colorTags,
      update: (t: string[]) => onChange({ ...tags, colorTags: t }),
    },
    {
      key: 'category' as const,
      tags: tags.categoryTags,
      update: (t: string[]) => onChange({ ...tags, categoryTags: t }),
    },
    {
      key: 'style' as const,
      tags: tags.styleTags,
      update: (t: string[]) => onChange({ ...tags, styleTags: t }),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 헤더: 타이틀 + 분석 중 뱃지 */}
      <View style={styles.header}>
        <Text style={styles.title}>AI 태그</Text>
        {analyzing && (
          <View style={styles.analyzingBadge}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.analyzingText}>분석 중...</Text>
          </View>
        )}
      </View>

      {/* 이미지 미선택 + 분석 전 빈 상태 */}
      {!analyzing && sections.every((s) => s.tags.length === 0) && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>이미지를 선택하면 AI가 자동으로 태그를 생성해요</Text>
        </View>
      )}

      {/* 섹션별 태그 에디터 */}
      {sections.map(({ key, tags: sectionTags, update }) => (
        <View key={key} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.dot, { backgroundColor: SECTION_COLORS[key] }]} />
            <Text style={[styles.sectionLabel, { color: SECTION_COLORS[key] }]}>
              {SECTION_LABELS[key]}
            </Text>
          </View>
          <TagChipEditor
            tags={sectionTags}
            onChange={update}
            accent={SECTION_COLORS[key]}
          />
        </View>
      ))}
    </View>
  );
}
