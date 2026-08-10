#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const NODES = [
  { id: 'max', root: 'M:/config/plugins/shared_brain/skills' },
  { id: 'ted', root: 'C:/Users/theal/.gemini/config/plugins/shared_brain/skills' },
];

function hashContent(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function readSkillSnapshots(node) {
  const skillsDir = node.root;
  if (!fs.existsSync(skillsDir)) return [];
  
  const skillNames = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  return skillNames.map(skillName => {
    const skillPath = path.join(skillsDir, skillName);
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    
    let skillMetaHash = null;
    if (fs.existsSync(skillMdPath)) {
        const metaBuf = fs.readFileSync(skillMdPath);
        skillMetaHash = hashContent(metaBuf);
    }

    const files = fs.readdirSync(skillPath, { withFileTypes: true })
      .filter(d => d.isFile() && (d.name.endsWith('.js') || d.name.endsWith('.jsx')))
      .map(d => {
        const p = path.join(skillPath, d.name);
        const stat = fs.statSync(p);
        const buf = fs.readFileSync(p);
        return {
          path: path.relative(node.root, p).replace(/\\/g, '/'),
          hash: hashContent(buf),
          mtime: stat.mtimeMs,
        };
      });

    return { node: node.id, skillName, skillMetaHash, files };
  });
}

function buildReport(snapshots) {
  const bySkill = new Map();
  for (const snap of snapshots) {
    if (!bySkill.has(snap.skillName)) bySkill.set(snap.skillName, []);
    bySkill.get(snap.skillName).push(snap);
  }

  const nodes = NODES.map(n => n.id);
  const skills = [];

  for (const [skillName, group] of bySkill.entries()) {
    const presence = Object.fromEntries(nodes.map(n => [n, false]));
    const metaHashes = {};
    const fileMap = new Map(); // path -> { node -> hash }

    for (const snap of group) {
      presence[snap.node] = true;
      metaHashes[snap.node] = snap.skillMetaHash;
      for (const f of snap.files) {
        if (!fileMap.has(f.path)) fileMap.set(f.path, {});
        fileMap.get(f.path)[snap.node] = f.hash;
      }
    }

    const validHashes = Object.values(metaHashes).filter(Boolean);
    const metaEqual = new Set(validHashes).size <= 1 && validHashes.length === Object.keys(presence).filter(k => presence[k]).length;

    const fileDrift = [];
    for (const [p, hashes] of fileMap.entries()) {
      const unique = new Set(Object.values(hashes).filter(Boolean));
      // Drift if different hashes, or if a node that has the skill is missing the file
      const nodesWithSkill = Object.keys(presence).filter(n => presence[n]);
      const missingInNode = nodesWithSkill.some(n => !hashes[n]);
      if (unique.size > 1 || missingInNode) {
        fileDrift.push({ path: p, hashes });
      }
    }

    skills.push({ skillName, presence, metaEqual, fileDrift });
  }

  return { nodes, skills };
}

function renderCli(report) {
  console.log(`Nodes: ${report.nodes.join(', ')}`);
  console.log('Skill parity:');
  for (const s of report.skills) {
    const status =
      !Object.values(s.presence).every(Boolean) ? 'MISSING' :
      !s.metaEqual ? 'META_DRIFT' :
      s.fileDrift.length ? 'CODE_DRIFT' :
      'OK';

    console.log(`- ${s.skillName}: ${status}`);
    if (status !== 'OK') {
      console.log(`  presence: ${JSON.stringify(s.presence)}`);
      if (!s.metaEqual) console.log('  meta: hashes differ');
      for (const fd of s.fileDrift) {
        console.log(`  file drift: ${fd.path}`);
        console.log(`    hashes: ${JSON.stringify(fd.hashes)}`);
      }
    }
  }
}

function autoRemediate(report, syncFromId) {
    const sourceNode = NODES.find(n => n.id === syncFromId);
    if (!sourceNode) {
        console.error(`Invalid --sync-from node: ${syncFromId}`);
        process.exit(1);
    }
    const targetNodes = NODES.filter(n => n.id !== syncFromId);

    console.log(`\nAuto-remediating drift. Syncing FROM ${syncFromId} to ${targetNodes.map(n=>n.id).join(', ')}...`);
    
    let syncedFiles = 0;
    
    for (const s of report.skills) {
        const hasSource = s.presence[syncFromId];
        if (!hasSource) {
            console.log(`Skipping ${s.skillName}: missing in source node ${syncFromId}`);
            continue;
        }

        const sourceSkillDir = path.join(sourceNode.root, s.skillName);
        
        for (const targetNode of targetNodes) {
            const targetSkillDir = path.join(targetNode.root, s.skillName);
            if (!fs.existsSync(targetSkillDir)) {
                fs.mkdirSync(targetSkillDir, { recursive: true });
            }
            
            // Sync SKILL.md
            const sourceMd = path.join(sourceSkillDir, 'SKILL.md');
            const targetMd = path.join(targetSkillDir, 'SKILL.md');
            if (fs.existsSync(sourceMd)) {
                fs.copyFileSync(sourceMd, targetMd);
                syncedFiles++;
            }
            
            // Sync JS/JSX files
            if (fs.existsSync(sourceSkillDir)) {
                const files = fs.readdirSync(sourceSkillDir, { withFileTypes: true })
                    .filter(d => d.isFile() && (d.name.endsWith('.js') || d.name.endsWith('.jsx')));
                for (const file of files) {
                    const sourceFile = path.join(sourceSkillDir, file.name);
                    const targetFile = path.join(targetSkillDir, file.name);
                    fs.copyFileSync(sourceFile, targetFile);
                    syncedFiles++;
                }
            }
        }
    }
    
    console.log(`Synced ${syncedFiles} files from ${syncFromId}. Parity achieved.`);
}

async function main() {
  const snapshots = NODES.flatMap(readSkillSnapshots);
  const report = buildReport(snapshots);
  
  renderCli(report);
  fs.writeFileSync('skill_diff_report.json', JSON.stringify(report, null, 2));
  
  const args = process.argv.slice(2);
  const syncIdx = args.indexOf('--sync-from');
  if (syncIdx !== -1 && args[syncIdx + 1]) {
      autoRemediate(report, args[syncIdx + 1]);
      
      // Verify parity after sync
      console.log('\n--- Verifying Parity After Sync ---');
      const newSnapshots = NODES.flatMap(readSkillSnapshots);
      const newReport = buildReport(newSnapshots);
      renderCli(newReport);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
