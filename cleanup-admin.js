const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', '(admin)', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove StudentCourse related states
content = content.replace(/const \[studentCourses, setStudentCourses\] = useState[^;]+;/g, '');
content = content.replace(/const \[showStudentCourseModal, setShowStudentCourseModal\] = useState[^;]+;/g, '');
content = content.replace(/const \[studentCourseModalTab, setStudentCourseModalTab\] = useState[^;]+;/g, '');
content = content.replace(/const \[isSavingStudentCourse, setIsSavingStudentCourse\] = useState[^;]+;/g, '');
content = content.replace(/const \[editingStudentCourseId, setEditingStudentCourseId\] = useState[^;]+;/g, '');
content = content.replace(/const \[scId, setScId\] = useState[^;]+;/g, '');
content = content.replace(/const \[scTitle, setScTitle\] = useState[^;]+;/g, '');
content = content.replace(/const \[scCategory, setScCategory\] = useState[^;]+;/g, '');
content = content.replace(/const \[scDescription, setScDescription\] = useState[^;]+;/g, '');
content = content.replace(/const \[scDuration, setScDuration\] = useState[^;]+;/g, '');
content = content.replace(/const \[scImage, setScImage\] = useState[^;]+;/g, '');
content = content.replace(/const \[scPrice, setScPrice\] = useState[^;]+;/g, '');
content = content.replace(/const \[scModules, setScModules\] = useState[^;]+;/g, '');

// 2. Remove the CRUD actions
const startMarker = '// === STUDENT COURSE CRUD ACTIONS ===';
const endMarker = '// Helper to reset all module form fields';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);
if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + content.substring(endIndex);
}

// 3. Remove `{false && /* removed student courses */ (` and its closing. Actually it's easier to just match the whole thing or leave it but comment out the inner part.
// Wait, replacing `m.lectures` with `m.sessions` and `Lecture` with `CourseSession` will fix the TS errors in any remaining JSX.
content = content.replace(/m\.lectures/g, 'm.sessions');
content = content.replace(/<Lecture>/g, '<CourseSession>');
content = content.replace(/keyof Lecture/g, 'keyof CourseSession');

// Also remove `setStudentCourses(await studentDb.getCourses());` in refreshAllData
content = content.replace(/setStudentCourses\(await studentDb\.getCourses\(\)\);/g, '');

// Remove the `Lecture` import from studentDb
content = content.replace(/Lecture, /g, '');
content = content.replace(/, Lecture/g, '');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Cleanup completed!');
