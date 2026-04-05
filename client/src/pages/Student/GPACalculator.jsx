import { useState, useEffect } from 'react';
import { Button, Select, Input, Card, Modal, message, Tooltip, Popconfirm } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  TrophyOutlined,
  BookOutlined,
  CalculatorOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';

const gradeMap = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0,
  'E': 0.0, 'F': 0.0,
};

const gradeOptions = Object.keys(gradeMap).map(g => ({ value: g, label: g }));

const creditOptions = [1, 2, 3, 4, 5, 6].map(c => ({ value: c, label: `${c} Credit${c > 1 ? 's' : ''}` }));

const defaultSubject = () => ({ id: Date.now() + Math.random(), name: '', grade: null, credits: 3 });
const defaultSemester = () => ({ id: Date.now() + Math.random(), name: '', subjects: [defaultSubject(), defaultSubject(), defaultSubject(), defaultSubject()] });

const STORAGE_KEY = 'studydesk_gpa_data';

const getClassification = (gpa) => {
  if (gpa >= 3.70) return { label: 'First Class Honours', color: '#52c41a', emoji: '🏆' };
  if (gpa >= 3.30) return { label: 'Second Class Upper', color: '#1677ff', emoji: '🥈' };
  if (gpa >= 3.00) return { label: 'Second Class Lower', color: '#722ed1', emoji: '🥉' };
  if (gpa >= 2.00) return { label: 'General Pass', color: '#faad14', emoji: '✅' };
  return { label: 'Fail', color: '#ff4d4f', emoji: '❌' };
};

const GPACalculator = () => {
  const [semesters, setSemesters] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [currentProfileName, setCurrentProfileName] = useState('');
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [targetGpa, setTargetGpa] = useState(null);

  // Load saved profiles on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSavedProfiles(parsed.profiles || []);
        if (parsed.lastSession) {
          setSemesters(parsed.lastSession.semesters || [defaultSemester()]);
          setCurrentProfileName(parsed.lastSession.name || '');
        } else {
          setSemesters([defaultSemester()]);
        }
      } else {
        setSemesters([defaultSemester()]);
      }
    } catch { setSemesters([defaultSemester()]); }
  }, []);

  // Auto-save last session
  useEffect(() => {
    if (semesters.length === 0) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : { profiles: [] };
      data.lastSession = { semesters, name: currentProfileName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [semesters, currentProfileName]);

  // --- Semester CRUD ---
  const addSemester = () => setSemesters(prev => [...prev, defaultSemester()]);
  const removeSemester = (semId) => setSemesters(prev => prev.filter(s => s.id !== semId));
  const updateSemesterName = (semId, name) => setSemesters(prev => prev.map(s => s.id === semId ? { ...s, name } : s));

  // --- Subject CRUD ---
  const addSubject = (semId) => setSemesters(prev => prev.map(s => s.id === semId ? { ...s, subjects: [...s.subjects, defaultSubject()] } : s));
  const removeSubject = (semId, subId) => setSemesters(prev => prev.map(s => s.id === semId ? { ...s, subjects: s.subjects.filter(sub => sub.id !== subId) } : s));
  const updateSubject = (semId, subId, field, value) => setSemesters(prev => prev.map(s => s.id === semId ? { ...s, subjects: s.subjects.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub) } : s));

  // --- GPA Calculations ---
  const calcSemesterGPA = (subjects) => {
    const valid = subjects.filter(s => s.grade && gradeMap[s.grade] !== undefined);
    if (valid.length === 0) return null;
    const totalPoints = valid.reduce((sum, s) => sum + gradeMap[s.grade] * s.credits, 0);
    const totalCredits = valid.reduce((sum, s) => sum + s.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : null;
  };

  const calcCumulativeGPA = () => {
    const allValid = semesters.flatMap(s => s.subjects).filter(s => s.grade && gradeMap[s.grade] !== undefined);
    if (allValid.length === 0) return null;
    const totalPoints = allValid.reduce((sum, s) => sum + gradeMap[s.grade] * s.credits, 0);
    const totalCredits = allValid.reduce((sum, s) => sum + s.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : null;
  };

  const totalCreditsEarned = semesters.flatMap(s => s.subjects).filter(s => s.grade && gradeMap[s.grade] !== undefined).reduce((sum, s) => sum + s.credits, 0);
  const cumulativeGPA = calcCumulativeGPA();
  const classification = cumulativeGPA !== null ? getClassification(cumulativeGPA) : null;

  // --- Save / Load Profiles ---
  const saveProfile = () => {
    if (!currentProfileName.trim()) { message.warning('Please enter a profile name first.'); return; }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : { profiles: [] };
      const idx = data.profiles.findIndex(p => p.name === currentProfileName);
      const profile = { name: currentProfileName, semesters, savedAt: new Date().toISOString() };
      if (idx >= 0) data.profiles[idx] = profile;
      else data.profiles.push(profile);
      data.lastSession = { semesters, name: currentProfileName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedProfiles(data.profiles);
      message.success(`Profile "${currentProfileName}" saved!`);
    } catch { message.error('Failed to save profile.'); }
  };

  const loadProfile = (profile) => {
    setSemesters(profile.semesters);
    setCurrentProfileName(profile.name);
    setLoadModalOpen(false);
    message.success(`Loaded "${profile.name}"`);
  };

  const deleteProfile = (name) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : { profiles: [] };
      data.profiles = data.profiles.filter(p => p.name !== name);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedProfiles(data.profiles);
      message.success(`Deleted profile "${name}"`);
    } catch { message.error('Failed to delete profile.'); }
  };

  const resetAll = () => {
    setSemesters([defaultSemester()]);
    setCurrentProfileName('');
    setTargetGpa(null);
  };

  // --- Target GPA Calculation ---
  const getRequiredGPA = () => {
    if (!targetGpa || !cumulativeGPA) return null;
    const currentCredits = totalCreditsEarned;
    const assumedFutureCredits = 15; // assume an average semester
    const needed = ((targetGpa * (currentCredits + assumedFutureCredits)) - (cumulativeGPA * currentCredits)) / assumedFutureCredits;
    return needed;
  };
  const requiredGPA = getRequiredGPA();

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>
            <CalculatorOutlined /> GPA Calculator
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: 14 }}>
            Calculate your semester & cumulative GPA with Sri Lankan university grading
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Input
            placeholder="Profile name..."
            value={currentProfileName}
            onChange={e => setCurrentProfileName(e.target.value)}
            style={{ width: 160, borderRadius: 8 }}
            size="large"
          />
          <Button icon={<SaveOutlined />} onClick={saveProfile} size="large" style={{ borderRadius: 8 }}>Save</Button>
          <Button icon={<FolderOpenOutlined />} onClick={() => setLoadModalOpen(true)} size="large" style={{ borderRadius: 8 }}>Load</Button>
          <Popconfirm title="Reset everything?" onConfirm={resetAll} okText="Yes" cancelText="No">
            <Button icon={<ReloadOutlined />} danger size="large" style={{ borderRadius: 8 }}>Reset</Button>
          </Popconfirm>
        </div>
      </div>

      {/* Cumulative GPA Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 24
      }}>
        <Card style={{ borderRadius: 12, border: '1px solid var(--border-color)' }} styles={{ body: { padding: 20 } }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Cumulative GPA</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: classification?.color || 'var(--text-primary)', marginTop: 4 }}>
            {cumulativeGPA !== null ? cumulativeGPA.toFixed(2) : '—'}
          </div>
          {classification && <div style={{ fontSize: 13, color: classification.color, fontWeight: 600, marginTop: 4 }}>{classification.emoji} {classification.label}</div>}
        </Card>

        <Card style={{ borderRadius: 12, border: '1px solid var(--border-color)' }} styles={{ body: { padding: 20 } }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Total Credits</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>{totalCreditsEarned}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{semesters.length} Semester{semesters.length !== 1 ? 's' : ''}</div>
        </Card>

        <Card style={{ borderRadius: 12, border: '1px solid var(--border-color)' }} styles={{ body: { padding: 20 } }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Target GPA <Tooltip title="Calculates the GPA you need next semester (assuming 15 credits) to reach your target."><InfoCircleOutlined /></Tooltip>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <Select
              placeholder="Set target..."
              style={{ width: 120 }}
              size="large"
              value={targetGpa}
              onChange={setTargetGpa}
              allowClear
              options={[
                { value: 3.7, label: '3.70 (1st Class)' },
                { value: 3.3, label: '3.30 (2nd Upper)' },
                { value: 3.0, label: '3.00 (2nd Lower)' },
                { value: 2.0, label: '2.00 (Pass)' },
              ]}
            />
          </div>
          {requiredGPA !== null && (
            <div style={{ fontSize: 13, marginTop: 8, color: requiredGPA > 4.0 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
              {requiredGPA > 4.0 ? '⚠️ Not achievable in one semester' : `Need ${requiredGPA.toFixed(2)} GPA next semester`}
            </div>
          )}
        </Card>

        <Card style={{ borderRadius: 12, border: '1px solid var(--border-color)' }} styles={{ body: { padding: 20 } }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Grade Scale</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 8px', marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            {Object.entries(gradeMap).map(([g, p]) => (
              <span key={g}><strong>{g}</strong>={p.toFixed(1)}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* Semesters */}
      {semesters.map((sem, semIdx) => {
        const semGPA = calcSemesterGPA(sem.subjects);
        const semCredits = sem.subjects.filter(s => s.grade).reduce((sum, s) => sum + s.credits, 0);
        return (
          <Card
            key={sem.id}
            style={{ borderRadius: 12, marginBottom: 16, border: '1px solid var(--border-color)' }}
            styles={{ header: { borderBottom: '1px solid var(--border-color)' }, body: { padding: '12px 20px 20px' } }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <BookOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
                <Input
                  value={sem.name}
                  onChange={e => updateSemesterName(sem.id, e.target.value)}
                  placeholder={`Semester ${semIdx + 1}`}
                  variant="borderless"
                  style={{ fontWeight: 700, fontSize: 16, width: 200, padding: '0 4px' }}
                />
                {semGPA !== null && (
                  <span style={{
                    background: getClassification(semGPA).color + '18',
                    color: getClassification(semGPA).color,
                    padding: '2px 10px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                    border: `1px solid ${getClassification(semGPA).color}30`
                  }}>
                    GPA: {semGPA.toFixed(2)}
                  </span>
                )}
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{semCredits} credits</span>
              </div>
            }
            extra={
              semesters.length > 1 ? (
                <Popconfirm title="Remove this semester?" onConfirm={() => removeSemester(sem.id)} okText="Yes" cancelText="No">
                  <Button danger icon={<DeleteOutlined />} type="text" size="small" />
                </Popconfirm>
              ) : null
            }
          >
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 140px 140px 40px',
              gap: 8, marginBottom: 8, padding: '0 4px',
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
              color: 'var(--text-secondary)'
            }}>
              <span>Subject / Module</span>
              <span>Grade</span>
              <span>Credits</span>
              <span></span>
            </div>

            {sem.subjects.map((sub) => (
              <div key={sub.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 140px 140px 40px',
                gap: 8, marginBottom: 8, alignItems: 'center'
              }}>
                <Input
                  placeholder="e.g. Data Structures"
                  value={sub.name}
                  onChange={e => updateSubject(sem.id, sub.id, 'name', e.target.value)}
                  style={{ borderRadius: 8 }}
                />
                <Select
                  placeholder="Grade"
                  value={sub.grade}
                  onChange={v => updateSubject(sem.id, sub.id, 'grade', v)}
                  options={gradeOptions}
                  style={{ width: '100%' }}
                  allowClear
                />
                <Select
                  value={sub.credits}
                  onChange={v => updateSubject(sem.id, sub.id, 'credits', v)}
                  options={creditOptions}
                  style={{ width: '100%' }}
                />
                {sem.subjects.length > 1 && (
                  <Button
                    icon={<DeleteOutlined />}
                    type="text"
                    danger
                    size="small"
                    onClick={() => removeSubject(sem.id, sub.id)}
                  />
                )}
              </div>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => addSubject(sem.id)}
              style={{ width: '100%', marginTop: 4, borderRadius: 8 }}
            >
              Add Subject
            </Button>
          </Card>
        );
      })}

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={addSemester}
        block
        size="large"
        style={{
          height: 48, borderRadius: 12, fontSize: 15, fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none'
        }}
      >
        Add Semester
      </Button>

      {/* Load Profile Modal */}
      <Modal
        open={loadModalOpen}
        onCancel={() => setLoadModalOpen(false)}
        footer={null}
        title={<><FolderOpenOutlined /> Saved GPA Profiles</>}
        centered
      >
        {savedProfiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
            <CalculatorOutlined style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }} />
            <p>No saved profiles yet. Calculate your GPA and save it!</p>
          </div>
        ) : (
          savedProfiles.map(p => (
            <div key={p.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderRadius: 10, marginBottom: 8,
              border: '1px solid var(--border-color)', background: 'var(--bg-secondary)'
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {p.semesters.length} semester{p.semesters.length !== 1 ? 's' : ''} · Saved {new Date(p.savedAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="primary" size="small" onClick={() => loadProfile(p)}>Load</Button>
                <Popconfirm title="Delete this profile?" onConfirm={() => deleteProfile(p.name)} okText="Yes" cancelText="No">
                  <Button danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
};

export default GPACalculator;
