export const SKILLS = {
  Technical: ['React', 'Python', 'Node.js', 'Java', 'Machine Learning', 'Data Science', 'Blockchain', 'Cloud/AWS', 'Mobile Dev', 'DevOps', 'C++', 'SQL'],
  Design: ['UI/UX', 'Figma', 'Graphic Design', 'Video Editing', '3D Modeling', 'Branding', 'Motion Design', 'Prototyping'],
  Business: ['Marketing', 'Finance', 'Business Strategy', 'Product Management', 'Sales', 'Market Research', 'Pitching', 'Operations'],
  Research: ['Academic Writing', 'Data Analysis', 'Lab Research', 'Survey Design', 'Literature Review', 'Statistics']
};

export const INTERESTS = ['HealthTech', 'FinTech', 'EdTech', 'GreenTech', 'SocialTech', 'Gaming', 'E-Commerce', 'AI/ML', 'IoT', 'Cybersecurity', 'AgriTech', 'SpaceTech'];

export const DEPARTMENTS = ['Engineering', 'Design', 'Business', 'Sciences', 'Arts'];

const AVATARS_BG = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #43cea2, #185a9d)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #f7971e, #ffd200)',
  'linear-gradient(135deg, #00c6ff, #0072ff)',
];

export const sampleProfiles = [
  { id: 1, name: 'Arjun Mehta', department: 'Engineering', year: '3rd Year', skills: ['React', 'Node.js', 'Python', 'Machine Learning'], interests: ['HealthTech', 'AI/ML'], availability: 15, lookingFor: 'Co-founder', bio: 'Full-stack dev passionate about healthcare AI.', avatar: 'AM', avatarBg: AVATARS_BG[0] },
  { id: 2, name: 'Priya Sharma', department: 'Design', year: '2nd Year', skills: ['UI/UX', 'Figma', 'Branding', 'Motion Design'], interests: ['EdTech', 'SocialTech'], availability: 12, lookingFor: 'Teammate', bio: 'Design thinker who loves accessible products.', avatar: 'PS', avatarBg: AVATARS_BG[2] },
  { id: 3, name: 'Rohan Gupta', department: 'Business', year: '4th Year', skills: ['Business Strategy', 'Pitching', 'Finance', 'Market Research'], interests: ['FinTech', 'E-Commerce'], availability: 10, lookingFor: 'Co-founder', bio: 'MBA aspirant with startup experience.', avatar: 'RG', avatarBg: AVATARS_BG[3] },
  { id: 4, name: 'Ananya Krishnan', department: 'Sciences', year: '3rd Year', skills: ['Data Analysis', 'Statistics', 'Python', 'Lab Research'], interests: ['HealthTech', 'GreenTech'], availability: 14, lookingFor: 'Teammate', bio: 'Bioinformatics researcher with data skills.', avatar: 'AK', avatarBg: AVATARS_BG[1] },
  { id: 5, name: 'Karan Patel', department: 'Engineering', year: '2nd Year', skills: ['Mobile Dev', 'Java', 'Cloud/AWS', 'DevOps'], interests: ['IoT', 'Cybersecurity'], availability: 18, lookingFor: 'Teammate', bio: 'Cloud enthusiast building scalable systems.', avatar: 'KP', avatarBg: AVATARS_BG[4] },
  { id: 6, name: 'Meera Nair', department: 'Design', year: '3rd Year', skills: ['Graphic Design', 'Video Editing', '3D Modeling', 'Prototyping'], interests: ['Gaming', 'EdTech'], availability: 16, lookingFor: 'Mentor', bio: 'Visual storyteller and 3D artist.', avatar: 'MN', avatarBg: AVATARS_BG[2] },
  { id: 7, name: 'Vikram Singh', department: 'Business', year: '3rd Year', skills: ['Marketing', 'Sales', 'Product Management', 'Operations'], interests: ['E-Commerce', 'SocialTech'], availability: 12, lookingFor: 'Co-founder', bio: 'Growth hacker with D2C brand experience.', avatar: 'VS', avatarBg: AVATARS_BG[3] },
  { id: 8, name: 'Ishita Das', department: 'Engineering', year: '4th Year', skills: ['Machine Learning', 'Data Science', 'Python', 'SQL'], interests: ['AI/ML', 'HealthTech', 'FinTech'], availability: 20, lookingFor: 'Co-founder', bio: 'ML researcher focused on NLP.', avatar: 'ID', avatarBg: AVATARS_BG[0] },
  { id: 9, name: 'Aditya Rao', department: 'Arts', year: '2nd Year', skills: ['Academic Writing', 'Branding', 'Graphic Design', 'Video Editing'], interests: ['SocialTech', 'EdTech'], availability: 8, lookingFor: 'Teammate', bio: 'Creative writer and visual communicator.', avatar: 'AR', avatarBg: AVATARS_BG[4] },
  { id: 10, name: 'Sneha Joshi', department: 'Sciences', year: '4th Year', skills: ['Data Analysis', 'Literature Review', 'Statistics', 'Survey Design'], interests: ['GreenTech', 'AgriTech'], availability: 10, lookingFor: 'Teammate', bio: 'Environmental scientist with quantitative skills.', avatar: 'SJ', avatarBg: AVATARS_BG[1] },
  { id: 11, name: 'Rahul Iyer', department: 'Engineering', year: '3rd Year', skills: ['Blockchain', 'React', 'Node.js', 'C++'], interests: ['FinTech', 'Cybersecurity'], availability: 15, lookingFor: 'Co-founder', bio: 'Web3 developer and crypto enthusiast.', avatar: 'RI', avatarBg: AVATARS_BG[0] },
  { id: 12, name: 'Divya Menon', department: 'Design', year: '4th Year', skills: ['UI/UX', 'Prototyping', 'Figma', 'Motion Design'], interests: ['HealthTech', 'AI/ML'], availability: 14, lookingFor: 'Teammate', bio: 'Sr. design intern at a health startup.', avatar: 'DM', avatarBg: AVATARS_BG[2] },
  { id: 13, name: 'Nikhil Verma', department: 'Business', year: '2nd Year', skills: ['Finance', 'Market Research', 'Pitching', 'Business Strategy'], interests: ['SpaceTech', 'IoT'], availability: 11, lookingFor: 'Mentor', bio: 'Aspiring venture capitalist.', avatar: 'NV', avatarBg: AVATARS_BG[3] },
  { id: 14, name: 'Kavya Reddy', department: 'Engineering', year: '2nd Year', skills: ['Python', 'Data Science', 'SQL', 'Machine Learning'], interests: ['EdTech', 'GreenTech'], availability: 16, lookingFor: 'Teammate', bio: 'Data science student and open-source contributor.', avatar: 'KR', avatarBg: AVATARS_BG[4] },
  { id: 15, name: 'Tanvi Bhat', department: 'Arts', year: '3rd Year', skills: ['Video Editing', 'Graphic Design', 'Academic Writing', 'Branding'], interests: ['Gaming', 'SocialTech', 'EdTech'], availability: 13, lookingFor: 'Teammate', bio: 'Multimedia artist and content creator.', avatar: 'TB', avatarBg: AVATARS_BG[2] },
];
