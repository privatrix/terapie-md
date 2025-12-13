const fs = require('fs');
try {
    const content = fs.readFileSync('.env.local', 'utf8');
    fs.writeFileSync('debug_output.txt', content);
    console.log('Success');
} catch (e) {
    fs.writeFileSync('debug_output.txt', 'Error: ' + e.message);
}
