const fs = require('fs/promises');
const path = require('path');

const MAX_PQR = 'C:\\pqr.info';
const TED_PQR = '\\\\ted\\pqr.info';
const MAX_SHARED = 'C:\\Users\\theal\\.gemini\\config\\plugins\\shared_brain\\skills';
const TED_SHARED = '\\\\ted\\Users\\theal\\.gemini\\config\\plugins\\shared_brain\\skills';

const SAFE_PATTERNS = [
  '.agents/skills',
  '.gemini/config/plugins',
  'antigravity-backup/skills',
  'science/plugins/skills',
  'extensions',
  'mev',
  'portal-src/skills'
];

async function findSkills(baseDir) {
  const skillsFound = [];
  
  async function search(dir, depth = 0) {
    if (depth > 5) return;
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          const fullPath = path.join(dir, item.name);
          
          // Check if this is a 'skills' folder
          if (item.name === 'skills') {
            // Found a skills folder, let's grab all its subfolders
            try {
              const subItems = await fs.readdir(fullPath, { withFileTypes: true });
              for (const subItem of subItems) {
                if (subItem.isDirectory()) {
                  const skillPath = path.join(fullPath, subItem.name);
                  try {
                    await fs.access(path.join(skillPath, 'SKILL.md'));
                    // It's a skill!
                    // Check if it's in a safe path
                    const relPath = path.relative(baseDir, skillPath).replace(/\\/g, '/');
                    if (SAFE_PATTERNS.some(p => relPath.includes(p))) {
                      skillsFound.push({ name: subItem.name, path: skillPath });
                    }
                  } catch (e) {
                    // Not a skill
                  }
                }
              }
            } catch (e) {}
          } else {
            await search(fullPath, depth + 1);
          }
        }
      }
    } catch (err) {
      // Ignore
    }
  }

  await search(baseDir);
  return skillsFound;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function run() {
  console.log('Finding skills on Max...');
  const maxSkills = await findSkills(MAX_PQR);
  console.log(`Found ${maxSkills.length} skills on Max.`);

  console.log('Finding skills on Ted...');
  const tedSkills = await findSkills(TED_PQR);
  console.log(`Found ${tedSkills.length} skills on Ted.`);

  const allSkillNames = new Set([...maxSkills.map(s => s.name), ...tedSkills.map(s => s.name)]);
  
  const finalSkillsToCopy = []; // { sourcePath, finalName }

  for (const name of allSkillNames) {
    const fromMax = maxSkills.find(s => s.name === name);
    const fromTed = tedSkills.find(s => s.name === name);

    if (fromMax && fromTed) {
      // Collision
      finalSkillsToCopy.push({ sourcePath: fromMax.path, finalName: `${name}_max` });
      finalSkillsToCopy.push({ sourcePath: fromTed.path, finalName: `${name}_ted` });
    } else if (fromMax) {
      finalSkillsToCopy.push({ sourcePath: fromMax.path, finalName: name });
    } else if (fromTed) {
      finalSkillsToCopy.push({ sourcePath: fromTed.path, finalName: name });
    }
  }

  console.log(`Copying ${finalSkillsToCopy.length} aggregated skills to Max and Ted shared_brains...`);

  for (const skill of finalSkillsToCopy) {
    // We do NOT want to copy from the shared_brain destination into the shared_brain destination, 
    // so we skip if source is already inside shared_brain
    if (skill.sourcePath.includes('shared_brain')) continue;

    const destMax = path.join(MAX_SHARED, skill.finalName);
    const destTed = path.join(TED_SHARED, skill.finalName);

    console.log(`Copying ${skill.finalName}...`);
    try {
      await copyDir(skill.sourcePath, destMax);
    } catch(e) { console.error('Error copying to max', skill.finalName, e) }
    try {
      await copyDir(skill.sourcePath, destTed);
    } catch(e) { console.error('Error copying to ted', skill.finalName, e) }
  }

  // Next, explicitly copy the conceptual skills that were generated in Max's shared_brain over to Ted's shared_brain
  const generatedSkills = ['askcopilot', 'copilot-bridge-receiver', 'copilot-sync', 'filesystem_indexer', 'copilot_skill', 'gemma_cobrowse', 'mesh_observatory_skill', 'srrk_route_hint_skill', '8nn_adjacency_skill'];
  for (const gSkill of generatedSkills) {
    const srcMax = path.join(MAX_SHARED, gSkill);
    const destTed = path.join(TED_SHARED, gSkill);
    console.log(`Copying generated conceptual skill ${gSkill} to Ted...`);
    try {
      await copyDir(srcMax, destTed);
    } catch (e) { console.error('Error copying conceptual skill', gSkill, e) }
  }

  console.log('Done!');
}

run().catch(console.error);
