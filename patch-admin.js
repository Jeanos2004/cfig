const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', '(admin)', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add CourseSession to imports
content = content.replace(
  'import { studentDb, StudentProfile, StudentCourse, CourseModule, Lecture } from "@/lib/studentDb";',
  'import { studentDb, StudentProfile, StudentCourse, CourseModule, Lecture, CourseSession } from "@/lib/studentDb";'
);

// 2. Change modalTab state
content = content.replace(
  'const [modalTab, setModalTab] = useState<1|2|3|4>(1);',
  'const [modalTab, setModalTab] = useState<1|2|3|4|5>(1);'
);

// 3. Add newModuleSessions state
content = content.replace(
  'const [newModuleProgramme, setNewModuleProgramme] = useState<{ title: string; points: string }[]>([',
  'const [newModuleSessions, setNewModuleSessions] = useState<CourseSession[]>([]);\n  const [newModuleProgramme, setNewModuleProgramme] = useState<{ title: string; points: string }[]>(['
);

// 4. Update resetModuleForm
content = content.replace(
  'setNewModuleProgramme([{ title: "", points: "" }]);',
  'setNewModuleProgramme([{ title: "", points: "" }]);\n    setNewModuleSessions([]);'
);

// 5. Update startEditModule (inserting state loading)
content = content.replace(
  'setEditingModule({ catIndex, modIndex, oldTitle: mod.titre });',
  'setNewModuleSessions(mod.sessions || []);\n    setEditingModule({ catIndex, modIndex, oldTitle: mod.titre });'
);

// 6. Update moduleData to save sessions
content = content.replace(
  '        details,\n      };',
  '        details,\n        sessions: newModuleSessions,\n      };'
);

// 7. Update UI Tabs
content = content.replace(
  '(["Infos Générales", "Fiche Technique", "Pédagogie", "Programme"] as const)',
  '(["Infos Générales", "Fiche Technique", "Pédagogie", "Programme", "Séances & Agenda"] as const)'
);

// 8. Update onClick type cast
content = content.replace(
  'onClick={() => setModalTab((i + 1) as 1|2|3|4)}',
  'onClick={() => setModalTab((i + 1) as 1|2|3|4|5)}'
);

// 9. Update UI controls below the modal
content = content.replace(
  'setModalTab((modalTab - 1) as 1|2|3|4)',
  'setModalTab((modalTab - 1) as 1|2|3|4|5)'
);
content = content.replace(
  'modalTab < 4',
  'modalTab < 5'
);
content = content.replace(
  'setModalTab((modalTab + 1) as 1|2|3|4)',
  'setModalTab((modalTab + 1) as 1|2|3|4|5)'
);

// 10. Add Tab 5 JSX
const tab4EndIndex = content.indexOf('{modalTab === 4 && (');
if (tab4EndIndex !== -1) {
  // We need to inject Tab 5 right after Tab 4 block. Let's find a reliable anchor.
  // We will just replace `{modalTab === 4 && (` with itself AND tab 5. Actually, let's inject BEFORE it or after.
  // Let's inject tab 5 UI just before tab 4.
  const tab5UI = `
                {modalTab === 5 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-200">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase">Séances & Agenda</h4>
                        <p className="text-[10px] text-gray-500">Ajoutez les dates, heures, lieux et liens Zoom des séances.</p>
                      </div>
                      <button type="button" onClick={() => setNewModuleSessions([...newModuleSessions, { id: 'session-'+Date.now(), title: 'Nouvelle séance', date: new Date().toISOString(), duration: '2 heures', location: 'Siège CFIG', meetUrl: '', resources: [] }])} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[10px] uppercase font-bold hover:bg-[var(--color-primary)] transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Nouvelle Séance
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newModuleSessions.map((session, sIdx) => (
                        <div key={session.id} className="border border-gray-200 p-4 relative bg-slate-50">
                          <button type="button" onClick={() => setNewModuleSessions(newModuleSessions.filter((_, i) => i !== sIdx))} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Titre de la séance</label>
                              <input type="text" value={session.title} onChange={e => { const list = [...newModuleSessions]; list[sIdx].title = e.target.value; setNewModuleSessions(list); }} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-white" placeholder="Ex: Introduction à Excel" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date et Heure (Format ISO)</label>
                              <input type="datetime-local" value={session.date.slice(0,16)} onChange={e => { const list = [...newModuleSessions]; list[sIdx].date = new Date(e.target.value).toISOString(); setNewModuleSessions(list); }} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-white" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Durée</label>
                              <input type="text" value={session.duration} onChange={e => { const list = [...newModuleSessions]; list[sIdx].duration = e.target.value; setNewModuleSessions(list); }} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-white" placeholder="Ex: 2 heures" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Lieu</label>
                              <input type="text" value={session.location} onChange={e => { const list = [...newModuleSessions]; list[sIdx].location = e.target.value; setNewModuleSessions(list); }} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-white" placeholder="Ex: Salle A, Siège CFIG" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Lien Zoom / Meet (Optionnel)</label>
                              <input type="url" value={session.meetUrl || ""} onChange={e => { const list = [...newModuleSessions]; list[sIdx].meetUrl = e.target.value; setNewModuleSessions(list); }} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-white" placeholder="Ex: https://zoom.us/j/123456" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {newModuleSessions.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4 italic">Aucune séance définie. Les étudiants ne verront aucun agenda pour ce cours.</p>
                      )}
                    </div>
                  </div>
                )}
`;
  content = content.replace('{modalTab === 4 && (', tab5UI + '\n                {modalTab === 4 && (');
}

// 11. REMOVE STUDENT COURSES TAB ENTIRELY
// Remove the activeTab property from useState
content = content.replace(' | "student-courses"', '');

// Remove the item from sidebars (we know there are two instances)
const menuEntry = '{ id: "student-courses", label: "Cours Espace Étudiant", icon: <BookOpen className="w-4 h-4" /> },';
content = content.replace(menuEntry, '');
content = content.replace(menuEntry, ''); // Replace the second one

// Find the huge student-courses block and remove it. It starts with `{activeTab === "student-courses" && (`
const blockStart = '{activeTab === "student-courses" && (';
const blockStartIndex = content.indexOf(blockStart);
if (blockStartIndex !== -1) {
  // It's a huge block. A simple way is to replace `{activeTab === "student-courses" && (` with `{false && (` to just hide it and kill it, effectively removing it from the DOM.
  // Wait, `false && (` is safer and doesn't require matching brackets in JS!
  content = content.replace(blockStart, '{false && /* removed student courses */ (');
}

// Same for the studentCourseModal
const modalStart = '{showStudentCourseModal && (';
if (content.indexOf(modalStart) !== -1) {
  content = content.replace(modalStart, '{false && /* removed student course modal */ (');
}


fs.writeFileSync(filePath, content, 'utf-8');
console.log('Patch completed!');
