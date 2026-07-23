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
    description: 'เลือกสังหารชาวบ้าน 1 คนในแต่ละคืน เพื่อครอบครองหมู่บ้าน',
    icon: 'Moon'
  },
  [ROLES.SEER]: {
    name: 'ผู้ทำนาย (Seer)',
    team: 'VILLAGER',
    description: 'เลือกตรวจสอบผู้เล่น 1 คนในแต่ละคืน เพื่อดูว่าเขาเป็นมนุษย์หมาป่าหรือไม่',
    icon: 'Eye'
  },
  [ROLES.DOCTOR]: {
    name: 'หมอ (Doctor)',
    team: 'VILLAGER',
    description: 'เลือกปกป้องผู้เล่น 1 คน (รวมถึงตัวเองได้) ในแต่ละคืน เพื่อป้องกันการถูกสังหาร',
    icon: 'ShieldHeader'
  },
  [ROLES.VILLAGER]: {
    name: 'ชาวบ้าน (Villager)',
    team: 'VILLAGER',
    description: 'ไม่มีพลังพิเศษในตอนกลางคืน ร่วมมือกันปรึกษาและโหวตหาตัวมนุษย์หมาป่าในตอนกลางวัน',
    icon: 'User'
  }
};
