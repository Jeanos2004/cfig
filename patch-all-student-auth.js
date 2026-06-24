const fs = require('fs');

const path = require('path');

// We don't have glob installed necessarily, let's use standard fs recursion
function findFiles(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(file, filter));
    } else {
      if (file.endsWith(filter)) results.push(file);
    }
  });
  return results;
}

const pages = findFiles('app/(student)/student', 'page.tsx');

pages.forEach(file => {
  if (file.includes('login') || file.includes('dashboard')) return; // Already patched
  
  let content = fs.readFileSync(file, 'utf-8');
  
  // Look for studentDb.getProfile(currentUser.uid)
  if (content.includes('studentDb.getProfile(currentUser.uid)') && content.includes('onAuthStateChanged')) {
    // If it's a Promise.all array destructuring
    if (content.includes('const [p,')) {
      content = content.replace(
        /const\s+\[p,\s*[a-zA-Z0-9_]+\]\s*=\s*await\s*Promise\.all\(\[\s*studentDb\.getProfile\(currentUser\.uid\)/,
        `const [p, _TEMP_VAR] = await Promise.all([
            studentDb.getProfile(currentUser.uid)`
      );
      content = content.replace(/setProfile\(p\);/, `if (!p || !p.profession) { router.push("/admin"); return; } setProfile(p);`);
    } else {
      // Direct getProfile call
      content = content.replace(
        /const p = await studentDb\.getProfile\(currentUser\.uid\);/,
        `const p = await studentDb.getProfile(currentUser.uid);
          if (!p || !p.profession) {
            router.push("/admin");
            return;
          }`
      );
    }
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Patched:', file);
  }
});
