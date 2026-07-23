import React, { useState } from 'react';
import { Vote, CheckCircle, Skull, AlertCircle } from 'lucide-react';
import { Modal } from '../Common/Modal';

export const VotePhase = ({ players, me, onSubmitVote }) => {
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isDead = me && !me.isAlive;
  const hasVoted = me?.hasVoted;

  const alivePlayers = players.filter((p) => p.isAlive);
  const validVoteTargets = alivePlayers.filter((p) => p.id !== me?.id);

  const selectedTargetPlayer = players.find((p) => p.id === selectedTargetId);

  const handleVoteClick = (targetId) => {
    if (hasVoted || isDead) return;
    setSelectedTargetId(targetId);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    if (selectedTargetId) {
      onSubmitVote(selectedTargetId);
      setShowConfirmModal(false);
    }
  };

  if (isDead) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-950/80 border border-slate-800 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Skull className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-300">คุณเสียชีวิตแล้ว</h3>
        <p className="text-sm text-slate-500 mt-2">
          วิญญาณของผู้เสียชีวิตไม่มีสิทธิ์โหวตกำจัดผู้เล่นในยามกลางวัน
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold mb-3">
          <Vote className="w-4 h-4 text-red-400" /> ช่วงการลงคะแนนโหวต (Voting Phase)
        </div>
        <h2 className="text-3xl font-black text-slate-100">โหวตผู้ต้องสงสัยออกจากหมู่บ้าน</h2>
        <p className="text-sm text-slate-400 mt-2">
          เลือกผู้เล่นที่คุณสงสัยว่าเป็นมนุษย์หมาป่า (โหวตได้เพียงครั้งเดียว)
        </p>
      </div>

      {hasVoted ? (
        <div className="p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-emerald-300">ลงคะแนนโหวตเรียบร้อยแล้ว</h3>
          <p className="text-sm text-emerald-400/80 mt-2">
            คะแนนโหวตถูกบันทึกแล้ว กำลังรอผู้เล่นที่เหลือลงคะแนน...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {validVoteTargets.map((player) => (
            <button
              key={player.id}
              onClick={() => handleVoteClick(player.id)}
              className="p-5 rounded-2xl bg-[#131124] border border-red-900/40 hover:border-red-500/80 hover:bg-red-950/30 transition-all text-left group relative overflow-hidden shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-300 font-bold group-hover:scale-105 transition-transform">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-slate-100 group-hover:text-red-200">
                    {player.name}
                  </div>
                  <span className="text-xs text-slate-500">ผู้เล่นยังมีชีวิต</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs font-semibold text-red-400 group-hover:translate-x-1 transition-transform">
                โหวตกำจัด &rarr;
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        title="ยืนยันการลงคะแนนโหวต"
        description={`คุณแน่ใจหรือไม่ว่าต้องการโหวตกำจัดคุณ "${selectedTargetPlayer?.name}" ออกจากหมู่บ้าน?`}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="ยืนยันการโหวต"
        danger={true}
      />
    </div>
  );
};
