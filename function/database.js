const fs = require('fs');
const path = require('path');

let providerInstance = null;

async function provider() {
    class Local {
        data = {};
        file = path.join(process.cwd(), 'options/database.json');

        read() {
            let data;
            if (fs.existsSync(this.file)) {
                try {
                    data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
                } catch (err) {
                    console.error(`Error parsing JSON from file ${this.file}: ${err}`);
                    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2), 'utf8');
                    data = this.data;
                }
            } else {
                console.log(`Database file not found, creating: ${this.file}`);
                const dirname = path.dirname(this.file);
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }
                fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2), 'utf8');
                data = this.data;
            }
            return data;
        }

        write(data) {
            this.data = data !== undefined ? data : global.db;

            const dirname = path.dirname(this.file);
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true });
            }
            fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2), 'utf8');
            return this.file;
        }
    }
    return { Local };
}

async function getProvider() {
    if (!providerInstance) {
        providerInstance = await provider();
    }
    return providerInstance;
}

module.exports = {
    getProvider
};