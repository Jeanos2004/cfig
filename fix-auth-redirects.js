const fs = require('fs');

// 1. Update Admin Dashboard (app/(admin)/admin/page.tsx)
let adminContent = fs.readFileSync('app/(admin)/admin/page.tsx', 'utf-8');

// onAuthStateChanged in Admin
adminContent = adminContent.replace(
  'const unsubscribe = onAuthStateChanged(auth, async (user) => {\n      if (user) {\n        setIsLoggedIn(true);',
  `const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await studentDb.getProfile(user.uid);
        if (profile && profile.profession) {
          router.push("/student/dashboard");
          return;
        }
        setIsLoggedIn(true);`
);

// handleLogin in Admin
adminContent = adminContent.replace(
  'const userCredential = await signInWithEmailAndPassword(auth, username, password);\n      const user = userCredential.user;\n      if (user.email) {',
  `const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      const profile = await studentDb.getProfile(user.uid);
      if (profile && profile.profession) {
        router.push("/student/dashboard");
        return;
      }
      if (user.email) {`
);

fs.writeFileSync('app/(admin)/admin/page.tsx', adminContent, 'utf-8');


// 2. Update Student Dashboard (app/(student)/student/dashboard/page.tsx)
let studentDashboard = fs.readFileSync('app/(student)/student/dashboard/page.tsx', 'utf-8');

studentDashboard = studentDashboard.replace(
  'const [p, list] = await Promise.all([\n          studentDb.getProfile(currentUser.uid),\n          studentDb.getCourses()\n        ]);\n        setProfile(p);\n        setCourses(list);',
  `const [p, list] = await Promise.all([
          studentDb.getProfile(currentUser.uid),
          studentDb.getCourses()
        ]);
        if (!p || !p.profession) {
          router.push("/admin");
          return;
        }
        setProfile(p);
        setCourses(list);`
);

fs.writeFileSync('app/(student)/student/dashboard/page.tsx', studentDashboard, 'utf-8');


// 3. Update Student Login (app/(student)/student/login/page.tsx)
let studentLogin = fs.readFileSync('app/(student)/student/login/page.tsx', 'utf-8');

studentLogin = studentLogin.replace(
  'await signInWithEmailAndPassword(auth, email, password);\n        router.push("/student/dashboard");',
  `const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await studentDb.getProfile(cred.user.uid);
        if (!profile || !profile.profession) {
          router.push("/admin");
        } else {
          router.push("/student/dashboard");
        }`
);

fs.writeFileSync('app/(student)/student/login/page.tsx', studentLogin, 'utf-8');

console.log("Auth redirects updated!");
