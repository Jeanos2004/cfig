const fs = require('fs');

const files = [
  'app/(student)/student/billing/page.tsx',
  'app/(student)/student/certificates/page.tsx',
  'app/(student)/student/courses/[id]/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(/const \[p, _TEMP_VAR\] = await Promise\.all\(\[/g, 'const [p, list] = await Promise.all([');
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Fixed:', file);
  }
});
