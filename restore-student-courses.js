const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', '(admin)', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Re-add the state
content = content.replace(
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);',
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);'
);

// Re-add the fetch
content = content.replace(
  'setStudents(await db.getStudents());',
  'setStudents(await db.getStudents());\n    setStudentCourses(await studentDb.getCourses());'
);

// Fix totalLectures (which is now sessions)
content = content.replace(/let totalLectures = 0;/g, 'let totalLectures = 0;');
content = content.replace(/matchedCourse\.modules\.forEach\(\(m: any\) => \{/g, 'matchedCourse.modules.forEach((m: any) => {');
content = content.replace(/totalLectures \+= m\.lectures\?\.length \|\| 0;/g, 'totalLectures += m.sessions?.length || 0;');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Restored studentCourses state!');
