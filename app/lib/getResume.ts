import fs from 'fs';
import path from 'path';

export function getResume() {
  const resumePath = path.join(process.cwd(), 'public', 'data/Resume.md');
  const resume = fs.readFileSync(resumePath, 'utf-8');

  return resume;
}