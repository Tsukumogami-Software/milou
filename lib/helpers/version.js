import * as fs from "fs"
import upath from "upath"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = upath.dirname(__filename);
const packageJsonPath = upath.join(__dirname, '../../package.json')
const packageJson = fs.readFileSync(packageJsonPath)
const version = JSON.parse(packageJson).version || 0

export default version;
