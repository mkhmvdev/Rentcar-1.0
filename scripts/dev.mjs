// Butun loyihani bitta buyruq bilan ishga tushiradi:  npm run dev
//
//   http://localhost:3000         — sayt
//   http://localhost:3000/admin/  — admin panel (Next.js uni ichkarida Django'ga uzatadi)
//
// Ishga tushadi: Django (127.0.0.1:8000, faqat ichki), Telegram bot (backend/.env da sozlangan bo'lsa), Next.js.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const backend = join(root, "backend");
const python = process.platform === "win32"
  ? join(backend, "venv", "Scripts", "python.exe")
  : join(backend, "venv", "bin", "python");

if (!existsSync(python)) {
  console.error(
    "Backend virtual muhiti topilmadi. Avval:\n" +
      "  cd backend && python3 -m venv venv && venv/bin/pip install -r requirements.txt && venv/bin/python manage.py migrate",
  );
  process.exit(1);
}

function botConfigured() {
  try {
    const env = readFileSync(join(backend, ".env"), "utf8");
    const value = (key) => env.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim() ?? "";
    const token = value("TELEGRAM_BOT_TOKEN");
    return Boolean(token && value("TELEGRAM_ADMIN_ID") && !token.startsWith("replace-"));
  } catch {
    return false;
  }
}

const COLORS = { django: "\x1b[33m", bot: "\x1b[36m", next: "\x1b[35m" };
const children = [];

function run(name, command, args, cwd) {
  const child = spawn(command, args, { cwd, env: { ...process.env, PYTHONUNBUFFERED: "1" }, stdio: ["ignore", "pipe", "pipe"] });
  const prefix = `${COLORS[name]}[${name}]\x1b[0m `;
  const forward = (stream) => (chunk) => {
    for (const line of chunk.toString().split("\n")) if (line.trim()) stream.write(prefix + line + "\n");
  };
  child.stdout.on("data", forward(process.stdout));
  child.stderr.on("data", forward(process.stderr));
  child.on("exit", (code) => {
    console.log(`${prefix}to'xtadi (kod ${code ?? 0})`);
    if (name !== "bot") shutdown(code ?? 0);
  });
  children.push(child);
}

let stopping = false;
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill("SIGTERM");
  setTimeout(() => process.exit(code), 500);
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

// Yangi migratsiyalar bo'lsa, avval qo'llaymiz.
const migrate = spawnSync(python, ["-W", "ignore", "manage.py", "migrate", "--noinput"], { cwd: backend, stdio: "inherit" });
if (migrate.status !== 0) {
  console.error("Migratsiyalarni qo'llab bo'lmadi.");
  process.exit(migrate.status ?? 1);
}

run("django", python, ["-W", "ignore", "manage.py", "runserver", "127.0.0.1:8000"], backend);
if (botConfigured()) run("bot", python, ["-W", "ignore", "manage.py", "run_bot"], backend);
else console.log(`${COLORS.bot}[bot]\x1b[0m backend/.env da TELEGRAM_BOT_TOKEN/TELEGRAM_ADMIN_ID yo'q — bot ishga tushmadi`);
run("next", process.execPath, [join(root, "node_modules", "next", "dist", "bin", "next"), "dev", ...process.argv.slice(2)], root);

const args = process.argv.slice(2);
const portFlag = args.findIndex((a) => a === "-p" || a === "--port");
const port = portFlag >= 0 ? args[portFlag + 1] : process.env.PORT ?? "3000";
console.log(`\n  Sayt:         http://localhost:${port}\n  Admin panel:  http://localhost:${port}/admin/\n`);
