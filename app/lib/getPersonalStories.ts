import fs from 'fs';
import path from 'path';

export function getPersonalStories() {
  const personalStoriesPath = path.join(process.cwd(), 'public', 'data/personalStories.md');
  const personalStories = fs.readFileSync(personalStoriesPath, 'utf-8');

  return personalStories;
}