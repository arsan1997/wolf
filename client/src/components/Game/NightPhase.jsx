import React, { useState } from 'react';
import { Moon, Eye, Shield, CheckCircle, UserCheck, AlertCircle } from 'lucide-react';
import { ROLES, ROLE_DETAILS } from '../../constants/roles';
import { Modal } from '../Common/Modal';

export const NightPhase = ({ me, players, seerResult, onSubmitAction, onClearSeerResult }) => {
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isDead = me && !me.isAlive;
  const hasSubmitted = me?.hasSubmittedNightAction;
  const role = me?.role;

  const alivePlayers = players.filter((p) => p.isAlive);

  // Target filter rules
  const validTargets = alivePlayers.filter((p) => {
    if (role === ROLES.WEREWOLF || role === ROLES.SEER) {
      return p.id !== me.id; // Cannot select self
    }
    return true; // Doctor can select self
  });

  const selectedTargetPlayer = players.find((p) => p.id === selectedTargetId);

  const handleTargetClick = (targetId) => {
    if (hasSubmitted || isDead) return;
    setSelectedTargetId(targetId);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    if (selectedTargetId) {
      onSubmitAction(selectedTargetId);
      setShowConfirmModal(false);
    }
  };

  if (isDead) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-950/80 border border-slate-800 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Moon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-300">คุณเสียชีวิตแล้ว</h3>
        <p className="text-sm text-slate-500 mt-2">
          ผู้เล่นที่เสียชีวิตไม่สามารถใช้ความสามารถหรือแทรกแซงเกมได้ในยามค่ำคืน
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Night Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-3">
          <Moon className="w-4 h-4 text-purple-400" /> ช่วงเวลาค่ำคืน (Night Phase)
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-100">
          {role === ROLES.WEREWOLF && 'ค่ำคืนแห่งการล่า'}
          {role === ROLES.SEER && 'เพ่งมองโชคชะตา'}
          {role === ROLES.DOCTOR && 'ปกป้องชีวิต'}
          {role === ROLES.VILLAGER && 'ค่ำคืนอันเงียบสงบ'}
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          {role === ROLES.WEREWOLF && 'เลือกชาวบ้านหนึ่งคนเป็นเป้าหมายสังหารประจำคืนนี้'}
          {role === ROLES.SEER && 'เลือกผู้เล่นหนึ่งคนเพื่อตรวจสอบตัวตน'}
          {role === ROLES.DOCTOR && 'เลือกผู้เล่นหนึ่งคนเพื่อปกป้องจากการถูกสังหาร'}
          {role === ROLES.VILLAGER && 'คุณไม่มีความสามารถในยามค่ำคืน กรุณารอผู้เล่นบทบาทพิเศษ'}
        </p>
      </div>

      {/* Role Action Content */}
      {role === ROLES.VILLAGER ? (
        <div className="p-8 rounded-3xl bg-[#131124] border border-purple-900/40 text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Moon className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">ชาวบ้านกำลังหลับสนิท...</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            ในยามราตรี ท้องฟ้ามืดมิด เสียงหมาป่าเห่าหอนอยู่ไกลๆ กรุณารอจนกว่าจะถึงรุ่งเช้า
          </p>
        </div>
      ) : hasSubmitted ? (
        <div className="p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-emerald-300">ยืนยันคำสั่งเรียบร้อยแล้ว</h3>
          <p className="text-sm text-emerald-400/80 mt-2">
            คำสั่งของคุณถูกส่งไปยังเซิร์ฟเวอร์แล้ว กำลังรอผู้เล่นคนอื่นดำเนินการ...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {validTargets.map((player) => (
            <button
              key={player.id}
              onClick={() => handleTargetClick(player.id)}
              className="p-5 rounded-2xl bg-[#131124] border border-purple-900/50 hover:border-purple-500/80 hover:bg-purple-950/40 transition-all text-left group relative overflow-hidden shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold group-hover:scale-105 transition-transform">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-slate-100 group-hover:text-purple-200">
                    {player.name}
                  </div>
                  <span className="text-xs text-slate-500">
                    {player.id === me.id ? '(ตัวคุณ)' : 'ผู้เล่นยังมีชีวิต'}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                เลือกเป้าหมาย &rarr;
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Seer Inspection Result Modal */}
      {seerResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#131124] border border-indigo-500/40 max-w-md w-full rounded-3xl p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center mx-auto mb-4 text-indigo-300">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">ผลการตรวจสอบของผู้ทำนาย</h3>
            <p className="text-sm text-slate-400 mt-2">
              ผลลัพธ์นี้ถูกส่งถึงคุณเพียงคนเดียวเท่านั้น
            </p>

            <div className="my-6 p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30">
              <span className="text-sm text-slate-400">เป้าหมาย: </span>
              <strong className="text-slate-100 text-lg ml-1">{seerResult.targetName}</strong>
              <div className="mt-3">
                {seerResult.isWerewolf ? (
                  <span className="inline-block px-4 py-2 rounded-xl bg-red-950 text-red-400 border border-red-800 font-extrabold text-base">
                    🐺 เขาคือ มนุษย์หมาป่า!
                  </span>
                ) : (
                  <span className="inline-block px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-extrabold text-base">
                    🛡️ เขาไม่ใช่ มนุษย์หมาป่า (เป็นชาวบ้าน/ฝ่ายบริสุทธิ์)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClearSeerResult}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all"
            >
              รับทราบผลลัพธ์
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        title="ยืนยันการเลือกเป้าหมาย"
        description={`คุณแน่ใจหรือไม่ว่าต้องการเลือกคุณ "${selectedTargetPlayer?.name}" เป็นเป้าหมายกลางคืน?`}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="ยืนยันเลือกเป้าหมาย"
      />
    </div>
  );
};
