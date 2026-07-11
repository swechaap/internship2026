import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { IconBadge, colorSoft, colorVar } from '../components/IconBadge';
import SectionHeading from '../components/SectionHeading';
import StatusBadge, { STAGE_COLOR } from '../components/StatusBadge';

const ProfilePictureMenu = ({ open, onClose, avatar, onUpload, onRemove, initials }) => {
  const fileInputRef = useRef(null);

  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpload(ev.target.result);
      onClose();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                Profile Picture
              </h3>
              <button onClick={onClose} className="focus-ring p-1.5 rounded-full" style={{ color: 'var(--stone)' }}>
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div
                className="w-28 h-28 rounded-3xl flex items-center justify-center overflow-hidden font-display font-semibold text-3xl shrink-0"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : initials}
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            <div className="flex flex-col gap-2">
              <button
                onClick={triggerUpload}
                className="focus-ring w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: 'var(--coral)', color: '#fff' }}
              >
                <Icon name="upload" size={15} /> {avatar ? 'Change Picture' : 'Upload New Picture'}
              </button>
              {avatar && (
                <button
                  onClick={() => {
                    onRemove();
                    onClose();
                  }}
                  className="focus-ring w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink)', background: 'var(--paper-deep)' }}
                >
                  <Icon name="trash" size={15} /> Remove Picture
                </button>
              )}
              <button onClick={onClose} className="focus-ring w-full py-3 rounded-xl text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>
                Cancel
              </button>
            </div>
            <p className="text-[11px] text-center mt-4" style={{ color: 'var(--stone)' }}>
              JPG or PNG, ideally square, up to 5MB. Stored locally or in your user profile.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const EditField = ({ label, icon, value, onChange, type = 'text' }) => (
  <div>
    <label className="text-[10.5px] uppercase tracking-wide font-semibold flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--stone)' }}>
      <Icon name={icon} size={12} /> {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="focus-ring w-full px-3.5 py-2.5 rounded-xl text-[13.5px] border"
      style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
    />
  </div>
);

const EditProfileModal = ({ open, onClose, draft, setDraft, onSave }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 m-auto w-full max-w-md h-fit max-h-[85vh] overflow-y-auto rounded-3xl p-7 z-[85]"
          style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
              Edit Profile
            </h3>
            <button onClick={onClose} className="focus-ring p-1.5 rounded-full" style={{ color: 'var(--stone)' }}>
              <Icon name="x" size={18} />
            </button>
          </div>

          {/* Personal Information */}
          <div className="mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--coral)' }}>
              Personal Information
            </p>
            <div className="space-y-4">
              <EditField label="Full Name" icon="user" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
              <EditField label="Email" icon="mail" type="email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
              <EditField label="Phone" icon="phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} />
              <EditField label="Work Location" icon="mapPin" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} />
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 border-t" style={{ borderColor: 'var(--line)' }} />

          {/* Employment Information */}
          <div className="mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
              Employment Information
            </p>
            <div className="space-y-4">
              <EditField label="Company" icon="briefcase" value={draft.company} onChange={(v) => setDraft({ ...draft, company: v })} />
              <EditField label="Department" icon="users" value={draft.department} onChange={(v) => setDraft({ ...draft, department: v })} />
              <EditField label="Designation" icon="userCheck" value={draft.designation} onChange={(v) => setDraft({ ...draft, designation: v })} />
              <EditField label="Joining Date" icon="calendar" value={draft.joiningDate} onChange={(v) => setDraft({ ...draft, joiningDate: v })} />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="focus-ring flex-1 py-3 rounded-xl text-sm font-semibold border"
              style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="focus-ring flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--coral)', color: '#fff' }}
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--paper-deep)', color: 'var(--ink)' }}>
      <Icon name={icon} size={16} strokeWidth={1.8} />
    </div>
    <div className="min-w-0">
      <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
        {label}
      </div>
      <div className="text-[13.5px] font-medium truncate" style={{ color: 'var(--ink)' }}>
        {value || '—'}
      </div>
    </div>
  </div>
);

export const Profile = ({ complaints = [], onNav, avatar, setAvatar, employee = {}, setEmployee, onSignOut }) => {
  const total = complaints.length;
  const underReview = complaints.filter((c) => c.stage === 1 || c.stage === 2).length;
  const resolved = complaints.filter((c) => c.stage === 3).length;
  const latest = complaints[0];

  const [picMenuOpen, setPicMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(employee);

  const openEdit = () => {
    setDraft(employee);
    setEditOpen(true);
  };
  const saveEdit = () => {
    setEmployee(draft);
    setEditOpen(false);
  };

  const completionFields = [employee.name, employee.email, employee.phone, employee.location, avatar];
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const lastLoginDate = employee.lastLogin?.date || 'Today';
  const lastLoginTime = employee.lastLogin?.time || 'Just now';
  const lastLoginDevice = employee.lastLogin?.device || 'Web Browser';
  const lastLoginIp = employee.lastLogin?.ip || 'Active Session';

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="Your account"
          eyebrowIcon="user"
          title="Employee Profile"
          sub="Your details on record, at a glance — like a real employee self-service portal."
        />

        <div
          className="tab-card rounded-3xl border p-7 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
        >
          <button
            onClick={() => setPicMenuOpen(true)}
            aria-label="Change profile picture"
            className="focus-ring relative w-24 h-24 rounded-3xl flex items-center justify-center shrink-0 font-display font-semibold text-3xl overflow-hidden group"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : employee.initials}
            <span
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <Icon name="camera" size={20} className="text-white" />
            </span>
          </button>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
              <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--ink)' }}>
                {employee.name}
              </h3>
            </div>
            <p className="text-[13.5px] mt-1" style={{ color: 'var(--ink-soft)' }}>
              {employee.designation} · {employee.department}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span
                className="font-mono text-[11.5px] px-2.5 py-1 rounded-full"
                style={{ background: 'var(--paper-deep)', color: 'var(--ink-soft)' }}
              >
                {employee.employeeId}
              </span>
              <span
                className="text-[11.5px] px-2.5 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}
              >
                <Icon name="mapPin" size={12} />
                {employee.location}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <button
                onClick={openEdit}
                className="focus-ring px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                <Icon name="edit" size={13} /> Edit Profile
              </button>
              <button
                onClick={() => setPicMenuOpen(true)}
                className="focus-ring px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border"
                style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              >
                <Icon name="camera" size={13} /> Change Profile Picture
              </button>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="focus-ring px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border"
                  style={{ borderColor: 'var(--coral)', color: 'var(--coral)', background: 'var(--paper-deep)' }}
                >
                  <Icon name="logOut" size={13} /> Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color: 'var(--ink)' }}>
              Profile Completion
            </h4>
            <p className="text-[12px] mb-4" style={{ color: 'var(--ink-soft)' }}>
              Keep your details current so HR and grievance teams can reach you.
            </p>
            <div className="flex items-center gap-4">
              <div
                className="font-display text-2xl font-semibold shrink-0"
                style={{ color: completionPct === 100 ? 'var(--teal)' : 'var(--coral)' }}
              >
                {completionPct}%
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--paper-deep)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: completionPct === 100 ? 'var(--teal)' : 'var(--coral)' }}
                />
              </div>
            </div>
            {completionPct < 100 && (
              <p className="text-[11.5px] mt-3" style={{ color: 'var(--stone)' }}>
                {!avatar ? 'Add a profile picture to complete your profile.' : 'A few details are still missing.'}
              </p>
            )}
          </div>

          <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color: 'var(--ink)' }}>
              Last Login
            </h4>
            <div className="flex items-center gap-3 mt-3">
              <IconBadge icon="activity" color="teal" size={40} />
              <div>
                <div className="text-[13.5px] font-medium" style={{ color: 'var(--ink)' }}>
                  {lastLoginDate} · {lastLoginTime}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                  {lastLoginDevice}
                </div>
                <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--stone)' }}>
                  IP {lastLoginIp}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color: 'var(--ink)' }}>
              Personal Information
            </h4>
            <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
              <InfoRow icon="user" label="Name" value={employee.name} />
              <InfoRow icon="fileText" label="Employee ID" value={employee.employeeId} />
              <InfoRow icon="mail" label="Email" value={employee.email} />
              <InfoRow icon="phone" label="Phone" value={employee.phone} />
            </div>
          </div>

          <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color: 'var(--ink)' }}>
              Employment Information
            </h4>
            <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
              <InfoRow icon="briefcase" label="Company" value={employee.company} />
              <InfoRow icon="users" label="Department" value={employee.department} />
              <InfoRow icon="userCheck" label="Designation" value={employee.designation} />
              <InfoRow icon="calendar" label="Joining Date" value={employee.joiningDate} />
              <InfoRow icon="mapPin" label="Work Location" value={employee.location} />
            </div>
          </div>
        </div>

        <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
              Complaint Summary
            </h4>
            <button
              onClick={() => onNav('complaints')}
              className="focus-ring text-[12px] font-semibold flex items-center gap-1"
              style={{ color: 'var(--coral)' }}
            >
              View all <Icon name="chevronRight" size={13} />
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div className="rounded-xl p-4" style={{ background: 'var(--paper-deep)' }}>
              <div className="font-display text-2xl font-semibold" style={{ color: 'var(--ink)' }}>
                {total}
              </div>
              <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                Total Submitted
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: colorSoft('coral') }}>
              <div className="font-display text-2xl font-semibold" style={{ color: 'var(--coral)' }}>
                {underReview}
              </div>
              <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                Under Review
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: colorSoft('teal') }}>
              <div className="font-display text-2xl font-semibold" style={{ color: 'var(--teal)' }}>
                {resolved}
              </div>
              <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                Resolved
              </div>
            </div>
          </div>
          {latest ? (
            <div
              className="flex items-center justify-between gap-3 rounded-xl p-4 flex-wrap"
              style={{ background: 'var(--paper-deep)' }}
            >
              <div className="flex items-center gap-3">
                <IconBadge icon="flag" color={STAGE_COLOR(latest.stage)} size={36} />
                <div>
                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
                    Latest Complaint Status
                  </div>
                  <div className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                    {latest.id} · {latest.category}
                  </div>
                </div>
              </div>
              <StatusBadge stage={latest.stage} />
            </div>
          ) : (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              No complaints filed yet.
            </p>
          )}
        </div>
      </div>

      <ProfilePictureMenu
        open={picMenuOpen}
        onClose={() => setPicMenuOpen(false)}
        avatar={avatar}
        initials={employee.initials}
        onUpload={(dataUrl) => setAvatar(dataUrl)}
        onRemove={() => setAvatar(null)}
      />
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        draft={draft}
        setDraft={setDraft}
        onSave={saveEdit}
      />
    </section>
  );
};

export default Profile;
