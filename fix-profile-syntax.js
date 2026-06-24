const fs = require('fs');
let c = fs.readFileSync('app/(student)/student/profile/page.tsx', 'utf-8');

c = c.replace(
  '          if (!p || !p.profession) {\n            router.push("/admin");\n    return () => unsub();',
  `          if (!p || !p.profession) {
            router.push("/admin");
            return;
          }
          setProfile(p);
          setFullName(p.fullName);
          setPhone(p.phone || "");
          setProfession(p.profession || "other");
      } else {
        router.push("/student/login");
      }
      setLoading(false);
    });
    return () => unsub();`
);

fs.writeFileSync('app/(student)/student/profile/page.tsx', c, 'utf-8');
console.log("Profile page restored");
