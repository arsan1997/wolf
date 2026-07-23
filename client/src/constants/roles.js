export const ROLES = {
  WEREWOLF: 'WEREWOLF',
  SEER: 'SEER',
  DOCTOR: 'DOCTOR',
  VILLAGER: 'VILLAGER'
};

export const ROLE_DETAILS = {
  [ROLES.WEREWOLF]: {
    name: 'มนุษย์หมาป่า (Werewolf)',
    team: 'WEREWOLF',
    teamName: 'ฝ่ายมนุษย์หมาป่า',
    description: 'เลือกสังหารชาวบ้าน 1 คนในแต่ละคืน เพื่อครอบครองหมู่บ้าน',
    color: 'from-red-900 to-rose-950 border-red-500/50 text-red-400',
    badge: 'bg-red-950 text-red-400 border-red-800'
  },
  [ROLES.SEER]: {
    name: 'ผู้ทำนาย (Seer)',
    team: 'VILLAGER',
    teamName: 'ฝ่ายชาวบ้าน',
    description: 'เลือกตรวจสอบผู้เล่น 1 คนในแต่ละคืน เพื่อดูว่าเขาเป็นมนุษย์หมาป่าหรือไม่',
    color: 'from-indigo-900 to-purple-950 border-indigo-500/50 text-indigo-300',
    badge: 'bg-indigo-950 text-indigo-300 border-indigo-800'
  },
  [ROLES.DOCTOR]: {
    name: 'หมอ (Doctor)',
    team: 'VILLAGER',
    teamName: 'ฝ่ายชาวบ้าน',
    description: 'เลือกปกป้องผู้เล่น 1 คน (รวมถึงตัวเองได้) ในแต่ละคืน เพื่อป้องกันการถูกสังหาร',
    color: 'from-emerald-900 to-teal-950 border-emerald-500/50 text-emerald-300',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-800'
  },
  [ROLES.VILLAGER]: {
    name: 'ชาวบ้าน (Villager)',
    team: 'VILLAGER',
    teamName: 'ฝ่ายชาวบ้าน',
    description: 'ไม่มีพลังพิเศษในตอนกลางคืน ร่วมมือกันปรึกษาและโหวตหาตัวมนุษย์หมาป่าในตอนกลางวัน',
    color: 'from-slate-800 to-slate-900 border-slate-600/50 text-slate-300',
    badge: 'bg-slate-800 text-slate-300 border-slate-700'
  }
};
