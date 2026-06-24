const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', '(admin)', 'admin', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Fix the activeTab comparison error:
content = content.replace(/activeTab === "student-courses"/g, 'false');

function removeJSXBlock(startMarker) {
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return;

    let openBrackets = 0;
    let i = startIndex;
    let foundBracket = false;

    for (; i < content.length; i++) {
        if (content[i] === '{') {
            openBrackets++;
            foundBracket = true;
        } else if (content[i] === '}') {
            openBrackets--;
        }

        if (foundBracket && openBrackets === 0) {
            break;
        }
    }

    if (foundBracket && openBrackets === 0) {
        content = content.substring(0, startIndex) + content.substring(i + 1);
    }
}

// 1. Remove the huge "student courses list" block
removeJSXBlock('{false && /* removed student courses */ (');
// 2. Remove the huge "student course modal" block
removeJSXBlock('{false && /* removed student course modal */ (');

// Also remove any lingering `{activeTab === "student-courses" && (` if it wasn't replaced by the previous script
removeJSXBlock('{false && /* removed student courses */');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed admin compilation errors!');
