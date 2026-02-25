// ── All static data for the Profile form ──────────────────────────────────────

export const DOMAINS = [
  'AI / Machine Learning', 'Web Development', 'Cybersecurity', 'UI / UX Design',
  'Govt Exams', 'Data Science', 'Mobile Dev', 'DevOps / Cloud',
  'Game Development', 'Digital Marketing', 'Finance / FinTech', 'Other',
];

export const INTERESTS = [
  'Coding', 'Design', 'Data Analysis', 'Gaming', 'Teaching',
  'Finance', 'Writing', 'Research', 'Business', 'Electronics',
  'Networking', 'Mathematics',
];

export const CLASS_LEVELS = ['9', '10', '11', '12'];
export const YEAR_SEMS    = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
export const SENIOR_SCHOOL_STREAMS = ['Science', 'Commerce', 'Arts', 'Still Exploring'];

// Degree keyword → branch options
export const COLLEGE_SPECS = {
  btech: ['CSE', 'ECE', 'Civil', 'Mechanical', 'Chemical', 'IT', 'Other'],
  bca:   ['General', 'Data Science', 'Cybersecurity', 'Other'],
  bsc:   ['Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science', 'Other'],
  mba:   ['Finance', 'Marketing', 'HR', 'Operations', 'Other'],
  mca:   ['General', 'Data Science', 'Cybersecurity', 'Other'],
};

// Branch → sub-specializations (3rd level)
export const BRANCH_SUBSPECS = {
  // B.Tech
  CSE:              ['CSE Core', 'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cybersecurity', 'Blockchain', 'IoT', 'Cloud Computing', 'Full Stack Dev', 'Game Dev', 'DevOps', 'AR / VR', 'Other'],
  ECE:              ['VLSI Design', 'Embedded Systems', 'Signal Processing', 'Communication Systems', 'IoT', 'Robotics', 'RF Engineering', 'Other'],
  Civil:            ['Structural Engineering', 'Environmental Engineering', 'Transportation', 'Geotechnical', 'Construction Management', 'Urban Planning', 'Water Resources', 'Other'],
  Mechanical:       ['Thermal Engineering', 'Manufacturing', 'Robotics & Automation', 'Automotive', 'Aerospace', 'CAD / CAM', 'Fluid Mechanics', 'Other'],
  Chemical:         ['Process Engineering', 'Petrochemical', 'Pharmaceutical', 'Environmental', 'Food Technology', 'Polymer Science', 'Other'],
  IT:               ['Network Security', 'Cloud Computing', 'Full Stack Dev', 'Data Engineering', 'DevOps', 'Software Testing', 'Other'],
  // BCA / MCA
  General:          ['App Development', 'Web Development', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'Networking', 'Other'],
  'Data Science':   ['Machine Learning', 'Deep Learning', 'Business Analytics', 'NLP', 'Computer Vision', 'Big Data', 'Other'],
  Cybersecurity:    ['Ethical Hacking', 'Network Security', 'Digital Forensics', 'Cloud Security', 'Malware Analysis', 'Other'],
  // BSc
  Physics:          ['Astrophysics', 'Quantum Mechanics', 'Nuclear Physics', 'Optics', 'Condensed Matter', 'Other'],
  Chemistry:        ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry', 'Other'],
  Maths:            ['Pure Mathematics', 'Applied Maths', 'Statistics', 'Operations Research', 'Actuarial Science', 'Other'],
  Biology:          ['Zoology', 'Botany', 'Microbiology', 'Genetics', 'Biotechnology', 'Other'],
  'Computer Science': ['Algorithms & DS', 'AI / ML', 'Data Science', 'Networks', 'Other'],
  // MBA
  Finance:          ['Investment Banking', 'FinTech', 'Risk Management', 'CA / CFA', 'Accounting', 'Wealth Management', 'Other'],
  Marketing:        ['Digital Marketing', 'Brand Management', 'Sales', 'Market Research', 'E-Commerce', 'Other'],
  HR:               ['Talent Acquisition', 'Organisational Dev', 'Learning & Development', 'Compensation & Benefits', 'Other'],
  Operations:       ['Supply Chain', 'Logistics', 'Project Management', 'Quality Management', 'Six Sigma', 'Other'],
};

/** Detect degree type from free-text entry */
export function detectDegreeKey(degreeText) {
  const d = degreeText.toLowerCase().replace(/[\s.]/g, '');
  if (d.includes('btech') || d.includes('be')) return 'btech';
  if (d.includes('bca'))                        return 'bca';
  if (d.includes('bsc'))                        return 'bsc';
  if (d.includes('mba'))                        return 'mba';
  if (d.includes('mca'))                        return 'mca';
  return null;
}

// ── Shared style helpers ──────────────────────────────────────────────────────
export const inputCls  = 'w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/20 transition-all disabled:opacity-50';
export const labelCls  = 'block text-sm font-medium text-zinc-300 mb-1.5';
export const chipCls   = (active) =>
  `px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
    active ? 'bg-violet-400/10 border-violet-400 text-violet-300' : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-zinc-400'
  }`;
export const toggleCls = (active) =>
  `flex-1 py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
    active ? 'bg-violet-400/10 border-violet-400 text-violet-300' : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-zinc-400'
  }`;
