const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', '(admin)', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add `useMemo` to React imports if not present
if (!content.includes('useMemo')) {
  content = content.replace('useState, useEffect', 'useState, useEffect, useMemo');
}

// 2. Inject the `upcomingClasses` calculation right before `return (` of the `AdminPage`
const returnIndex = content.lastIndexOf('\n  return (');
if (returnIndex !== -1) {
  const calculationCode = `
  // --- UPCOMING CLASSES CALCULATION ---
  const upcomingClasses = useMemo(() => {
    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const todayIndex = new Date().getDay();
    const tomorrowIndex = (todayIndex + 1) % 7;
    const todayName = joursSemaine[todayIndex];
    const tomorrowName = joursSemaine[tomorrowIndex];

    const upcoming: { catIndex: number, modIndex: number, modTitre: string, jour: string, horaire: string }[] = [];

    formations.forEach((cat, catIndex) => {
      cat.modules.forEach((mod, modIndex) => {
        if (mod.details?.planning) {
          mod.details.planning.forEach((p: any) => {
            if (p.jour.toLowerCase() === todayName.toLowerCase() || p.jour.toLowerCase() === tomorrowName.toLowerCase()) {
              upcoming.push({
                catIndex,
                modIndex,
                modTitre: mod.titre,
                jour: p.jour,
                horaire: p.horaire
              });
            }
          });
        }
      });
    });

    return upcoming;
  }, [formations]);
`;
  content = content.substring(0, returnIndex) + calculationCode + content.substring(returnIndex);
}

// 3. Inject the UI in the overview tab
const statsGridMarker = '{/* Stats Grid */}';
const uiCode = `
                {/* Upcoming Classes Alerts */}
                {upcomingClasses.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-widest">Séances Imminentes (24h)</h3>
                        <p className="text-xs text-amber-700">Ces formations ont cours aujourd'hui ou demain. Avez-vous ajouté les liens Zoom ?</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingClasses.map((uc, i) => (
                        <div key={i} className="bg-white border border-amber-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                          <div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-1">{uc.modTitre}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-1">Prévu le : <span className="text-amber-600">{uc.jour} à {uc.horaire}</span></p>
                          </div>
                          <button
                            onClick={() => {
                              startEditModule(formations[uc.catIndex].modules[uc.modIndex], uc.catIndex, uc.modIndex);
                              setTimeout(() => setModalTab(5 as any), 50);
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-900 hover:bg-amber-600 text-white text-[10px] uppercase font-bold tracking-wider transition-colors whitespace-nowrap"
                          >
                            Ajouter la Séance
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
`;

content = content.replace(statsGridMarker, uiCode + '\n                ' + statsGridMarker);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Upcoming alerts added!');
