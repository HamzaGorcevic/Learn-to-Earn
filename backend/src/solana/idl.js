import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const idlFile = path.join(__dirname, "starpoints.json");
const idlJSON = JSON.parse(fs.readFileSync(idlFile, "utf8"));
console.log(idlJSON);
export default idlJSON;
