import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// ---------- theme ----------
const C = {
  bg: '#0F1226',
  card: '#181C3A',
  line: '#262B52',
  text: '#FFFFFF',
  muted: '#9A9FC4',
  accent: '#7C5CFF',
};

// ---------- sample data (prototype only) ----------
type Person = { id: string; name: string; handle: string; bio: string };
const PEOPLE: Person[] = [
  { id: 'p1', name: 'Ama Mensah', handle: '@ama', bio: 'Photographer in Accra' },
  { id: 'p2', name: 'Kwame Boateng', handle: '@kwame', bio: 'Football and tech' },
  { id: 'p3', name: 'Efua Owusu', handle: '@efua', bio: 'Designer, coffee lover' },
  { id: 'p4', name: 'Yaw Darko', handle: '@yaw', bio: 'Musician' },
  { id: 'p5', name: 'Nana Adjei', handle: '@nana', bio: 'Student, builder' },
];
const byId = (id: string): Person => PEOPLE.find((p) => p.id === id) ?? PEOPLE[0];

type Post = { id: string; author: string; text: string; privacy: string; likes: number };
const POSTS: Post[] = [
  { id: 'a', author: 'p1', text: 'Golden hour at Labadi beach today. Who wants to shoot together this weekend?', privacy: 'Public', likes: 24 },
  { id: 'b', author: 'p2', text: 'Starting a room for people learning to code. Join if you are curious!', privacy: 'Followers', likes: 12 },
  { id: 'c', author: 'p3', text: 'New colour palette for a local startup. Feedback welcome.', privacy: 'Public', likes: 31 },
  { id: 'd', author: 'p4', text: 'Writing something new tonight. Late-night sessions hit different.', privacy: 'Connections', likes: 9 },
];

type Msg = { id: string; mine: boolean; text: string };
type Chat = { id: string; person: string; messages: Msg[] };
const CHATS: Chat[] = [
  { id: 'c1', person: 'p1', messages: [{ id: 'm1', mine: false, text: 'Are you coming Saturday?' }] },
  { id: 'c2', person: 'p3', messages: [{ id: 'm1', mine: false, text: 'Sent you the palette 🎨' }] },
  { id: 'c3', person: 'p5', messages: [{ id: 'm1', mine: false, text: 'Thanks for the invite!' }] },
];

type Room = { id: string; name: string; topic: string; members: number; kind: 'Public' | 'Private' };
const ROOMS: Room[] = [
  { id: 'r1', name: 'Accra Photographers', topic: 'Photography', members: 128, kind: 'Public' },
  { id: 'r2', name: 'Learn to Code', topic: 'Tech', members: 342, kind: 'Public' },
  { id: 'r3', name: 'Design Circle', topic: 'Design', members: 57, kind: 'Private' },
  { id: 'r4', name: 'Match Day', topic: 'Football', members: 890, kind: 'Public' },
];

// ---------- small components ----------
function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((s) => s[0]).join('').slice(0, 2);
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[s.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.header}>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// ---------- screens ----------
function HomeScreen() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <Header title="NOVA" subtitle="People first" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.peopleRow}>
        {PEOPLE.map((p) => (
          <View key={p.id} style={s.personChip}>
            <Avatar name={p.name} size={56} />
            <Text style={s.chipName} numberOfLines={1}>{p.name.split(' ')[0]}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={s.section}>What's happening</Text>
      {POSTS.map((post) => {
        const a = byId(post.author);
        const isLiked = !!liked[post.id];
        return (
          <View key={post.id} style={s.card}>
            <View style={s.row}>
              <Avatar name={a.name} size={40} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={s.name}>{a.name}</Text>
                <Text style={s.muted}>{a.handle} · {post.privacy}</Text>
              </View>
            </View>
            <Text style={s.postText}>{post.text}</Text>
            <View style={s.actions}>
              <Pressable onPress={() => setLiked({ ...liked, [post.id]: !isLiked })}>
                <Text style={[s.action, isLiked && { color: C.accent }]}>
                  {isLiked ? '♥' : '♡'} {post.likes + (isLiked ? 1 : 0)}
                </Text>
              </Pressable>
              <Text style={s.action}>💬 Comment</Text>
              <Pressable onPress={() => setSaved({ ...saved, [post.id]: !saved[post.id] })}>
                <Text style={[s.action, saved[post.id] && { color: C.accent }]}>
                  {saved[post.id] ? '★ Saved' : '☆ Save'}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const open = chats.find((c) => c.id === openId);

  if (open) {
    const p = byId(open.person);
    const send = () => {
      const t = draft.trim();
      if (!t) return;
      setChats(
        chats.map((c) =>
          c.id === open.id
            ? { ...c, messages: [...c.messages, { id: 'm' + (c.messages.length + 1), mine: true, text: t }] }
            : c,
        ),
      );
      setDraft('');
    };
    return (
      <View style={{ flex: 1 }}>
        <Pressable onPress={() => setOpenId(null)} style={s.back}>
          <Text style={s.action}>‹ Chats</Text>
          <Text style={[s.name, { marginLeft: 12 }]}>{p.name}</Text>
        </Pressable>
        <FlatList
          data={open.messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={[s.bubble, item.mine ? s.bubbleMine : s.bubbleTheirs]}>
              <Text style={s.postText}>{item.text}</Text>
            </View>
          )}
        />
        <View style={s.composer}>
          <TextInput
            style={s.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Message"
            placeholderTextColor={C.muted}
          />
          <Pressable style={s.button} onPress={send}>
            <Text style={s.buttonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Chats" subtitle="Message requests are on" />
      <FlatList
        data={chats}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => {
          const p = byId(item.person);
          const last = item.messages[item.messages.length - 1];
          return (
            <Pressable style={[s.card, s.row]} onPress={() => setOpenId(item.id)}>
              <Avatar name={p.name} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={s.name}>{p.name}</Text>
                <Text style={s.muted} numberOfLines={1}>{last ? last.text : ''}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function RoomsScreen() {
  const [joined, setJoined] = useState<Record<string, boolean>>({ r2: true });

  return (
    <View style={{ flex: 1 }}>
      <Header title="Rooms" subtitle="Find your community" />
      <FlatList
        data={ROOMS}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => {
          const isIn = !!joined[item.id];
          return (
            <View style={[s.card, s.row]}>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.muted}>
                  {item.topic} · {item.kind} · {item.members + (isIn ? 1 : 0)} members
                </Text>
              </View>
              <Pressable
                style={[s.button, isIn && s.buttonGhost]}
                onPress={() => setJoined({ ...joined, [item.id]: !isIn })}
              >
                <Text style={s.buttonText}>
                  {isIn ? 'Leave' : item.kind === 'Private' ? 'Request' : 'Join'}
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

function ProfileScreen() {
  const [nearby, setNearby] = useState(false); // OFF by default
  const [receipts, setReceipts] = useState(true);
  const interests = ['Photography', 'Tech', 'Football', 'Music'];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={{ alignItems: 'center', paddingTop: 40 }}>
        <Avatar name="You Nova" size={88} />
        <Text style={[s.title, { fontSize: 24, marginTop: 12 }]}>You</Text>
        <Text style={s.muted}>@you · Building something new</Text>
      </View>

      <View style={[s.row, { justifyContent: 'space-around', marginVertical: 20 }]}>
        {[['Posts', '12'], ['Followers', '248'], ['Following', '163']].map(([label, n]) => (
          <View key={label} style={{ alignItems: 'center' }}>
            <Text style={s.name}>{n}</Text>
            <Text style={s.muted}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={s.section}>Interests</Text>
      <View style={s.tags}>
        {interests.map((i) => (
          <View key={i} style={s.tag}><Text style={s.chipName}>{i}</Text></View>
        ))}
      </View>

      <Text style={s.section}>Privacy</Text>
      <View style={[s.card, s.row]}>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>Nearby</Text>
          <Text style={s.muted}>Off unless you turn it on</Text>
        </View>
        <Switch value={nearby} onValueChange={setNearby} trackColor={{ true: C.accent }} />
      </View>
      <View style={[s.card, s.row]}>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>Read receipts</Text>
          <Text style={s.muted}>Let people see when you read</Text>
        </View>
        <Switch value={receipts} onValueChange={setReceipts} trackColor={{ true: C.accent }} />
      </View>
    </ScrollView>
  );
}

// ---------- app shell ----------
const TABS = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'chats', label: 'Chats', icon: '✉' },
  { key: 'rooms', label: 'Rooms', icon: '◎' },
  { key: 'profile', label: 'Profile', icon: '☺' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export default function App() {
  const [tab, setTab] = useState<TabKey>('home');

  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'chats' && <ChatsScreen />}
        {tab === 'rooms' && <RoomsScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </View>
      <View style={s.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t.key} style={s.tab} onPress={() => setTab(t.key)}>
            <Text style={[s.tabIcon, tab === t.key && { color: C.accent }]}>{t.icon}</Text>
            <Text style={[s.tabLabel, tab === t.key && { color: C.accent }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ---------- styles ----------
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingTop: 28 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { color: C.text, fontSize: 30, fontWeight: '700' },
  subtitle: { color: C.muted, fontSize: 13, marginTop: 2 },
  section: { color: C.muted, fontSize: 13, fontWeight: '600', marginHorizontal: 16, marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center' },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 14, marginHorizontal: 16, marginBottom: 10 },
  name: { color: C.text, fontSize: 16, fontWeight: '600' },
  muted: { color: C.muted, fontSize: 13 },
  postText: { color: C.text, fontSize: 15, lineHeight: 21, marginTop: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line },
  action: { color: C.muted, fontSize: 14 },
  avatar: { backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.text, fontWeight: '700' },
  peopleRow: { paddingHorizontal: 16, paddingVertical: 8 },
  personChip: { alignItems: 'center', marginRight: 14, width: 62 },
  chipName: { color: C.text, fontSize: 12, marginTop: 4 },
  button: { backgroundColor: C.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginLeft: 10 },
  buttonGhost: { backgroundColor: C.line },
  buttonText: { color: C.text, fontWeight: '600' },
  back: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.line },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 14, paddingBottom: 10, marginBottom: 8 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: C.accent },
  bubbleTheirs: { alignSelf: 'flex-start', backgroundColor: C.card },
  composer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: C.line },
  input: { flex: 1, color: C.text, backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  tag: { backgroundColor: C.card, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 4, marginBottom: 8 },
  tabBar: { flexDirection: 'row', backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 6 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIcon: { color: C.muted, fontSize: 20 },
  tabLabel: { color: C.muted, fontSize: 11, marginTop: 2 },
});
