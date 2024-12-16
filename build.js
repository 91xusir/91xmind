const { execSync } = require("child_process");
const path = require("path");
const os = require("os");
const { Console } = require("console");

const scriptPath = __dirname;
const xmindHookPath = path.join(scriptPath, "xmind_hook");
const xmindCliPath = path.join(scriptPath, "xmindcli");
const xmindAdminPath = path.join(scriptPath, "auth_admin");
const xmindApiPath = path.join(scriptPath, "auth_api");

function runCommand(command, cwd = null) {
  try {
    const result = execSync(command, { cwd, stdio: "pipe" });
    console.log(result.toString());
  } catch (error) {
    console.error(`命令执行失败: ${error.cmd}`);
    console.error(`错误信息: ${error.stderr}`);
    throw error;
  }
}

// 编译hook文件
function buildHook() {
  runCommand("npm install", xmindHookPath); // 在xmind_hook目录下运行npm install
  runCommand("npm run build", xmindHookPath);
  console.log("");
}

// 编译xmindcli
function buildXmindcli() {
  const currentDate = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);
  process.env.GOARCH = "amd64";
  process.env.GOOS = "windows";
  let command = `go build -o ../bin/xmindcli_win_amd64_${currentDate}.exe -gcflags=-trimpath=$GOPATH -asmflags=-trimpath=$GOPATH -ldflags -w ${xmindCliPath}/cmd`;
  runCommand(command, xmindCliPath);
  process.env.GOOS = "darwin";
  command = `go build -o ../bin/xmindcli_darwin_amd64_${currentDate} -gcflags=-trimpath=$GOPATH -asmflags=-trimpath=$GOPATH -ldflags -w ${xmindCliPath}/cmd`;
  runCommand(command, xmindCliPath);
  console.log("xmindcli Build succeeded!");
  console.log("output path: " + path.join(xmindCliPath, "../bin"));
  console.log("");
}

// 编译xmind_admin
function buildXmindAdmin() {
  runCommand("npm install", xmindAdminPath);
  runCommand("npm run build", xmindAdminPath);
  console.log("请依次输入下面命令:");
  console.log(`cd ${xmindAdminPath}`);
  console.log("npx wrangler pages deploy dist");
  process.exit(0);
}

// 编译xmind_api
function buildXmindApi() {
  runCommand("npm install", xmindApiPath);
  console.log("依次输入下面命令:");
  console.log(`cd ${xmindApiPath}`);
  console.log("npx wrangler d1 create d1-xmind");
  console.log(`上面这个命令会生成id,自行替换auth_api\\wrangler.toml的database_id字段`);
  console.log("npx wrangler d1 execute d1-xmind --file=./src/db/db.sql --remote");
  console.log("npx wrangler deploy --minify src/index.ts");
  process.exit(0);
}

function promptUser(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

// 主菜单
async function mainMenu() {
  while (true) {
    console.log("1. 构建xmind_api");
    console.log("2. 构建xmind_hook");
    console.log("3. 编译xmindcli");
    console.log("4. 构建xmind_admin");
    console.log("5. 退出");

    const choice = await promptUser("请输入对应数字,按回车确认: ");

    switch (choice) {
      case "1":
        await buildXmindApi();
        break;
      case "2":
        await buildHook();
        break;
      case "3":
        await buildXmindcli();
        break;
      case "4":
        await buildXmindAdmin();
        break;
      case "5":
        console.log("退出");
        process.exit(0);
      default:
        console.log("无效的选择，请重新输入。");
        break;
    }
  }
}

mainMenu(); // 启动菜单
